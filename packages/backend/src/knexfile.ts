// Update with your config settings.
const dockerConnect = 'soil_postgres';
const localConnect = 'localhost';
const rdsConnect = 'soildb-new-dev.cdfsr0wfegop.us-east-1.rds.amazonaws.com';

export default {
  development: {
    client: 'postgresql',
    connection: `postgresql://soil:soil2021@${dockerConnect}:5432/soildb`
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
