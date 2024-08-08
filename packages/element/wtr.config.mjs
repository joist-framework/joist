import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  port: 8001,
  rootDir: '../../',
  nodeResolve: {
    exportConditions: ['production']
  },
  files: 'target/**/*.test.js',
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' })
  ]
};
