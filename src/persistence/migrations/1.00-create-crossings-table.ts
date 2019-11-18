import * as Knex from 'knex';

export const CROSSING_TABLE_NAME = 'crossing';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(CROSSING_TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary();
    table.string('from').notNullable().comment('Name of the Hungarian city of the border crossing');
    table.string('to').notNullable().comment('Name of the foreign country city of the border crossing');
    table.string('foreign_country_code').notNullable();
    table.time('open_from').notNullable();
    table.time('open_until').notNullable();
    table.timestamps(false, true); // use timestamps, with 'now' as default value
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(CROSSING_TABLE_NAME);
}
