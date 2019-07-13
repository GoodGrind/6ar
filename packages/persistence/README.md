# `6ar Persistence`

> TODO: description

## Usage

Running knex migrations: `npx knex --knexfile knexfile.ts migrate:latest` for example. The main takeaway is the currently you have to explicitly pass the configuration file `knexfile.ts`.
It seems that currently, TypeScript migrations are only recognized if the `knexfile` is in a TypeScript format and `ts-node` is installed as a dependency. Might be related to this issue: https://github.com/tgriesser/knex/issues/2998

## Configuration

> TODO: evn based configuration

## Setting up a development environment

sudo docker run --name 6ar-postgres -e POSTGRES_PASSWORD=password -p 127.0.0.1:5432:5432 -d postgres

For connecting to the running docker image database: `sudo docker exec -it 6ar-postgres psql -U postgres`.
