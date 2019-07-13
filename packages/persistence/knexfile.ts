// TODO(snorbi07): read the configurations from an env file(dotenv)
const dbClientType = 'postgresql';
const dbConnectionUrl = 'postgres://postgres:password@localhost:5432/6ar';
const dbPoolMin = 2;
const dbPoolMax = 10;

const migrations = {
  extension: 'ts',
  directory: 'src/migrations',
  tableName: '6ar_migrations'
};

const seeds = {
  directory: './src/seeds'
};

module.exports = {

  development: {
    client: dbClientType,
    connection: dbConnectionUrl,
    pool: {
      min: dbPoolMin,
      max: dbPoolMax
    },
    migrations: migrations,
    seeds: seeds
  },

  staging: {
    client: dbClientType,
    connection: dbConnectionUrl,
    pool: {
      min: dbPoolMin,
      max: dbPoolMax
    },
    migrations: migrations,
    seeds: seeds
  },

  production: {
    client: dbClientType,
    connection: dbConnectionUrl,
    pool: {
      min: dbPoolMin,
      max: dbPoolMax
    },
    migrations: migrations,
    seeds: seeds
  }

};
