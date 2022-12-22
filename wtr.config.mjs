import { puppeteerLauncher } from '@web/test-runner-puppeteer';

export default {
  concurrency: 1,
  rootDir: '../../',
  nodeResolve: true,
  files: 'target/test/**/*.test.js',
  browsers: [puppeteerLauncher({ concurrency: 1 })]
};

