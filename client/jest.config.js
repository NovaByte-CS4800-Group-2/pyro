import nextJest from 'next/jest.js';
import { pathsToModuleNameMapper } from 'ts-jest';
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Map @/ to client/ explicitly
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Optional: Mock CSS imports
  },
 
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);