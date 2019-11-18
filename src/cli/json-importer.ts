import * as fs from 'fs';
import Knex from 'knex';
import { identity, isEmpty } from 'lodash';
import { DateTime } from 'luxon';
import * as path from 'path';
import { promisify } from 'util';
import { borderTrafficRepository, crossingRepository } from '../persistence';
import { COUNTRIES, CrossingInfo, Crossings, EMPTY_QUEUE_TIME, persistCrossingInfo, QueueTime, queueTimeToMinutes } from '../police-hu';


export function parseRecordedAt(fileName: string): DateTime {
  // json file names are recoded as 'police_hu_DATE.json', where DATE is the timestamp when the entries were recorded
  const [, , dateWithPostfix] = fileName.split('_');
  const ERROR_MSG = `Unsupported or invalid date format used in file name, got: ${fileName}`;
  if (isEmpty(dateWithPostfix)) {
    throw new Error(ERROR_MSG);
  }

  // remove the trailing '.json' extension
  const [recordedAtDate, ] = dateWithPostfix.split('.');
  if (isEmpty(recordedAtDate)) {
    throw new Error(ERROR_MSG);
  }

  const date = DateTime.fromISO(recordedAtDate, {zone: 'UTC'});
  if (!date.isValid) {
    throw new Error(ERROR_MSG);
  }

  return date;
}

function isCrossingInfo(crossing: object): crossing is CrossingInfo {
  const KEYS: (keyof CrossingInfo)[] = ['from', 'to', 'openFrom', 'openUntil', 'inbound', 'outbound'];
  // TODO(snorbi07): currently we only check for the presence of various keys,
  // we are missing the type checks for the values of those fields.
  return KEYS.map((key) => key in crossing).every(identity);
}

// Legacy police.hu JSON formats have their queue times stored in the original raw string representation, we map those to current one during import.
function mapQueueTimeValues(rawQueueTime: Record<string, string | number>): QueueTime {
  const queueTime: QueueTime = {
    ...EMPTY_QUEUE_TIME
  };

  if ('car' in rawQueueTime && typeof rawQueueTime['car'] === 'string') {
    queueTime.car = queueTimeToMinutes(rawQueueTime['car']);
  }
  if ('car' in rawQueueTime && typeof rawQueueTime['car'] === 'number') {
    queueTime.car = rawQueueTime['car'];
  }
  
  if ('bus' in rawQueueTime && typeof rawQueueTime['bus'] === 'string') {
    queueTime.bus = queueTimeToMinutes(rawQueueTime['bus']);
  }
  if ('bus' in rawQueueTime && typeof rawQueueTime['bus'] === 'number') {
    queueTime.bus = rawQueueTime['bus'];
  }

  if ('truck' in rawQueueTime && typeof rawQueueTime['truck'] === 'string') {
    queueTime.truck = queueTimeToMinutes(rawQueueTime['truck']);
  }
  if ('truck' in rawQueueTime && typeof rawQueueTime['truck'] === 'number') {
    queueTime.truck = rawQueueTime['truck'];
  }

  return queueTime;
}

function parseCrossingInfos(countryCrossings: object[]): CrossingInfo[] {
  return countryCrossings.map((crossing) => {
    if (!isCrossingInfo(crossing)) {
      throw new Error(`Unsupported or invalid crossing format, got: ${crossing}`);
    }

    const crossingInfo: CrossingInfo = crossing;
    // we work around the type system here to ensure that legacy types conform to the current type definitions.
    const inbound = crossingInfo.inbound as unknown as Record<string, string | number>;
    const outbound = crossingInfo.outbound as unknown as Record<string, string | number>;
    crossingInfo.inbound = mapQueueTimeValues(inbound);
    crossingInfo.outbound = mapQueueTimeValues(outbound);
    return crossing;
  });
}

export function parseCrossings(jsonFmt: string): Crossings {
  const parsed: Record<string, object> = JSON.parse(jsonFmt);

  let crossings: Crossings = {
    Ukraine: [],
    Romania: [],
    Serbia: [],
    Croatia: [],
    Austria: []
  };
  COUNTRIES.forEach((country) => {
    if (!(country in parsed)) {
      throw new Error(`Unsupported or invalid JSON format, missing country key: ${country}`);
    }
    const countryCrossings = parsed[country];
    if (!Array.isArray(countryCrossings)) {
      throw new Error(`Invalid or unsupported country crossing format, got: ${JSON.stringify(countryCrossings)}`);
    }

    crossings[country] = parseCrossingInfos(countryCrossings as object[]);
  });
  
  return crossings;
}

export async function importToDatabase(knex: Knex, filePath: string): Promise<number> {
  const recodedAt = parseRecordedAt(path.basename(filePath));
  const readFile = promisify(fs.readFile);
  const jsonData = await readFile(filePath, { encoding: 'utf-8' });
  const crossings = parseCrossings(jsonData);

  const crossingRepo = crossingRepository(knex);
  const borderTrafficRepo = borderTrafficRepository(knex);

  let totalNumRecordsAdded = 0;
  for (let country of COUNTRIES) {
    for (let crossing of crossings[country]) {
      const recordsAdded = await persistCrossingInfo(crossingRepo, borderTrafficRepo, recodedAt, crossing);
      totalNumRecordsAdded += recordsAdded.length;
    }
  }

  return totalNumRecordsAdded;
}
