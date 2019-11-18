import * as Knex from 'knex';
import {identity, camelCase, snakeCase, transform} from 'lodash';

export type IdType = number | string;
export type Entry = Record<string, object | number | string | undefined | null>; // eslint-disable-line no-alert

export interface Repository<T extends Entry> {
  find(id: IdType): Promise<T | null>;
  findAll(): Promise<T[]>;
  // TODO(snorbi07): most likely this should be restricted to a type, where only [keyof T] field names are allowed in the criteria
  findWhere(criteria: Entry): Promise<T[]>;
  add(entry: T): Promise<IdType>;
  addAll(entries: T[]): Promise<IdType[]>;
  // TODO(snorbi07): add support for Partial<T> as well, since sometimes we only want to work with a subset of a type
  update(id: IdType, newValue: T): Promise<IdType>;
  remove(id: IdType): Promise<void>;
}

// TODO(snorbi07): consider passing the repository name (table name) and property name to all callbacks... all in all API needs to be revised as we go along.
export interface Mappers {
  fromFieldName: (field: string) => string;
  toFieldName: (field: string) => string;
  fromValue: (field: unknown) => unknown;
  toValue: (field: unknown) => unknown;
}

export const DEFAULT_MAPPERS: Mappers = {
  fromFieldName: snakeCase,
  toFieldName: camelCase,
  fromValue: identity,
  toValue: identity
};

// TODO(snorbi07): clean up type handling of this whole thing.
function objectFieldMapper<T extends Entry, M extends Entry>(nameMapper: (name: string) => string, valueMapper: (value: unknown) => unknown, data: T): M {
  const applyNamingConvetion = (acc: Record<string, unknown>, value: unknown, key: string): void => {
    const mappedName = nameMapper(key);
    const mappedValue = valueMapper(value);
    acc[mappedName] = mappedValue;
  };

  const mapped = transform(data as {}, applyNamingConvetion);
  return mapped as unknown as M;
}

export function createRawRepository<T extends Entry>(knex: Knex, tableName: string, idField: string): Repository<T> {
  // NOTE(snobri07): Current impl. assumes a specific naming convention, if you want to configure that, add an options pattern based config to `createRepository`
  async function find(id: IdType): Promise<T | null> {
    return knex(tableName).where(idField, id).first();
  }

  async function findAll(): Promise<T[]> {
    return knex(tableName);
  }

  async function findWhere(criteria: Entry): Promise<T[]> {
    return knex(tableName).where(criteria);
  }

  async function add(entry: T): Promise<IdType> {
    return knex(tableName).returning(idField).insert(entry).then(([first, ]) => first);
  }

  async function addAll(entries: T[]): Promise<IdType[]> {
    return knex(tableName).returning(idField).insert(entries);
  }

  async function update(id: number, newValue: T): Promise<number>;
  async function update(id: string, newValue: T): Promise<string>;
  async function update(id: IdType, newValue: T): Promise<IdType> {
    return knex(tableName).where({[idField]: id}).update(newValue).returning(idField);
  }

  async function remove(id: IdType): Promise<void> {
    return knex<T>(tableName).where({[idField]: id}).del();
  }

  return {
    find,
    findAll,
    findWhere,
    add,
    addAll,
    update,
    remove
  };
}

export function mappedRepository<T extends Entry, M extends Entry>(repository: Repository<T>, mappers: Mappers = DEFAULT_MAPPERS): Repository<M> {
  const applyToMappings = (entry: T): M => objectFieldMapper(mappers.toFieldName, mappers.toValue, entry);
  const applyFromMappings = (entry: M): T => objectFieldMapper(mappers.fromFieldName, mappers.fromValue, entry);

  return {
    async find(id: IdType): Promise<M | null> {
      const item = await repository.find(id);
      if (!item) {
        return null;
      }
      return applyToMappings(item);
    },
    async findAll(): Promise<M[]> {
      const items = await repository.findAll();
      return items.map(applyToMappings);
    },
    async findWhere(criteria: Entry): Promise<M[]> {
      const items = await repository.findWhere(criteria);
      return items.map(applyToMappings);
    },
    async add(entry: M): Promise<IdType> {
      const mappedEntry: T = applyFromMappings(entry);
      return repository.add(mappedEntry);
    },
    async addAll(entries: M[]): Promise<IdType[]> {
      const mappedEntries: T[] = entries.map((entry) => applyFromMappings(entry));
      return repository.addAll(mappedEntries);
    },
    async update(id: IdType, newValue: M): Promise<IdType> {
      const mappedEntry: T = applyFromMappings(newValue);
      return repository.update(id, mappedEntry);
    },
    async remove(id: IdType): Promise<void> {
      return repository.remove(id);
    }
  };
}

export function createRepository<T extends Entry>(knex: Knex, tableName: string, idField: string, mappers: Mappers = DEFAULT_MAPPERS): Repository<T> {
  const dbRepo: Repository<T> = createRawRepository(knex, tableName, idField);
  return mappedRepository(dbRepo, mappers);
}
