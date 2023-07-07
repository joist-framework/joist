import { puppeteerLauncher } from '@web/test-runner-puppeteer';

export default {
  rootDir: '../../',
  nodeResolve: true,
  files: 'target/**/*.test.js',
  browsers: [puppeteerLauncher()],
};
