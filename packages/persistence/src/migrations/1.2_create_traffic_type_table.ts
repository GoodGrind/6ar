import * as Knex from 'knex';

export const TRAFFIC_TYPE_TABLE_NAME = 'traffic_type';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TRAFFIC_TYPE_TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary();
    table.integer('code').notNullable();
    table.string('type').notNullable();
    table.timestamps(false, true); // use timestamps, with 'now' as default value
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(TRAFFIC_TYPE_TABLE_NAME);
}
