import * as cheerio from 'cheerio';
import { isEmpty, zip } from 'lodash';

const POLICE_HU_INFO_BASE_URL = 'http://www.police.hu/hu/hirek-es-informaciok/hatarinfo';

export type Country = 'Ukraine' | 'Romania' | 'Serbia' | 'Croatia' | 'Austria';

export const COUNTRIES: ReadonlyArray<Country> = ['Ukraine', 'Romania', 'Serbia', 'Croatia', 'Austria'];

const CROSSING_INFO_QUERY_PARAMS: Readonly<{ [K in Country]: string }> = Object.freeze({
  Ukraine: '?field_hat_rszakasz_value=ukr%C3%A1n+hat%C3%A1rszakasz',
  Romania: '?field_hat_rszakasz_value=rom%C3%A1n+hat%C3%A1rszakasz',
  Serbia: '?field_hat_rszakasz_value=szerb+hat%C3%A1rszakasz',
  Croatia: '?field_hat_rszakasz_value=horv%C3%A1t+hat%C3%A1rszakasz',
  Austria: '?field_hat_rszakasz_value=osztr%C3%A1k+hat%C3%A1rszakasz'
});

export interface QueueTime {
  car: number;
  bus: number;
  truck: number;
}

export const EMPTY_QUEUE_TIME: Readonly<QueueTime> = Object.freeze({
  car: 0,
  bus: 0,
  truck: 0
});

export interface CrossingInfo {
  from: string;
  to: string;
  openFrom: string;
  openUntil: string;
  inbound: QueueTime;
  outbound: QueueTime;
}

export function infoUrlForCountry(country: Country): string {
  return `${POLICE_HU_INFO_BASE_URL}${CROSSING_INFO_QUERY_PARAMS[country]}`;
}

export function extractLocationNames(crossingText: string): [string, string] {
  // example input to clean up 'Bácsalmás - Bajmok-'
  // remove trailing '-', since we want to split into two parts using the remaining '-' char

  const crossingTextRemoveTrailingWhitespaces = crossingText.trim();
  let text;
  const lastCharacter = crossingTextRemoveTrailingWhitespaces.charAt(crossingTextRemoveTrailingWhitespaces.length - 1);
  //to avoid malformed output, we need to remove the "-" character from the end of crossingText if there are any.
  if (lastCharacter === '-') {
    text = crossingTextRemoveTrailingWhitespaces.substring(0, crossingTextRemoveTrailingWhitespaces.length - 1);
  }
  else {
    text = crossingTextRemoveTrailingWhitespaces.substring(0, crossingTextRemoveTrailingWhitespaces.length);
  }

  let crossingParts = text.split('-');
  const EXPECTED_NUMBER_OF_NAME_SEGMENTS = 2;

  // at this point, if we still don't have the expected number of segments something went wrong
  if (crossingParts.length < EXPECTED_NUMBER_OF_NAME_SEGMENTS) {
    // FIXME: change this to log an error and return the whole text instead. that would be a more resilient approach
    throw new Error(`Unable to parse crossing name for text:${text}`);
  }

  if (crossingParts.length > EXPECTED_NUMBER_OF_NAME_SEGMENTS) {
    // there a crossings with wierd name, such as'Hegyeshalom-Nickelsdorf közút (1-es főút)'
    // in such a case we just make sure to concatanate the second and remaining parts into 1 segment
    const [first, ...rest] = crossingParts;
    crossingParts = [first, rest.join('-')];
  }

  if (crossingParts.length < EXPECTED_NUMBER_OF_NAME_SEGMENTS) {
    // in some cases the '–' charachter is used, so we try splitting based on that.
    // an example for this is 'Bácsszentgyörgy–Raština '
    crossingParts = text.split('–');
  }

  const CROSSING_FROM_INDEX = 0;
  const CROSSING_TO_INDEX = 1;
  return [crossingParts[CROSSING_FROM_INDEX].trim(), crossingParts[CROSSING_TO_INDEX].trim()];
}

export function extractCrossingNames(htmlContent: string) {
  const $ = cheerio.load(htmlContent);

  // Due to how Cheerio works and makes use of `this` scoping, a named function is used instead of arrow function
  const crossingTexts = $('#borderinfo-accordions a > span:first-of-type').map(function(this: Cheerio) {
    return $(this).text().trim();
  }).get();

  return crossingTexts.map(extractLocationNames);
}

export function extractWorkingHours(text: string): [string, string] {
  const [open, close] = text.split('-');
  const openParsedToFloat = parseFloat(open);
  const closeParsedToFloat = parseFloat(close);
  const twoDecimals = 2;
  const paddingToGivenLength = 5;
  const paddingWithZeroes = '0';

  if (isNaN(openParsedToFloat) || isNaN(closeParsedToFloat)) {
    return [
      '00:00',
      '00:00'
    ];
  }
  return[
    openParsedToFloat.toFixed(twoDecimals).padStart(paddingToGivenLength, paddingWithZeroes).replace('.', ':'),
    closeParsedToFloat.toFixed(twoDecimals).padStart(paddingToGivenLength, paddingWithZeroes).replace('.', ':')
  ];
}

export function extractOpenHours(htmlContent: string): Array<[string, string]> {
  const $ = cheerio.load(htmlContent);

  const hoursText = $('#borderinfo-accordions a > span:nth-of-type(2)').map(function(this: Cheerio) {
    return $(this).text();
  }).get();

  return hoursText.map(extractWorkingHours);
}

export function extractQueueTimes(htmlContent: string): Array<{ inbound: QueueTime, outbound: QueueTime }> {
  const $ = cheerio.load(htmlContent);

  // Forced casting is needed here, since Cheerio's type definition for 'get' doesn't take into account mapping,
  // and always returns a string.
  function extractQueueText(this: Cheerio): { inbound: QueueTime, outbound: QueueTime } {
    const $queue = $(this);

    // Find DOM entries that contain the inbound traffic information
    const $outTraffic = $queue.find('div.col-md-3:first-of-type > div:not(.label)');

    const $inTraffic = $queue.find('div.col-md-3:nth-of-type(2) > div:not(.label)');

    const [outbound, ...restOut] = $outTraffic.map(function(this: Cheerio) {
      return extractTrafficEntries($(this));
    }).get() as any as QueueTime[];
    if (!isEmpty(restOut)) {
      throw new Error(`Error occured during the parsing of outbound traffic\n: ${htmlContent}`);
    }

    const [inbound, ...restIn] = $inTraffic.map(function(this: Cheerio) {
      return extractTrafficEntries($(this));
    }).get() as any as QueueTime[];
    if (!isEmpty(restIn)) {
      throw new Error(`Error occured during the parsing of inbound traffic\n: ${htmlContent}`);
    }

    return {
      inbound,
      outbound
    };
  }

  return $('#borderinfo-accordions div.row')
    .map(extractQueueText).get() as any as Array<{ inbound: QueueTime, outbound: QueueTime }>;
}

export function queueTimeToMinutes(queueTime: string): number {
  /*we want to cover the rational number values which cannot be parsed into a usable format e.g '1 1/2 óra'
  to a standard return value of 0
  */
  let numberOfDigitsInqueueTime= 0;

  for (const counter of queueTime){
    if (parseInt(counter)){
      numberOfDigitsInqueueTime++;
    }
  }
  /*
    Converts the police.hu queue time string representation to a number.
    For example, calling this function with '0/2 óra' would result in 30 (minutes).
     TODO: if the text is not parsable, log an error which contains the whole imparsable text.
   */
  if (isEmpty(queueTime) || numberOfDigitsInqueueTime>=3) {
    return 0;
  }

  const HOUR_POSTFIX = 'óra';
  // we want to remove any unnecessary whitespaces and the hour postfix notation.
  // this leaves the rational or whole number representation, meaning 1/2 or 1...
  const hoursInQueue = queueTime.trim().slice(0, -HOUR_POSTFIX.length).trim();
  const isRationalNumber = hoursInQueue.includes('/');

  const RADIX = 10;
  let hours;
  if (isRationalNumber) {
    const [nomninatorPart, denominatorPart] = hoursInQueue.split('/');
    const nominator = parseInt(nomninatorPart, RADIX);
    const denominator = parseInt(denominatorPart, RADIX);
    hours = nominator / denominator;
  } else {
    hours = parseInt(hoursInQueue, RADIX);
  }

  const MINUTES_IN_HOUR = 60;
  return hours * MINUTES_IN_HOUR;
}

function extractTrafficEntries($traffic: Cheerio): QueueTime {
  // Traffic entry DOM tree contains child div entries for specific traffic queue time entires
  // No div entries, means no queue time for anything.
  const car = $traffic.children('div.szgk').text();
  const bus = $traffic.children('div.busz').text();
  const truck = $traffic.children('div.tgk').text();

  return {
    car: queueTimeToMinutes(car),
    bus: queueTimeToMinutes(bus),
    truck: queueTimeToMinutes(truck)
  };
}

export function extractCrossingInformation(content: string): CrossingInfo[] {
  const crossingNames = extractCrossingNames(content);
  const crossingOpenHours = extractOpenHours(content);
  const crossingQueueTimes = extractQueueTimes(content);

  const sameNumberOfEntries =
    crossingNames.length === crossingOpenHours.length &&
    crossingNames.length === crossingQueueTimes.length;
  if (!sameNumberOfEntries) {
    const parsedData = {
      crossingNames,
      crossingOpenHours,
      crossingQueueTimes
    };
    throw new Error(`Different number of parsed entries, got: ${JSON.stringify(parsedData)}`);
  }

  const entries = zip(crossingNames, crossingOpenHours, crossingQueueTimes).map(
    ([
      [from, to] = ['', ''],
      [openFrom, openUntil] = ['', ''],
      { inbound, outbound } = { inbound: EMPTY_QUEUE_TIME, outbound: EMPTY_QUEUE_TIME }
    ]) => ({
      from,
      to,
      openFrom,
      openUntil,
      inbound,
      outbound
    })
  );

  return entries;
}
