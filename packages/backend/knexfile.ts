// Update with your config settings.
const dockerConnect = 'soil_postgres';
const devLocalConnect = 'localhost';
const prodConnect = 'localhost';

const password = process.env.DB_PASS;
const user = process.env.DB_USER;
const port = process.env.DB_PORT;
const db = process.env.DB_DATABASE;

module.exports = {
  development: {
    client: 'postgres',
    connection: `postgresql://${user}:${password}@${dockerConnect}:${port}/${db}`
  },

  production: {
    client: 'postgres',
    connection: `postgresql://${user}:${password}@${prodConnect}:${port}/${db}`
  }
};
