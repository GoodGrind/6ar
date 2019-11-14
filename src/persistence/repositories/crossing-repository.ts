import * as Knex from 'knex';
import {DateTime} from 'luxon';
import {createRepository, Entry, Repository} from './repository';
import {DATE_TO_LUXON_MAPPERS} from './luxon-mapper';

export interface CrossingEntry extends Entry {
  id: number;
  name: string;
  foreignCountryCode: string;
  openFrom: DateTime;
  openUntil: DateTime;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export function crossingRepository(knex: Knex): Repository<CrossingEntry> {
  return createRepository<CrossingEntry>(knex, 'crossing', 'id', DATE_TO_LUXON_MAPPERS);
}
