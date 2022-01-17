// Update with your config settings.

module.exports = {
  development: {
    client: 'postgres',
    connection: {
      database: 'soildb',
      user: 'soil',
      password: 'soil2021',
      host: '127.0.0.1',
      port: 5432
    }
  },

  production: {
    client: 'postgres',
    connection: {
      database: 'soildb',
      user: 'soil',
      password: 'soil2021',
      host: '127.0.0.1',
      port: 5432
    }
  }
};
