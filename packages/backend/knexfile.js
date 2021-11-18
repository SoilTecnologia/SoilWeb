// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'soil',
      password: 'password',
      database: 'newsoildb'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'soil',
      password: 'password',
      database: 'newsoildb'
    }
  }
};
