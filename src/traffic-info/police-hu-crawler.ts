import axios from 'axios';

import {
  countries, Countries, CrossingInfo, extractCrossingInformation,
  infoUrlForCountry
} from './police-hu';

export type Crossings = {
  [K in Countries]?: CrossingInfo[];
};

function fetchTrafficContent(country: Countries): Promise<[Countries, CrossingInfo[]]> {
  const url = infoUrlForCountry(country);
  const DEFAULT_REQUEST_TIMEOUT = 10000;
  const infoQuery = axios.get(url, { timeout: DEFAULT_REQUEST_TIMEOUT });
  return infoQuery.then(
    (response): [Countries, CrossingInfo[]] => [country, extractCrossingInformation(response.data)]
  );
}

export async function fetchCrossingInformation(): Promise<Crossings> {
  const infos = await Promise.all(countries.map(fetchTrafficContent));

  return infos.reduce((acc, [country, crossings]) => ({
    ...acc,
    [country]: crossings
  }), {});
}
