import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('user_id').primary().defaultTo(knex.raw('(UUID())'));
      table.string('login', 255).unique().notNullable();
      table.string('password', 255).notNullable();
      table.enum('user_type', ['SUDO', 'USER']).defaultTo("USER");
    })
    .createTable('farms', (table) => {
      table.string('farm_id').primary();
      table.string('farm_name').notNullable();
      table.string('farm_city').notNullable();
      table.float('farm_lng').notNullable();
      table.float('farm_lat').notNullable();
      table.uuid('user_id').references('user_id').inTable('users').index().notNullable();
    })
    .createTable('nodes', (table) => {
      table.string('node_id').primary();
      table.string('gateway');

      table.string('farm_id').references('farm_id').inTable('farms').index();
    })
    .createTable('pivots', (table) => {
      table.string('pivot_id').primary();
      table.integer('pivot_name').notNullable();
      table.float('pivot_lng').notNullable();
      table.float('pivot_lat').notNullable();
      table.float('pivot_start_angle').notNullable();
      table.float('pivot_end_angle').notNullable();
      table.float('pivot_radius').notNullable();
      table.integer('radio_id').notNullable();
      table.datetime('last_communication').notNullable();

      table.string('node_id').references('node_id').inTable('nodes').index().notNullable();
    })
    .createTable('states', (table) => {
      table.uuid('state_id').primary().defaultTo(knex.raw('(UUID())'));
      table.boolean('power');
      table.boolean('water');
      table.boolean('direction');
      table.boolean('connection').notNullable();
      table.datetime('timestamp').notNullable();

      table.uuid('pivot_id').references('pivot_id').inTable('pivots').index().notNullable();
    })
    .createTable('state_variables', (table) => {
      table.uuid('state_variable_id').primary().defaultTo(knex.raw('(UUID())'));
      table.float('angle');
      table.string('father');
      table.float('rssi');
      table.float('percentimeter');
      table.datetime('timestamp').notNullable();

      table.uuid('state_id').references('state_id').inTable('states').index().notNullable();
    })
    .createTable('actions', (table) => {
      table.uuid('action_id').primary().defaultTo(knex.raw('(UUID())'));
      table.enum('power', ['ON', 'OFF']).notNullable();
      table.enum('water', ['WET', 'DRY']).notNullable();
      table.enum('direction', ['CLOCKWISE', 'ANTI_CLOCKWISE']).notNullable();
      table.float('percentimeter').notNullable();
      table.boolean('success').defaultTo(false);
      table.datetime('timestamp_sent').notNullable();
      table.datetime('timestamp_success');

      table.uuid('author').references('user_id').inTable('users').index().notNullable();
      table.uuid('pivot_id').references('pivot_id').inTable('pivots').index().notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {}
