import * as Knex from 'knex';

export const CROSSINGS_TABLE_NAME = 'crossings';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(CROSSINGS_TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary();
    table.string('name').notNullable();
    table.string('foreign_country_code').notNullable();
    table.time('open_from').notNullable();
    table.time('open_until').notNullable();
    table.timestamps(false, true); // use timestamps, with 'now' as default value
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(CROSSINGS_TABLE_NAME);
}
