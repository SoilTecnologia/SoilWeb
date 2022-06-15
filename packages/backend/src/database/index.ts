import Knex from 'knex';
import knexConfig from '../knexfile';

const dbEnv =
  process.env.NODE_ENV === 'test' ? knexConfig.test : knexConfig.development;

const knex = Knex(dbEnv);
export default knex;
