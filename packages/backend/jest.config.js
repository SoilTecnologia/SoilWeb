module.exports = {
  roots: ['<rootDir>/__tests__/units', '<rootDir>/__tests__/integration'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/utils/**/*.ts',
    '!<rootDir>/src/shared/**/*.ts',
    '!<rootDir>/src/routes/*.ts',
    '!<rootDir>/src/types/*.ts',
    '!<rootDir>/src/protocols/*.ts',
    '!<rootDir>/__tests__/**/*.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/setup.ts'],
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '@protocols/(.*)': '<rootDir>/src/protocols/$1',
    '@useCases/(.*)': '<rootDir>/src/useCases/$1',
    '@database/(.*)': '<rootDir>/src/database/$1',
    '@root/(.*)': '<rootDir>/src/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@aws/(.*)': '<rootDir>/src/aws-iot/$1',
    '@rasp/(.*)': '<rootDir>/src/raspberry/$1'
  }
  // globalSetup: '<rootDir>/__tests__/setup/global-setup.ts',
  // globalTeardown: '<rootDir>/__tests__/setup/global-teardown.ts'
};
