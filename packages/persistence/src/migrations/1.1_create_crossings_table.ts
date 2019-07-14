import * as Knex from 'knex';

const TABLE_NAME = 'crossings';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').unsigned().primary();
    table.string('name').notNullable();
    table.string('foreign_country_code').notNullable();
    table.time('open_from').notNullable();
    table.time('open_until').notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(TABLE_NAME);
}
