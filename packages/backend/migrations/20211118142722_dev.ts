import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('user_id').primary().defaultTo(knex.raw('(UUID())'));
      table.string('login', 255).unique().notNullable();
      table.string('password', 255).notNullable();
      table.string('user_type').notNullable();
    })
    .createTable('farms', (table) => {
      table.uuid('farm_id').primary().defaultTo(knex.raw('(UUID())'));
      table.string('farm_name');
      table.string('city');
      table.float('lng');
      table.float('lat');
      table.string('gateway');
    })
    .createTable('farm_users', (table) => {
      table.uuid('farm_user_id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('user_id').references('user_id').inTable('users').index();
      table.uuid('farm_id').references('farm_id').inTable('farms').index();
    });
}

export async function down(knex: Knex): Promise<void> {}
