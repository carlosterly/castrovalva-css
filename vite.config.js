import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        // Main entry point
        index: resolve(import.meta.dirname, "src/index.js"),

        // CSS entry point (for separate CSS/JS loading)
        styles: resolve(import.meta.dirname, "src/styles.css"),

        // Individual component entries for tree-shaking
        button: resolve(import.meta.dirname, "src/components/button/button.js"),
        icon: resolve(import.meta.dirname, "src/components/icon/icon.js"),
        // Add more components as they are built:
        // input: resolve(import.meta.dirname, "src/components/input/input.js"),
        // card: resolve(import.meta.dirname, "src/components/card/card.js"),
        // modal: resolve(import.meta.dirname, "src/components/modal/modal.js"),
      },
      formats: ["es"], // ES modules only (modern browsers)
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        // Preserve component structure
        preserveModules: false,

        // CSS file naming
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".css")) {
            return "css/[name][extname]";
          }
          if (assetInfo.name.endsWith(".svg")) {
            return "assets/icons/[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },

    // Output directory
    outDir: "dist",

    // Generate sourcemaps for debugging
    sourcemap: true,

    // Minification
    minify: "terser",
    terserOptions: {
      compress: {
        // Strip debug logging only. drop_console would also remove the
        // console.warn/error calls that tell a developer about bad input
        // (it never ran under Vite 5, which didn't minify library output).
        pure_funcs: ["console.log", "console.debug"],
        drop_debugger: true,
      },
    },

    // CSS code splitting per component
    cssCodeSplit: true,

    // Target modern browsers
    target: "es2020",
  },

  // Development server
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },

  // Preview server (for testing production build)
  preview: {
    port: 8080,
    open: true,
  },

  // Resolve aliases
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
      "@components": resolve(import.meta.dirname, "src/components"),
      "@tokens": resolve(import.meta.dirname, "src/tokens"),
      "@utils": resolve(import.meta.dirname, "src/utils"),
    },
  },

  // Plugin configuration
  plugins: [],
});
