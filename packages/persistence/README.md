# `6ar Persistence`

> TODO: description

## Usage

Running knex migrations: `npx knex --knexfile knexfile.ts migrate:latest` for example. The main takeaway is the currently you have to explicitly pass the configuration file `knexfile.ts`.
It seems that currently, TypeScript migrations are only recognized if the `knexfile` is in a TypeScript format and `ts-node` is installed as a dependency. Might be related to this issue: https://github.com/tgriesser/knex/issues/2998

## Configuration

> TODO: evn based configuration

## Setting up a development environment

`sudo docker run --name 6ar-postgres -e POSTGRES_USER=6ar -e POSTGRES_PASSWORD=6arpassword -e TZ=Europe/Budapest -p 127.0.0.1:5432:5432 -d postgres`

## For connecting to the running docker image database:
`sudo docker exec -it 6ar-postgres psql -U 6ar`.


## Conventions

There is no one best practice that will cover every circumstance, however conventions are important. The database uses the following ones:
- When it comes to table names use singular entity names with lower case ("crossing" instead of "crossings")
- When it comes to field names use snake_case on your field names ("foreign_country_code"). Use short singular names unless the definition definitely makes sense as a plural.
- When it comes to built in database functions or language names (SELECT). Unless there's a requirement for it to be capitalized a certain way, use ALL CAPS
