import { defineConfig, devices } from "@playwright/test";

/**
 * Visual regression — local only, by decision (see ROADMAP.md, Q3).
 *
 * Screenshots only compare on the OS that made them, so baselines carry a
 * platform suffix and CI doesn't run this config. Run it before a release:
 *
 *   npm run test:visual            # compare against the baselines
 *   npm run test:visual:update     # re-baseline after an intended change
 */
const PORT = 4174;

export default defineConfig({
  testDir: "test/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}-{platform}{ext}",
  fullyParallel: true,
  timeout: 60000,
  reporter: "list",

  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      // Glyph antialiasing still differs by 10–20 scattered pixels between
      // runs, even with the flags below. Real changes seen so far are
      // hundreds of pixels (a tab indicator a few px off was 176).
      maxDiffPixels: 50,
    },
  },

  use: {
    baseURL: `http://localhost:${PORT}`,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Text antialiasing otherwise varies by a few pixels between runs.
        launchOptions: {
          args: [
            "--font-render-hinting=none",
            "--disable-lcd-text",
            "--disable-font-subpixel-positioning",
            "--force-color-profile=srgb",
            "--disable-gpu",
          ],
        },
      },
    },
  ],

  webServer: {
    command: `npx vite --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
