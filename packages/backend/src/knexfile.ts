// Update with your config settings.
const dockerConnect = 'soil_postgres';
const localConnect = 'localhost';
const rdsConnect = 'soildb-new-dev.cdfsr0wfegop.us-east-1.rds.amazonaws.com';

export default {
  devLocal: {
    client: 'postgresql',
    connection: `postgresql://soil:soil2021@${localConnect}:5432/soildb`
  },
  devDocker: {
    client: 'postgresql',
    connection: `postgresql://soil:soil2021@${dockerConnect}:5432/soildb`
  },
  newDev: {
    client: 'postgresql',
    connection: `postgresql://soil:soil2021@${rdsConnect}:5432/soildb`
  },
  test: {
    client: 'postgresql',
    connection: `postgresql://soil_test:soil2021_test@${localConnect}:5436/soildb_test`
  }
};
