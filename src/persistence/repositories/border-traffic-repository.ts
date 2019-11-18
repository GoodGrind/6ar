import * as Knex from 'knex';
import {DateTime} from 'luxon';
import {createRepository, Entry, Repository} from './repository';
import {DATE_TO_LUXON_MAPPERS} from './luxon-mapper';

export interface BorderTrafficEntry extends Entry {
  id?: number;
  crossingId: number;
  trafficType: 'unspecified' | 'car' | 'bus' | 'truck' | 'all';
  trafficDirection: 'outbound' | 'inbound';
  queueTime: number;
  recordedAt: DateTime;
  createdAt?: DateTime;
}

export function borderTrafficRepository(knex: Knex): Repository<BorderTrafficEntry> {
  return createRepository<BorderTrafficEntry>(knex, 'border_traffic_entry', 'id', DATE_TO_LUXON_MAPPERS);
}
