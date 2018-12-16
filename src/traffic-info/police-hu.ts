import axios from 'axios';
import * as cheerio from 'cheerio';
import { isEmpty, zip } from 'lodash';

const POLICE_HU_INFO_BASE_URL = 'http://www.police.hu/hu/hirek-es-informaciok/hatarinfo';

const CROSSING_INFO_QUERY_PARAMS = Object.freeze({
  Ukraine: '?field_hat_rszakasz_value=ukr%C3%A1n+hat%C3%A1rszakasz',
  Romania: '?field_hat_rszakasz_value=rom%C3%A1n+hat%C3%A1rszakasz',
  Serbia: '?field_hat_rszakasz_value=szerb+hat%C3%A1rszakasz',
  Croatia: '?field_hat_rszakasz_value=horv%C3%A1t+hat%C3%A1rszakasz',
  Austria: '?field_hat_rszakasz_value=osztr%C3%A1k+hat%C3%A1rszakasz'
});

export type NeighboringCountry = keyof typeof CROSSING_INFO_QUERY_PARAMS;

export interface QueueTime {
  car: string;
  bus: string;
  truck: string;
}

const NO_QUEUE = Object.freeze({
  car: '',
  bus: '',
  truck: ''
});

export interface CrossingEntry {
  from: string;
  to: string;
  openFrom: string;
  openUntil: string;
  inbound: QueueTime;
  outbound: QueueTime;
}

function infoUrlForCountry(country: NeighboringCountry): string {
  return `${POLICE_HU_INFO_BASE_URL}${CROSSING_INFO_QUERY_PARAMS[country]}`;
}

function extractLocationNames(crossingText: string): [string, string] {
  // example input to clean up 'Bácsalmás - Bajmok-'
  // remove trailing '-', since we want to split into two parts using the remaining '-' char
  const text = crossingText.substring(0, crossingText.length - 1);
  let crossingParts = text.split('-');
  const EXPECTED_NUMBER_OF_NAME_SEGMENTS = 2;

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

  // at this point, if we still don't have the expected number of segments something went wrong
  if (crossingParts.length < EXPECTED_NUMBER_OF_NAME_SEGMENTS) {
    // FIXME: change this to log an error and return the whole text instead. that would be a more resilient approach
    throw new Error(`Unable to parse crossing name for text:${text}`);
  }

  const CROSSING_FROM_INDEX = 0;
  const CROSSING_TO_INDEX = 1;
  return [crossingParts[CROSSING_FROM_INDEX].trim(), crossingParts[CROSSING_TO_INDEX].trim()];
}

export function parseCrossingNames(htmlContent: string) {
  const $ = cheerio.load(htmlContent);

  // Due to how Cheerio works and makes use of `this` scoping, a named function is used instead of arrow function
  const crossingTexts = $('#borderinfo-accordions a > span:first-of-type').map(function(this: Cheerio) {
    return $(this).text().trim();
  }).get();

  return crossingTexts.map(extractLocationNames);
}

function parseWorkingHours(text: string): [string, string] {
  const [open, close, ...rest] = text.split('-');
  if (!isEmpty(rest)) {
    throw new Error(`Error occured during the parsing of working hours: ${text}`);
  }
  return [
    open.trim().replace('.', ':'),
    close.trim().replace('.', ':')
  ];
}

export function parseOpenHours(htmlContent: string): Array<[string, string]> {
  const $ = cheerio.load(htmlContent);

  const hoursText = $('#borderinfo-accordions a > span:nth-of-type(2)').map(function(this: Cheerio) {
    return $(this).text();
  }).get();

  return hoursText.map(parseWorkingHours);
}

export function parseQueueTimes(htmlContent: string): Array<{ inbound: QueueTime, outbound: QueueTime }> {
  const $ = cheerio.load(htmlContent);

  // Forced casting is needed here, since Cheerio's type definition for 'get' doesn't take into account mapping,
  // and always returns a string.
  function extractQueueText(this: Cheerio): { inbound: QueueTime, outbound: QueueTime } {
    const $queue = $(this);

    // Find DOM entries that contain the inbound traffic information
    const $outTraffic = $queue.find('div.col-md-3:first-of-type > div:not(.label)');

    const $inTraffic = $queue.find('div.col-md-3:nth-of-type(2) > div:not(.label)');

    const [outbound, ...restOut] = $outTraffic.map(function(this: Cheerio) {
      return parseTrafficEntries($(this));
    }).get() as any as QueueTime[];
    if (!isEmpty(restOut)) {
      throw new Error(`Error occured during the parsing of outbound traffic\n: ${htmlContent}`);
    }

    const [inbound, ...restIn] = $inTraffic.map(function(this: Cheerio) {
      return parseTrafficEntries($(this));
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

function parseTrafficEntries($traffic: Cheerio): QueueTime {
  // Traffic entry DOM tree contains child div entries for specific traffic queue time entires
  // No div entries, means no queue time for anything.
  const car = $traffic.children('div.szgk').text();
  const bus = $traffic.children('div.busz').text();
  const truck = $traffic.children('div.tgk').text();

  return {
    car,
    bus,
    truck,
  };
}

function parseContent(content: string): CrossingEntry[] {
  const crossingNames = parseCrossingNames(content);
  const crossingOpenHours = parseOpenHours(content);
  const crossingQueueTimes = parseQueueTimes(content);

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
      { inbound, outbound } = { inbound: NO_QUEUE, outbound: NO_QUEUE }
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

export async function fetchTrafficInfoForCountry(country: NeighboringCountry): Promise<CrossingEntry[]> {
  const url = infoUrlForCountry(country);
  const infoQuery = axios.get(url);
  return infoQuery.then((response) => parseContent(response.data));
}
