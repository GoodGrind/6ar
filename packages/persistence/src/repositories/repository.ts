import * as Knex from 'knex';
import {identity, camelCase, snakeCase, transform} from 'lodash';

export type IdType = number | string;
export type Entry = Record<string, object | number | string>; // eslint-disable-line no-alert

export interface Repository<T extends Entry> {
  find(id: IdType): Promise<T | null>;
  add(entry: T): Promise<IdType>;
  // TODO(snorbi07): add support for Partial<T> as well, since sometimes we only want to work with a subset of a type
  update(id: IdType, newValue: T): Promise<IdType>;
  remove(id: IdType): Promise<void>;
}

interface Mappers {
  fromFieldName: (field: string) => string;
  toFieldName: (field: string) => string;
  fromValue: (field: unknown) => unknown;
  toValue: (field: unknown) => unknown;
}

const DEFAULT_MAPPERS: Mappers = {
  fromFieldName: snakeCase,
  toFieldName: camelCase,
  fromValue: identity,
  toValue: identity
};

// TODO(snorbi07): clean up type handling of this whole thing.
function objectFieldMapper<T extends Entry, M extends Entry>(mapper: (name: string) => string, data: T): M {
  const applyNamingConvetion = (acc: Record<string, unknown>, value: unknown, key: string): void => {
    const keyName = mapper(key);
    acc[keyName] = value;
  };

  const mapped = transform(data as {}, applyNamingConvetion);
  return mapped as unknown as M;
}

export function createRawRepository<T extends Entry>(knex: Knex, tableName: string, idField: string): Repository<T> {
  // NOTE(snobri07): Current impl. assumes a specific naming convention, if you want to configure that, add an options pattern based config to `createRepository`
  async function find(id: IdType): Promise<T | null> {
    return knex(tableName).where(idField, id).first();
  }

  async function add(entry: T): Promise<IdType> {
    return knex(tableName).returning(idField).insert(entry).then(([first, ]) => first);
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
    add,
    update,
    remove
  };
}

export function mappedRepository<T extends Entry, M extends Entry>(repository: Repository<T>, mappers: Mappers = DEFAULT_MAPPERS): Repository<M> {
  const toFieldNames = (entry: T): M => objectFieldMapper(mappers.toFieldName, entry);
  const fromFieldNames = (entry: M): T => objectFieldMapper(mappers.fromFieldName, entry);

  return {
    async find(id: IdType): Promise<M | null> {
      const item = await repository.find(id);
      if (!item) {
        return null;
      }
      return toFieldNames(item);
    },
    async add(entry: M): Promise<IdType> {
      const mappedEntry: T = fromFieldNames(entry);
      return repository.add(mappedEntry);
    },
    async update(id: IdType, newValue: M): Promise<IdType> {
      const mappedEntry: T = fromFieldNames(newValue);
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
