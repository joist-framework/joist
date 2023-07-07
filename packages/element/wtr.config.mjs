import { puppeteerLauncher } from '@web/test-runner-puppeteer';

export default {
  port: 8001,
  rootDir: '../../',
  nodeResolve: true,
  files: 'target/**/*.test.js',
  browsers: [
    puppeteerLauncher({
      launchOptions: {
        headless: 'new',
      },
    }),
  ],
};
