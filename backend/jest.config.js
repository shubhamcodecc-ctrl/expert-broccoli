{
  "testEnvironment": "node",
  "preset": "ts-jest",
  "testMatch": ["**/__tests__/**/*.test.ts", "**/*.test.ts"],
  "moduleFileExtensions": ["ts", "js"],
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/index.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 60,
      "functions": 60,
      "lines": 60,
      "statements": 60
    }
  }
}
