import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: "test/**/*.test.js",
  nodeResolve: true,

  testRunnerHtml: (testFramework) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <script>
          window.LIT_DISABLE_DEV_MODE_WARNING = true;
          window.__LIT_DEV_MODE__ = false;
        </script>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,

  // Full multi-browser testing for CI/comprehensive regression
  browsers: [
    playwrightLauncher({ product: "chromium" }),
    playwrightLauncher({ product: "firefox" }),
    playwrightLauncher({ product: "webkit" }),
  ],

  coverageConfig: {
    include: ["src/**/*.js"],
  },

  testFramework: {
    config: {
      timeout: 5000,
    },
  },
};
