import * as Knex from 'knex';
import {DateTime} from 'luxon';
import {createRepository, Entry, Repository} from './repository';
import {DATE_TO_LUXON_MAPPERS} from './luxon-mapper';

export interface CrossingEntry extends Entry {
  id: number;
  from: string;
  to: string;
  foreignCountryCode: string;
  openFrom: DateTime;
  openUntil: DateTime;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface CrossingRepository extends Repository<CrossingEntry> {
  findByName(crossingFrom: string, crossingTo: string): Promise<CrossingEntry | null>;
}

export function crossingRepository(knex: Knex): CrossingRepository {
  const TABLE_NAME = 'crossing';
  const baseRepo =  createRepository<CrossingEntry>(knex, TABLE_NAME, 'id', DATE_TO_LUXON_MAPPERS);
  return {
    ...baseRepo,
    async findByName(crossingFrom: string, crossingTo: string): Promise<CrossingEntry | null> {
      const items = await this.findWhere({from: crossingFrom, to: crossingTo});
      if (items.length === 0) {
        return null;
      }
      if (items.length > 1) {
        throw new Error(`Multiple crossings found for names: ${crossingFrom} - ${crossingTo}`);
      }
      return items[0];
    }
  };
}
