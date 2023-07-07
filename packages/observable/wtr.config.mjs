import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  port: 8002,
  rootDir: '../../',
  nodeResolve: true,
  files: 'target/**/*.test.js',
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
};
