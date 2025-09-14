import { puppeteerLauncher } from "@web/test-runner-puppeteer";

export default {
  rootDir: "../../",
  nodeResolve: {
    exportConditions: ["production"],
  },
  files: "target/**/*.test.js",
  port: 9878,
  browsers: [
    puppeteerLauncher({
      headless: true,
      args: ["--no-sandbox"],
    }),
  ],
};
