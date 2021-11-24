const knexConfig = require('../../knexfile');

import Knex from 'knex';

const knex = Knex(knexConfig.development);

export default knex;

/* Since this code uses ES6 Modules, the database connection client (db) will be created only once, no matter how many files imports this */
