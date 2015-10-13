// Update with your config settings.

module.exports = {

  local: {
    client: 'postgresql',
    connection: {
      database: 'pixi2',
      user:     'postgres',
      password: 'qwerty',
      port: 5433
    },
    debug: false
  }
  //,

  //prod: {
  //  client: 'postgresql',
  //  connection: {
  //    database: 'my_db',
  //    user:     'username',
  //    password: 'password'
  //  },
  //  pool: {
  //    min: 2,
  //    max: 10
  //  },
  //  migrations: {
  //    tableName: 'knex_migrations'
  //  }
  //}

};
