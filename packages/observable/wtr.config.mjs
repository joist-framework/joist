import { puppeteerLauncher } from '@web/test-runner-puppeteer';

export default {
  port: 8002,
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
