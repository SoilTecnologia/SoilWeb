import Knex from 'knex';

const knexConfig = require('../../knexfile');

const knex = Knex(knexConfig.development);
export default knex;
