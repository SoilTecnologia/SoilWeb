import Knexdefault, { Knex } from 'knex';
import knexConfig from '../knexfile';

const dbEnv = () => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return knexConfig.test as Knex.Config;
    case 'dev_local':
      return knexConfig.devLocal as Knex.Config;
    case 'dev_docker':
      return knexConfig.devDocker as Knex.Config;
    case 'prod_dev':
      return knexConfig.newDev as Knex.Config;
  }
};

const knexConf: Knex.Config = dbEnv() || knexConfig.devLocal;
const knex = Knexdefault(knexConf);
export default knex;
