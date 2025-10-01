/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });


// Add any custom configuration options you need here
const customJestConfig = {
  // Set test environment to jsdom for React components
  testEnvironment: 'jsdom',
  
  // Setup files to run before tests (e.g., to import @testing-library/jest-dom matchers)
  // You might need to create this file: jest.setup.js
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], 
  
  // If you use module aliases (e.g., `@/components`), you must configure them here
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/$1',
  // },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);