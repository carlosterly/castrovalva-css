import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        // Main entry point
        index: resolve(__dirname, "src/index.js"),

        // CSS entry point (for separate CSS/JS loading)
        styles: resolve(__dirname, "src/styles.css"),

        // Individual component entries for tree-shaking
        button: resolve(__dirname, "src/components/button/button.js"),
        icon: resolve(__dirname, "src/components/icon/icon.js"),
        // Add more components as they are built:
        // input: resolve(__dirname, "src/components/input/input.js"),
        // card: resolve(__dirname, "src/components/card/card.js"),
        // modal: resolve(__dirname, "src/components/modal/modal.js"),
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
          if (assetInfo.name === "style.css") {
            return "design-system.css";
          }
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
        drop_console: true, // Remove console.log in production
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
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@tokens": resolve(__dirname, "src/tokens"),
      "@utils": resolve(__dirname, "src/utils"),
    },
  },

  // Plugin configuration
  plugins: [],
});
