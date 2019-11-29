# 6ar
The goal of this project is to gather and track the[Hungarian border traffic information](http://www.police.hu/hu/hirek-es-informaciok/hatarinfo) and to provide additional features such as historical data and better user interface and API.
Further more, additional [community based sources](https://www.facebook.com/groups/Hatarfigyelok/) will be included to provide a more accurate estimation.


# Setting up the development environment
The project uses `Node v10+` and `NPM` for managing its dependencies. In order to set that up, the recommended approach is to use [NVM](https://github.com/creationix/nvm).

After cloning the project run `npm install` to fetch all of the needed dependencies, including [lerna](https://github.com/lerna/lerna). If you haven't yet, make sure to read about it. You'll need it for sure in case you want to add a new package/module or a dependency. For convinience sake, the top level `package.json` contains some NPM scripts.

To fetch all module dependencies and crete the necessary links run `npm run bootstrap`. This takes care of fetching the needed packages for all NPM projects contained in the repository. It is also configured to hoist those dependencies to the top level, meaning the module specific node_modules folders will only contain links to other local module dependencies.

After bootstraping, you should be able to compile all modules, by running `npm run build`. This will generate both the JavaScript code and the typings for all Typescript based modules.

To verify that all is well, just run the test NPM script: `npm test`. This executes [Jest](https://jestjs.io/) for all the modules of the mono-repository.

In case you are developing multiple modules at once and want to make sure that incremental compilation happens for your changes, make sure to run: `npm run watch`, which starts a the TypeScript compiler watch mode for all modules in parallel.

## EditorConfig setup
The project uses [EditorConfig](https://editorconfig.org/) to make sure that a consistent formatting is used. Make sure to configure your preferred editor to use the provided `.editorconfig` configuration. You can also verify correct indentation support by running `npm run lint:editorconfig`. This will check all files in the repository.

# Project structure

In order to ensure separation of concerns, the application is structured as a composition of set of modules (modules are the application specific NPM modules), each focusing on a specific layer.
Each module is defined to be isolated from the others, meaning it could be in a completely separate repository. The mono-repository based structure ensures that you are always using a correct version of the module dependencies
and that the entire application can use the exact same version of 3rd party dependencies. Plus it makes it easier to ensure that the same tooling and testing configuration is used in all modules... and so forth. Yes, there are trade-offs, but the goal of this README is not to go into those! You get the picture.

All application modules reside under the top-level `/packages` folder. The modules folder has a flat structure, meaning nesting is not supported and discouraged.
Various tooling configuration files (`jest.config.js`, `tsconfig.json`, ...) also reside under the top-level folder and are extended by the module specific configuration files.

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
