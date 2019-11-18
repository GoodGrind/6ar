import * as Knex from 'knex';
import {CROSSING_TABLE_NAME} from './1.00-create-crossings-table';

const HU_BORDER_CROSSING_ENTRIES = [
  // Ukrain crossings
  {'id': 1, 'from': 'Barabás', 'to': 'Koson’', 'foreign_country_code': 'UA', 'open_from':'0700', 'open_until': '1900'},
  {'id': 2, 'from': 'Beregsurány', 'to': 'Астей', 'foreign_country_code': 'UA', 'open_from':'0000', 'open_until': '2400'},
  {'id': 3, 'from': 'Lónya', 'to': 'Dzvinkove', 'foreign_country_code': 'UA', 'open_from':'0700', 'open_until': '1800'},
  {'id': 4, 'from': 'Tiszabecs', 'to': 'Vilok', 'foreign_country_code': 'UA', 'open_from':'0000', 'open_until': '2400'},
  {'id': 5, 'from': 'Záhony', 'to': 'Čop', 'foreign_country_code': 'UA', 'open_from':'0000', 'open_until': '2400'},

  // Romanian crossings
  {'id': 6, 'from': 'Ártánd', 'to': 'Borş', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 7, 'from': 'Battonya', 'to': 'Turnu', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 8, 'from': 'Csanádpalota Autópálya Határátkelő', 'to': 'Nădlac II', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 9, 'from': 'Csengersima', 'to': 'Petea', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 10, 'from': 'Gyula', 'to': 'Vărşand', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 11, 'from': 'Kiszombor', 'to': 'Cenad', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 12, 'from': 'Létavértes', 'to': 'Sacuieni', 'foreign_country_code': 'RO', 'open_from':'0600', 'open_until': '2200'},
  {'id': 13, 'from': 'Méhkerék', 'to': 'Salonta', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 14, 'from': 'Nagylak', 'to': 'Nădlac', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 15, 'from': 'Nyírábrány', 'to': 'Valea Lui Mihai', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  {'id': 16, 'from': 'Vállaj', 'to': 'Urziceni', 'foreign_country_code': 'RO', 'open_from':'0000', 'open_until': '2400'},
  
  // Serbian crossings
  {'id': 17, 'from': 'Ásotthalom', 'to': 'Backi Vinogradi', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 18, 'from': 'Bácsalmás', 'to': 'Bajmok', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 19, 'from': 'Bácsszentgyörgy', 'to': 'Raština', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 20, 'from': 'Hercegszántó', 'to': 'Bački Breg', 'foreign_country_code': 'RS', 'open_from':'0000', 'open_until': '2400'},
  {'id': 21, 'from': 'Röszke', 'to': 'Horgoš autópálya', 'foreign_country_code': 'RS', 'open_from':'0000', 'open_until': '2400'},
  {'id': 22, 'from': 'Röszke', 'to': 'Horgoš közút', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 23, 'from': 'Tiszasziget', 'to': 'Đala', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},
  {'id': 24, 'from': 'Tompa', 'to': 'Kelebija', 'foreign_country_code': 'RS', 'open_from':'0000', 'open_until': '2400'},
  {'id': 25, 'from': 'Kübekháza', 'to': 'Rabe (Rábé)', 'foreign_country_code': 'RS', 'open_from':'0700', 'open_until': '1900'},

  // Crotaian crossings
  {'id': 26, 'from': 'Barcs', 'to': 'Terezino Polje', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 27, 'from': 'Beremend', 'to': 'Baranjsko Petrovo Selo', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 28, 'from': 'Berzence', 'to': 'Gola', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 29, 'from': 'Drávaszabolcs', 'to': 'Donji Miholjac', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 30, 'from': 'Letenye', 'to': 'Goričan I.', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 31, 'from': 'Letenye Autópálya', 'to': 'Goričan II.', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},
  {'id': 32, 'from': 'Udvar', 'to': 'Dubosevica', 'foreign_country_code': 'HR', 'open_from':'0000', 'open_until': '2400'},

  // Austrian crossings
  {'id': 33, 'from': 'Bozsok', 'to': 'Rechnitz', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 34, 'from': 'Bucsu', 'to': 'Schachendorf', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 35, 'from': 'Fertőd', 'to': 'Pamhagen', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 36, 'from': 'Fertőrákos', 'to': 'Mörbisch', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 38, 'from': 'Hegyeshalom', 'to': 'Nickelsdorf autópálya', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 39, 'from': 'Hegyeshalom', 'to': 'Nickelsdorf közút (1-es főút)', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 40, 'from': 'Jánossomorja', 'to': 'Andau', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 41, 'from': 'Kópháza', 'to': 'Deutschkreutz', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 42, 'from': 'Kőszeg', 'to': 'Rattersdorf', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 43, 'from': 'Pinkamindszent', 'to': 'Strem', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 44, 'from': 'Rábafüzes', 'to': 'Heiligenkreutz', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 45, 'from': 'Sopron', 'to': 'Klingenbach', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 46, 'from': 'Szentpéterfa', 'to': 'Eberau', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'},
  {'id': 47, 'from': 'Zsira', 'to': 'Lutzmannsburg', 'foreign_country_code': 'AT', 'open_from':'0000', 'open_until': '2400'}
];

export async function up(knex: Knex): Promise<void> {
  return knex(CROSSING_TABLE_NAME).insert(HU_BORDER_CROSSING_ENTRIES);
}

export async function down(knex: Knex): Promise<void> {
  const refDataIds: number[] = HU_BORDER_CROSSING_ENTRIES.map(crossing => crossing.id);
  return knex(CROSSING_TABLE_NAME).whereIn('id', refDataIds).del();
}
