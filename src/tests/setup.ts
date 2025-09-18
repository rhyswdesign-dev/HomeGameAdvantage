/**
 * Test setup file for Vitest
 * Configure global test environment and utilities
 */

// Mock Date.now for consistent test results
export const mockCurrentTime = (timestamp: number) => {
  vi.spyOn(Date, 'now').mockReturnValue(timestamp);
};

// Mock Math.random for predictable test results
export const mockRandom = (value: number) => {
  vi.spyOn(Math, 'random').mockReturnValue(value);
};

// Reset all mocks after each test
afterEach(() => {
  vi.restoreAllMocks();
});