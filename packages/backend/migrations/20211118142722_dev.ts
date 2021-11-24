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
      table.string('farm_name').notNullable();
      table.string('city').notNullable();
      table.float('farm_lng').notNullable();
      table.float('farm_lat').notNullable();
      table.string('gateway').notNullable();
    })
    .createTable('farm_users', (table) => {
      table.uuid('farm_user_id').primary().defaultTo(knex.raw('(UUID())'));
      table.uuid('user_id').references('user_id').inTable('users').index();
      table.uuid('farm_id').references('farm_id').inTable('farms').index();
    })
    .createTable('pivots', (table) => {
      table.uuid('pivot_id').primary().defaultTo(knex.raw('(UUID())'));
      table.integer('pivot_name').notNullable();
      table.float('pivot_lng').notNullable();
      table.float('pivot_lat').notNullable();
      table.float('pivot_start_angle').notNullable();
      table.float('pivot_end_angle').notNullable();
      table.float('pivot_radius').notNullable();
      table.integer('radio_id').notNullable();

      table.uuid('farm_id').references('farm_id').inTable('farms').index();
    })
    .createTable('states', (table) => {
      table.uuid('state_id').primary().defaultTo(knex.raw('(UUID())'));
      table.boolean('power');
      table.boolean('water');
      table.boolean('direction');
      table.boolean('connection').notNullable();

      table.uuid('pivot_id').references('pivot_id').inTable('pivots').index();
    })
    .createTable('state_variables', (table) => {
      table.uuid('state_variable_id').primary().defaultTo(knex.raw('(UUID())'));
      table.float('angle').notNullable();
      table.string('father').notNullable();
      table.float('rssi').notNullable();
      table.float('percentimeter').notNullable();

      table.uuid('state_id').references('state_id').inTable('states').index();
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('state_variables')
    .dropTable('states')
    .dropTable('pivots')
    .dropTable('farm_users')
    .dropTable('farms')
    .dropTable('users');
}
