import { DateTime } from 'luxon';
import { BorderTrafficEntry, CrossingEntry, CrossingRepository, IdType, Repository } from '../persistence';
import { CrossingInfo } from './police-hu';


async function findCrossingEntry(crossingRepository: CrossingRepository, crossingInfo: CrossingInfo): Promise<CrossingEntry | null> {
  const crossingName = `${crossingInfo.from} - ${crossingInfo.to}`;
  return await crossingRepository.findByName(crossingName);
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
  // TODO(snorbi07): missing batch insert based solution.
  let addedEntries: IdType[] = [];
  for (const entry of entries) {
    const id = await borderTrafficRepository.add(entry);
    addedEntries = [...addedEntries, id];
  }

  return addedEntries;
}
