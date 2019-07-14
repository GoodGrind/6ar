import * as Knex from 'knex';

const TABLE_NAME = 'crossings';

const HU_BORDER_CROSSING_ENTRIES = [
  // Ukrain crossings
  {'id': 1, 'name': 'Barabás - Koson’', 'foreign_country_code': 'UA', 'open_from':'0700', 'open_until': '1900'},
  {'id': 2, 'name': 'Beregsurány - Астей', 'foreign_country_code': 'UA', 'open_from':'0000', 'open_until': '2400'},
  {'id': 3, 'name': 'Lónya - Dzvinkove', 'foreign_country_code': 'UA', 'open_from':'0700', 'open_until': '1800'},
  {'id': 4, 'name': 'Tiszabecs - Vilok', 'foreign_country_code': 'UA', 'open_from':'0000', 'open_until': '2400'},
  {'id': 5, 'name': 'Záhony - Čop', 'foreign_country_code': 'UA', 'open_from':'0000', 'open_until': '2400'},

  // Romanian crossings
  {'id': 6, 'name': 'Ártánd - Borş', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 7, 'name': 'Battonya - Turnu', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 8, 'name': 'Csanádpalota Autópálya Határátkelő - Nădlac II', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 9, 'name': 'Csengersima - Petea', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 10, 'name': 'Gyula - Vărşand', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 11, 'name': 'Kiszombor - Cenad', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 12, 'name': 'Létavértes - Sacuieni', 'foreign_country_code': 'RO', 'open_from':'0600', 'open_until': '2200'},
  {'id': 13, 'name': 'Méhkerék - Salonta', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 14, 'name': 'Nagylak - Nădlac', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 15, 'name': 'Nyírábrány - Valea Lui Mihai', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 16, 'name': 'Vállaj - Urziceni', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  
  // Serbian crossings
  {'id': 17, 'name': 'Ásotthalom - Backi Vinogradi', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 18, 'name': 'Bácsalmás - Bajmok', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 19, 'name': 'Bácsszentgyörgy – Raština', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 20, 'name': 'Hercegszántó - Bački Breg', 'foreign_country_code': 'RS', 'open_from':'0000', 'open_until': '2400'},
  {'id': 21, 'name': 'Röszke - Horgoš autópálya', 'foreign_country_code': 'RS', 'open_from':'0000', 'open_until': '2400'},
  {'id': 22, 'name': 'Röszke - Horgoš közút', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 23, 'name': 'Tiszasziget - Đala', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 24, 'name': 'Tompa - Kelebia', 'foreign_country_code': 'RS', 'open_from':'0000', 'open_until': '2400'},

  // Crotaian crossings
  {'id': 25, 'name': 'Barcs - Terezino Polje', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 26, 'name': 'Beremend - Baranjsko Petrovo Selo', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 27, 'name': 'Berzence - Gola', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 28, 'name': 'Drávaszabolcs - Donji Miholjac', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 29, 'name': 'Letenye - Goričan I.', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 30, 'name': 'Letenye Autópálya - Goričan II.', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 31, 'name': 'Udvar - Dubosevica', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},

  // Austrian crossings
  {'id': 32, 'name': 'Bozsok - Rechnitz', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 33, 'name': 'Bucsu - Schachendorf', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 34, 'name': 'Fertőd-Pamhagen', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 35, 'name': 'Fertőrákos-Mörbisch', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 36, 'name': 'Hegyeshalom-Nickelsdorf autópálya', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 37, 'name': 'Jánossomorja-Andau', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 38, 'name': 'Kópháza-Deutschkreutz', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 39, 'name': 'Kőszeg - Rattersdorf', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 40, 'name': 'Pinkamindszent - Strem', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 41, 'name': 'Rábafüzes - Heiligenkreutz', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 42, 'name': 'Sopron-Klingenbach', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 43, 'name': 'Szentpéterfa - Eberau', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 44, 'name': 'Zsira-Lutzmannsburg', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'}
];

export async function up(knex: Knex): Promise<void> {
  return knex(TABLE_NAME).insert(HU_BORDER_CROSSING_ENTRIES);
}

export async function down(knex: Knex): Promise<void> {
  const refDataIds: number[] = HU_BORDER_CROSSING_ENTRIES.map(crossing => crossing.id);
  return knex(TABLE_NAME).whereIn('id', refDataIds).del();
}
