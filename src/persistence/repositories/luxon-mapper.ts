import {DEFAULT_MAPPERS, Mappers} from './repository';
import {DateTime} from 'luxon';

export function fromValue(value: unknown): unknown {
  if (!(value instanceof DateTime)) {
    return value;
  }

  // we want to make sure that all dates get stored with an UTC TZ.
  return value.toISO();
}

export function toValue(value: unknown): unknown {
  // no need to handle DateTime cases explicitly here, luxon sorts it out.
  return value;
}

export const DATE_TO_LUXON_MAPPERS: Mappers = {
  ...DEFAULT_MAPPERS,
  fromValue,
  toValue
};
