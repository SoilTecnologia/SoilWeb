// Update with your config settings.
const dockerConnect = 'soil_postgres';
const localConnect = 'localhost';
const rdsConnect = 'soildb-new-dev.cdfsr0wfegop.us-east-1.rds.amazonaws.com';

module.exports = {
  development: {
    client: 'postgresql',
    connection: `postgresql://soil:soil2021@${rdsConnect}:5432/soildb`
  }
};
