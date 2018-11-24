# 6ar
The goal of this project is to gather and track the[Hungarian border traffic information](http://www.police.hu/hu/hirek-es-informaciok/hatarinfo) and to provide additional features such as historical data and better user interface and API.
Further more, additional [community based sources](https://www.facebook.com/groups/Hatarfigyelok/) will be included to provide a more accurate estimation.


# Setting up the development environment
The project uses `Node v10.13+` and `NPM` for managing its dependencies. In order to set that up, the recommended approach is to use [NVM](https://github.com/creationix/nvm).

After cloning the project run `npm install` to fetch all of the needed dependencies.

To start the application, simple run `npm start`. For testing, use `npm test` or consinder using the test watcher provided by [Jest](https://jestjs.io/) by running `npx jest --watch`.
