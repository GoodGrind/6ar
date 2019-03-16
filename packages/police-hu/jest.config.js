const topLevelJestConfig = require("../../jest.config.js");

module.exports = {
  ...topLevelJestConfig,
  roots: [
    "<rootDir>/src"
  ]
};
