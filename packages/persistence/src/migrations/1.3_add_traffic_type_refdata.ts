import * as Knex from 'knex';
import {TRAFFIC_TYPE_TABLE_NAME} from './1.2_create_traffic_type_table';

const TRAFFIC_TYPE_REFDATA = [
  {'id': 1, 'code': 0, 'type':'unknown'},
  {'id': 2, 'code': 1, 'type':'car'},
  {'id': 3, 'code': 2, 'type':'bus'},
  {'id': 4, 'code': 3, 'type':'truck'},
  {'id': 5, 'code': 4, 'type':'all'},
];

export async function up(knex: Knex): Promise<void> {
  return knex(TRAFFIC_TYPE_TABLE_NAME).insert(TRAFFIC_TYPE_REFDATA);
}

export async function down(knex: Knex): Promise<void> {
  const refDataIds: number[] = TRAFFIC_TYPE_REFDATA.map(crossing => crossing.id);
  return knex(TRAFFIC_TYPE_TABLE_NAME).whereIn('id', refDataIds).del();
}
