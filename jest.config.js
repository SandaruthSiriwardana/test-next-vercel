module.exports = {
  // Use ts-jest preset only if ts-jest is available, otherwise run with babel/jest defaults.
  // ts-jest is declared in devDependencies; CI/dev machines should run `npm install` first.
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Limit Jest to the src directory to avoid scanning sibling example projects
  roots: ['<rootDir>/src'],
  // Ignore nested example folders and build artifacts that contain their own package.json
  modulePathIgnorePatterns: ['<rootDir>/vehicle-expiry-system', '<rootDir>/vehicle-insurance-form', '<rootDir>/.next'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  }
}
