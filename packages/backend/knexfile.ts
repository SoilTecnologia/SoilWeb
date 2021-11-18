// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      database: 'newsoildb',
      user: 'soil',
      password: 'password',
      host: 'localhost',
      port: 3306
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'newsoildb',
      user: 'soil',
      password: 'password',
      host: 'localhost',
      port: 3306
    }
  }
};
