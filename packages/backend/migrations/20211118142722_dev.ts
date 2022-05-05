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
      table.string('farm_id').unique().primary().notNullable();
      table.string('farm_name').notNullable();
      table.string('farm_city').notNullable();
      table.float('farm_lng').notNullable();
      table.float('farm_lat').notNullable();
      table
        .uuid('user_id')
        .references('user_id')
        .inTable('users')
        .index()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('nodes', (table) => {
      table
        .uuid('node_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table.integer('node_num').notNullable();
      table.boolean('is_gprs').notNullable();
      table.string('gateway');

      table
        .string('farm_id')
        .references('farm_id')
        .inTable('farms')
        .index()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('pivots', (table) => {
      table.string('pivot_id').unique().primary().notNullable();

      table.integer('pivot_num').notNullable();
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
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table
        .string('farm_id')
        .references('farm_id')
        .inTable('farms')
        .index()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
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
        .string('pivot_id')
        .references('pivot_id')
        .inTable('pivots')
        .index()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
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
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
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
        .string('pivot_id')
        .references('pivot_id')
        .inTable('pivots')
        .index()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table
        .uuid('state_id')
        .references('state_id')
        .inTable('states')
        .index()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
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
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table
        .string('pivot_id')
        .references('pivot_id')
        .inTable('pivots')
        .index()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })

    .createTable('schedulings',(table) =>{
      table
        .uuid('scheduling_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table
        .string('pivot_id')
        .references('pivot_id')
        .inTable('pivots')
        .index()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.boolean('power');
      table.boolean('water');
      table.enum('direction', ['CLOCKWISE', 'ANTI_CLOCKWISE']);
      table.float('percentimeter');
      table.dateTime('start_timestamp');
      table.dateTime('end_timestamp');
      table.dateTime('timestamp').notNullable();
    })

    .createTable('schedulingangles',(table) =>{
      table
        .uuid('schedulingangle_id')
        .primary()
        .defaultTo(knex.raw('(uuid_generate_v4())'));
      table
        .string('pivot_id')
        .references('pivot_id')
        .inTable('pivots')
        .index()
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.boolean('power');
      table.boolean('water');
      table.enum('direction', ['CLOCKWISE', 'ANTI_CLOCKWISE']);
      table.float('percentimeter');
      table.float('start_angle');
      table.float('end_angle');
      table.dateTime('timestamp').notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('actions', (table) => {
      table.dropPrimary();
      table.dropForeign('author');
      table.dropForeign('pivot_id');
    })
    .alterTable('radio_variables', (table) => {
      table.dropPrimary();
      table.dropForeign('state_id');
      table.dropForeign('pivot_id');
    })
    .alterTable('state_variables', (table) => {
      table.dropPrimary();
      table.dropForeign('state_id');
    })
    .alterTable('states', (table) => {
      table.dropPrimary();
      table.dropForeign('pivot_id');
    })
    .alterTable('pivots', (table) => {
      table.dropPrimary();
      table.dropForeign('node_id');
    })
    .alterTable('nodes', (table) => {
      table.dropPrimary();
      table.dropForeign('farm_id');
    })
    .alterTable('farms', (table) => {
      table.dropPrimary();
      table.dropForeign('user_id');
    })
    .alterTable('schedulings', (table)=>{
      table.dropPrimary();
      table.dropForeign('pivot_id');
    })
    .alterTable('users', (table) => {
      table.dropPrimary();
    })
    .dropTable('actions')
    .dropTable('radio_variables')
    .dropTable('states')
    .dropTable('state_variables')
    .dropTable('pivots')
    .dropTable('nodes')
    .dropTable('farms')
    .dropTable('users')
    .dropTable('schedulings');
}
