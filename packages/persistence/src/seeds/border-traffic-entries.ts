import * as Knex from 'knex';
import {BORDER_TRAFFIC_ENTRY_TABLE_NAME} from '../migrations/1.02-create-border-traffic-entries';

const MOCK_CROSSING_ENTRIES = [
  {id: 1, 'crossing_id': 1, 'traffic_type': 'car', 'traffic_direction':'outbound', 'queue_time': 30, 'recorded_at': new Date(2019, 9, 1, 13, 0, 0)},
  {id: 2, 'crossing_id': 1, 'traffic_type': 'car', 'traffic_direction': 'outbound', 'queue_time': 30, 'recorded_at': new Date(2019, 9, 1, 13, 15, 0)},
  {id: 3, 'crossing_id': 1, 'traffic_type': 'car', 'traffic_direction': 'outbound', 'queue_time': 30, 'recorded_at': new Date(2019, 9, 1, 13, 30, 0)},
  {id: 4, 'crossing_id': 1, 'traffic_type': 'car', 'traffic_direction': 'outbound', 'queue_time': 30, 'recorded_at': new Date(2019, 9, 1, 13, 45, 0)}
];

export async function seed(knex: Knex): Promise<object> {
  return knex(BORDER_TRAFFIC_ENTRY_TABLE_NAME).del()
    .then(() => knex(BORDER_TRAFFIC_ENTRY_TABLE_NAME).insert(MOCK_CROSSING_ENTRIES));
}
