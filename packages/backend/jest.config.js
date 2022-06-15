module.exports = {
  roots: ["<rootDir>/__tests__"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/utils/**/*.ts",
    "!<rootDir>/src/shared/**/*.ts",
    "!<rootDir>/src/routes/*.ts",
    "!<rootDir>/src/types/*.ts",
  ],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  }
};