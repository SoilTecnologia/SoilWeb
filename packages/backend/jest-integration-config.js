// import * as config from "./jest.config"
const config = require('./jest.config');

config.testMatch = ['**/*.test.ts'];
config.setupFilesAfterEnv = ['<rootDir>/__tests__/setup/integration/setup.ts'];

module.exports = config;
