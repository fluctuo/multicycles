module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgres',
      database: 'multicycles'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'database',
      user: 'postgres',
      password: 'postgres',
      database: 'multicycles'
    }
  }
}
