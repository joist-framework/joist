import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'browser',
    include: ['target/**/*.test.js'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      providerOptions: {}
    }
  }
});
