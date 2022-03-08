import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table
        .uuid('user_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.string('login', 255).unique().notNullable();
      table.string('password', 255).notNullable();
      table.enum('user_type', ['SUDO', 'USER']).defaultTo('USER');
    })
    .createTable('farms', (table) => {
      table
        .uuid('farm_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.string('farm_name').notNullable();
      table.string('farm_city').notNullable();
      table.float('farm_lng').notNullable();
      table.float('farm_lat').notNullable();
      table
        .uuid('user_id')
        .references('user_id')
        .inTable('users')
        .index()
        .notNullable();
    })
    .createTable('nodes', (table) => {
      table
        .uuid('node_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.string('node_name').notNullable();
      table.boolean('is_gprs').notNullable();
      table.string('gateway');

      table.uuid('farm_id').references('farm_id').inTable('farms').index();
    })
    .createTable('pivots', (table) => {
      table
        .uuid('pivot_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.integer('pivot_name').notNullable();
      table.float('pivot_lng').notNullable();
      table.float('pivot_lat').notNullable();
      table.float('pivot_start_angle').notNullable();
      table.float('pivot_end_angle').notNullable();
      table.float('pivot_radius').notNullable();
      table.integer('radio_id').notNullable();

      table
        .uuid('node_id')
        .references('node_id')
        .inTable('nodes')
        .index()
        .notNullable();
    })
    .createTable('states', (table) => {
      table
        .uuid('state_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.boolean('power');
      table.boolean('water');
      table.enum('direction', ['CLOCKWISE', 'ANTI_CLOCKWISE']);
      table.boolean('connection').notNullable();
      table.datetime('timestamp').notNullable();

      table
        .uuid('pivot_id')
        .references('pivot_id')
        .inTable('pivots')
        .index()
        .notNullable();
    })
    .createTable('state_variables', (table) => {
      table
        .uuid('state_variable_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.float('angle');
      table.float('percentimeter');
      table.datetime('timestamp').notNullable();

      table
        .uuid('state_id')
        .references('state_id')
        .inTable('states')
        .index()
        .notNullable();
    })
    .createTable('radio_variables', (table) => {
      table
        .uuid('radio_variable_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.string('father');
      table.float('rssi');
      table.datetime('timestamp').notNullable();

      table
        .uuid('pivot_id')
        .references('pivot_id')
        .inTable('pivots')
        .index()
        .notNullable();

      table
        .uuid('state_id')
        .references('state_id')
        .inTable('states')
        .index()
        .notNullable();
    })
    .createTable('actions', (table) => {
      table
        .uuid('action_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.boolean('power').notNullable();
      table.boolean('water');
      table.enum('direction', ['CLOCKWISE', 'ANTI_CLOCKWISE']);
      table.float('percentimeter');
      table.boolean('success').defaultTo(null);
      table.datetime('timestamp_sent').notNullable();
      table.datetime('timestamp_success');

      table
        .uuid('author')
        .references('user_id')
        .inTable('users')
        .index()
        .notNullable();

      table
        .uuid('pivot_id')
        .references('pivot_id')
        .inTable('pivots')
        .index()
        .notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('actions')
    .dropTable('states')
    .dropTable('state_variables')
    .dropTable('pivots')
    .dropTable('nodes')
    .dropTable('farms')
    .dropTable('users');
}
