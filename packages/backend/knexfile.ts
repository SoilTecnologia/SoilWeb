// Update with your config settings.
const dockerConnect = 'soil_postgres';
const localConnect = 'localhost';

module.exports = {
  development: {
    client: 'postgresql',
    connection: `postgresql://soil:soil2021@${localConnect}:5432/soildb`
  }
};
