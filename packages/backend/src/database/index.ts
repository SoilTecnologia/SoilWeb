const knexConfig = require('../../knexfile');

import Knex from 'knex';

const knex = Knex(knexConfig.development);
export default knex;