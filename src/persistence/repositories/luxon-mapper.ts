import {DEFAULT_MAPPERS, Mappers} from './repository';
import {DateTime} from 'luxon';

export function fromValue(value: unknown): unknown {
  if (!(value instanceof DateTime)) {
    return value;
  }

  return value.toJSDate();
}

export function toValue(value: unknown): unknown {
  if (!(value instanceof Date)) {
    return value;
  }

  return DateTime.fromJSDate(value);
}

export const DATE_TO_LUXON_MAPPERS: Mappers = {
  ...DEFAULT_MAPPERS,
  fromValue,
  toValue
};
