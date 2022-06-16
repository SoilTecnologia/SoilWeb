import path from 'path';

// Update with your config settings.
const dockerConnect = 'soil_postgres';
const localConnect = 'localhost';
const rdsConnect = 'soildb-new-dev.cdfsr0wfegop.us-east-1.rds.amazonaws.com';

export default {
  development: {
    client: 'postgresql',
    connection: `postgresql://soil:soil2021@${dockerConnect}:5434/soildb`
  },
  test: {
    client: 'postgresql',
    connection: `postgresql://soil_test:soil2021_test@${localConnect}:5436/soildb_test`
  }
  // test: {
  //   client: 'sqlite3',
  //   connection: {
  //     filename: './__tests__/database/data.sqlite',
  //     flags: ['OPEN_URI', 'OPEN_SHAREDCACHE']
  //   },
  //   migrations: {
  //     directory: path.resolve('./migrations'),
  //     tableName: 'knex_migrations'
  //   },
  //   seeds: {
  //     directory: path.resolve('./seeds')
  //   },
  //   useNullAsDefault: true
  // }
};
