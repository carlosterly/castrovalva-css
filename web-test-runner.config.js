import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  // Honor CLI file arguments for focused testing, fallback to all tests
  files:
    process.argv
      .slice(2)
      .find((arg) => arg.endsWith(".js") && !arg.startsWith("--")) ||
    "test/**/*.test.js",
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

  // Default to a single browser (Chromium) to keep local runs fast.
  // Use test:all for multi-browser testing.
  browsers: [playwrightLauncher({ product: "chromium" })],

  coverage: true,
  coverageConfig: {
    threshold: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },

  testFramework: {
    config: {
      timeout: 10000,
    },
  },
};
