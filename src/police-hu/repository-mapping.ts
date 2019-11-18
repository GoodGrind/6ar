import * as levenshtein from 'fast-levenshtein';
import { sortBy } from 'lodash';
import { DateTime } from 'luxon';
import { BorderTrafficEntry, CrossingEntry, CrossingRepository, IdType, Repository } from '../persistence';
import { CrossingInfo } from './police-hu';
import Pino from 'pino';

const logger = Pino();

async function findCrossingEntry(crossingRepository: CrossingRepository, crossingInfo: CrossingInfo): Promise<CrossingEntry | null> {
  const crossings = await crossingRepository.findAll();
  const crossingMatches: { fromDistance: number; toDistance: number; entry: CrossingEntry }[] = crossings.map((entry) => {
    const fromDistance: number = levenshtein.get(crossingInfo.from, entry.from);
    const toDistance: number = levenshtein.get(crossingInfo.to, entry.to);
    return {fromDistance, toDistance, entry};
  });

  const [bestMatch, ] = sortBy(crossingMatches, ['fromDistance', 'toDistance']);  
  if (bestMatch.fromDistance !== 0 || bestMatch.toDistance !== 0) {
    logger.warn({expectedFrom: crossingInfo.from, expectedTo: crossingInfo.to, matchedFrom: bestMatch.entry.from, matchedTo: bestMatch.entry.to}, 'Partial name matching for crossing names');
  }
  
  return bestMatch.entry;
}

function toBorderTrafficEntry(recordedAt: DateTime, crossingId: number, crossingInfo: CrossingInfo): BorderTrafficEntry[] {
  function mkEntries(direction: 'inbound' | 'outbound') {
    let queueTimes = crossingInfo.outbound;
    if (direction === 'inbound') {
      queueTimes = crossingInfo.inbound;
    }

    const trafficTypes: ('truck' | 'bus' | 'car')[] = ['truck', 'bus', 'car'];
    return trafficTypes.map( (trafficType): BorderTrafficEntry => {
      let queueTime = queueTimes.car;
      if (trafficType === 'bus') {
        queueTime = queueTimes.bus;
      }
      if (trafficType === 'truck') {
        queueTime = queueTimes.truck;
      }
      return {
        id: undefined,
        crossingId,
        recordedAt,
        trafficDirection: direction,
        trafficType,
        queueTime
      };
    });
  }

  return [...mkEntries('inbound'), ...mkEntries('outbound')];
}

export async function persistCrossingInfo(crossingRepo: CrossingRepository, borderTrafficRepository: Repository<BorderTrafficEntry>, recordedAt: DateTime, crossingInfo: CrossingInfo): Promise<IdType[]> {
  const crossingEntry = await findCrossingEntry(crossingRepo, crossingInfo);
  if (!crossingEntry) {
    //TODO... creat entry for crossing?
    throw new Error(`Missing crossing station for entry: ${JSON.stringify(crossingInfo)}`);
  }

  const entries = toBorderTrafficEntry(recordedAt, crossingEntry.id, crossingInfo);
  const ids = await borderTrafficRepository.addAll(entries);
  return ids;
}
