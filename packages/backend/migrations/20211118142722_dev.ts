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
      table.uuid('farm_id').primary().defaultTo(knex.raw('(UUID())'));
      table.string('farm_name').notNullable();
      table.string('farm_city').notNullable();
      table.float('farm_lng').notNullable();
      table.float('farm_lat').notNullable();
      table.uuid('user_id').references('user_id').inTable('users');
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
      table.datetime('last_communication').notNullable();

      table.uuid('node_id').references('node_id').inTable('nodes').index();
    })
    .createTable('states', (table) => {
      table.uuid('state_id').primary().defaultTo(knex.raw('(UUID())'));
      table.boolean('power');
      table.boolean('water');
      table.boolean('direction');
      table.boolean('connection').notNullable();
      table.datetime('timestamp').notNullable();

      table.uuid('pivot_id').references('pivot_id').inTable('pivots').index();
    })
    .createTable('state_variables', (table) => {
      table.uuid('state_variable_id').primary().defaultTo(knex.raw('(UUID())'));
      table.float('angle');
      table.string('father');
      table.float('rssi');
      table.float('percentimeter');
      table.datetime('timestamp').notNullable();

      table.uuid('state_id').references('state_id').inTable('states').index();
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
      

      table.uuid('author').references('user_id').inTable('users').index();
      table.uuid('pivot_id').references('pivot_id').inTable('pivots').index();
    })
}

export async function down(knex: Knex): Promise<void> {}
