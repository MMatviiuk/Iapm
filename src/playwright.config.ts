import { defineConfig, devices } from '@playwright/test';

/**
 * PLAYWRIGHT E2E CONFIGURATION
 * End-to-end testing for critical user flows
 */

export default defineConfig({
  testDir: './e2e',
  
  // Timeout
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  
  // Test configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: 'html',
  
  // Shared settings
  use: {
    // Base URL
    baseURL: 'http://localhost:5173',
    
    // Screenshots
    screenshot: 'only-on-failure',
    
    // Videos
    video: 'retain-on-failure',
    
    // Trace
    trace: 'on-first-retry',
  },

  // Projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web Server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
