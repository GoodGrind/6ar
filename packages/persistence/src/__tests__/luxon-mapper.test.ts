import {DateTime} from 'luxon';
import {fromValue, toValue} from '../repositories/luxon-mapper';

describe('repository pattern value mapping for luxon types', () => {
  it('from database date to luxon', async () => {
    expect.hasAssertions();
    const sampleDateWithTZ = new Date(Date.UTC(2019, 11, 12, 19, 19, 19));
    const date = toValue(new Date(sampleDateWithTZ));
    expect(date).toStrictEqual(expect.any(DateTime));
  });
  it('from luxon to date', async () => {
    expect.hasAssertions();
    const sampleDateWithTZ = DateTime.utc(2019, 11, 12, 19, 19, 19);
    const date = fromValue(sampleDateWithTZ);
    expect(date).toStrictEqual(expect.any(Date));
  });
});
