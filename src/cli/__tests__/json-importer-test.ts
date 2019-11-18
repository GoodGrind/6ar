import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { parseRecordedAt, parseCrossings } from '../json-importer';
import { persistCrossingInfo, COUNTRIES } from '../../police-hu';
import {borderTrafficRepository, crossingRepository} from '../../persistence';


describe('json importer tool file format', () => {
  it('valid file name to recordedAt date in UTC', () => {
    expect.hasAssertions();
    const date = parseRecordedAt('police_hu_2018-12-22T12:02:29.529Z.json');
    expect(date.toISO()).toStrictEqual('2018-12-22T12:02:29.000Z');
    expect(date.zoneName).toStrictEqual('UTC');

  });

  it('file name with invalid recording date format throws an error', () => {
    expect.hasAssertions();
    let unparsableRecordedDate = () => parseRecordedAt('no date for you');
    expect(unparsableRecordedDate).toThrow('Unsupported or invalid date format used in file name, got: no date for you');

    unparsableRecordedDate = () => parseRecordedAt('no_date_for.you');
    expect(unparsableRecordedDate).toThrow('Unsupported or invalid date format used in file name, got: no_date_for.you');
  });

  it('load stored json to importer format', async () => {
    expect.hasAssertions();

    const readFile = promisify(fs.readFile);
    const jsonData = await readFile(path.join(__dirname, 'police_hu_2018-12-22T12:02:29.529Z.json'), { encoding: 'utf-8' });
    const crossings = parseCrossings(jsonData);

    expect(Object.keys(crossings)).toHaveLength(COUNTRIES.length);
    const serbianCrossings = crossings['Serbia'];
    expect(serbianCrossings).toHaveLength(8);
  });

  it('doestsometads', async () => {
    const readFile = promisify(fs.readFile);
    const jsonData = await readFile(path.join(__dirname, 'police_hu_2018-12-22T12:02:29.529Z.json'), { encoding: 'utf-8' });
    const crossings = parseCrossings(jsonData);
    const asd = crossings.Serbia;
    const knex = require('knex')({
      client: 'postgresql',
      connection: 'postgres://6ar:6arpassword@localhost:5432/6ar'
    });

    const brepo = borderTrafficRepository(knex);
    const crepo = crossingRepository(knex);
    const date = parseRecordedAt('police_hu_2018-12-22T12:02:29.529Z.json');
    for (crossing of crossings)
      await persistCrossingInfo(crepo, brepo, date, crossing);
    expect(true).toStrictEqual(true);
  });
  
});
