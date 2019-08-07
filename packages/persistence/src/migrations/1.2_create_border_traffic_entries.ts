import * as Knex from 'knex';
import {CROSSINGS_TABLE_NAME} from './1.0_create_crossings_table';

export const BORDER_TRAFFIC_ENTRIES_TABLE_NAME = 'border_traffic_entries';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(BORDER_TRAFFIC_ENTRIES_TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary();

    table.integer('crossing_id').unsigned().notNullable().references('id').inTable(CROSSINGS_TABLE_NAME);

    table.enu('traffic_type', ['unspecified', 'car', 'bus', 'truck', 'all'])
      .notNullable().comment('Specifies the queue times type, as those are dependent on the type of traffic/vehicle');

    table.enu('traffic_direction', ['outbound', 'inbound'])
      .notNullable().comment('Reference of point for traffic direction is Hungary. Outbound means leaving Hungary.')

    table.integer('queue_time').unsigned().notNullable().comment('Queue time in minutes');

    table.dateTime('recorded_at', {useTz: true}).notNullable().comment('Contains the date, when the give queue time was recorded.');

    // knex timestamps shorthand slution is not used, because these entries are immutable, thus we don't need updated_at.
    table.timestamp('created_at', {useTz: true}).notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(BORDER_TRAFFIC_ENTRIES_TABLE_NAME);
}
