import { puppeteerLauncher } from '@web/test-runner-puppeteer';

export default {
  rootDir: '../../',
  nodeResolve: {
    exportConditions: ['production']
  },
  files: 'target/**/*.test.js',
  browsers: [
    puppeteerLauncher({
      args: ['--no-sandbox']
    })
  ]
};
