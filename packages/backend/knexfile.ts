// Update with your config settings.

module.exports = {
  development: {
    client: 'postgres',
    connection: {
      database: 'newnewsoildb',
      user: 'soil',
      password: 'password',
      host: '127.0.0.1',
      port: 5432
    }
  },

  production: {
    client: 'postgres',
    connection: {
      database: 'newnewsoildb',
      user: 'soil',
      password: 'password',
      host: '127.0.0.1',
      port: 5432
    }
  }
};
