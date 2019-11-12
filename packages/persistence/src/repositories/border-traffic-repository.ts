import * as Knex from 'knex';
import {DateTime} from 'luxon';
import {createRepository, Entry, Repository} from './repository';

export interface BorderTrafficEntry extends Entry {
  id: number;
  crossingId: number;
  trafficType: 'unspecified' | 'car' | 'bus' | 'truck' | 'all';
  trafficDirection: 'outbound' | 'inbound';
  queueTime: number;
  recordedAt: DateTime;
  createdAt: DateTime;
}

export function borderTrafficRepository(knex: Knex): Repository<BorderTrafficEntry> {
  return createRepository<BorderTrafficEntry>(knex, 'border_taffic_entry', 'id');
}
