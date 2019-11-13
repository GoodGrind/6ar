import {mappedRepository, Repository, Entry, IdType, DEFAULT_MAPPERS, Mappers} from '../repositories/repository';

interface MockEntry extends Entry {
  id: number;
  someProperty: string;
  someValue: number;
}

interface MockRecord extends Entry {
  id: number;
  some_property: string;
  some_value: number;
}

const mockRepository = (initialData: MockRecord[] = []): Repository<MockRecord> => {
  let storage: MockRecord[] = initialData;
  return {
    async find(id: number): Promise<MockRecord | null> {
      const [item, ] = storage.filter(val => val.id === id);
      return item;
    },
    async add(entry: MockRecord): Promise<number> {
      const nextId = storage.length;
      const item: MockRecord = { ...entry, id: nextId };
      storage = [...storage, item];
      return nextId;
    },
    async update(id: number, newValue: MockRecord): Promise<IdType> {
      const editedRecord = storage[id];
      editedRecord['some_property'] = newValue['some_property'];
      editedRecord['some_value'] = newValue['some_value'];
      return id;
    },
    async remove(id: number): Promise<void> {
      delete storage[id];
    }
  };
};

describe('mapped repository naming convention mapping', () => {

  const setupRepositories = (): [Repository<MockRecord>, Repository<MockEntry>] => {
    const repo = mockRepository();
    const mappedRepo = mappedRepository<MockRecord, MockEntry>(repo);
    return [repo, mappedRepo];
  };

  it('data loaded from storage has naming conventions applied', async () => {
    expect.hasAssertions();

    const [repo, mappedRepo] = setupRepositories();
    repo.add({
      'id': 0,
      'some_property': 'prop',
      'some_value': 42
    });

    const mappedResult = await mappedRepo.find(0);
    expect(mappedResult).toStrictEqual({
      id: 0,
      someProperty: 'prop',
      someValue: 42
    });
  });

  it('new data additions sent to storage have naming convention unapplied', async () => {
    expect.hasAssertions();

    const [repo, mappedRepo] = setupRepositories();

    await mappedRepo.add({
      id: 0,
      someProperty: 'prop',
      someValue: 42
    });

    const item = await repo.find(0);
    expect(item).toStrictEqual({
      'id': 0,
      'some_property': 'prop',
      'some_value': 42
    });
  });

  it('update request sent to storage have naming convention unapplied', async () => {
    expect.hasAssertions();

    const [repo, mappedRepo] = setupRepositories();

    await mappedRepo.add({
      id: 0,
      someProperty: 'prop',
      someValue: 42
    });
    await mappedRepo.update(0, {
      id: 0,
      someProperty: 'prop2',
      someValue: 24
    });

    const item = await repo.find(0);
    expect(item).toStrictEqual({
      'id': 0,
      'some_property': 'prop2',
      'some_value': 24
    });
  });
});

describe('mapped repository value mapping', () => {
  const mappers: Mappers = {
    ...DEFAULT_MAPPERS,
    fromValue: (value: unknown): unknown => {
      if (typeof value === 'number') {
        return `${value}`;
      }

      return value;
    },
    toValue: (value: unknown): unknown => {
      if (typeof value === 'string') {
        return Number.parseInt(value);
      }

      return value;
    }
  };

  const setupRepositories = (): [Repository<MockRecord>, Repository<MockEntry>] => {
    const repo = mockRepository();
    const mappedRepo = mappedRepository<MockRecord, MockEntry>(repo, mappers);
    return [repo, mappedRepo];
  };

  it('new data additions have value mapping applied', async () => {
    expect.hasAssertions();
    const [repo, mappedRepo] = setupRepositories();
    mappedRepo.add({
      id: 0,
      someProperty: 'hello',
      someValue: 42
    });

    const newItem = await repo.find(0);
    expect(newItem && newItem['some_value']).toStrictEqual('42');
  });

  it('updating data triggers value mapping', async () => {
    expect.hasAssertions();
    const [repo, mappedRepo] = setupRepositories();
    repo.add({
      'id': 0,
      'some_property': 'hello',
      'some_value': 42
    });

    mappedRepo.update(0, {
      id: 0,
      someProperty: 'hello',
      someValue: 24
    });

    const newItem = await repo.find(0);
    expect(newItem && newItem['some_value']).toStrictEqual('24');
  });

  it('reading data trigges value mapping', async () => {
    expect.hasAssertions();
    const [repo, mappedRepo] = setupRepositories();
    repo.add({
      'id': 0,
      'some_property': 'hello',
      'some_value': 42
    });

    const newItem = await mappedRepo.find(0);
    expect(newItem && newItem.someProperty).toStrictEqual(NaN);
  });

});
