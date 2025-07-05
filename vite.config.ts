import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import MillionLint from '@million/lint';
import legacy from '@vitejs/plugin-legacy';
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    MillionLint.vite({ enabled: true }),
    react(),
    legacy({
      targets: [
        'defaults',
        'IE 11',
        'not IE <= 10',
        'not Android < 4.4.4',
        'not dead'
      ],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    viteCompression({ algorithm: 'gzip', ext: '.gz', compressionOptions: { level: 9 }, deleteOriginFile: false })
  ],
  css: {
    postcss: './postcss.config.js',
  },
  base: '/pollyglot/',
  build: {
    sourcemap: false,
    // Use esbuild for faster builds in resource-constrained environments
    minify: 'esbuild',
    // Warn on large chunks
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui-vendor': ['bootstrap'],
          'ai-vendor': ['openai']
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Optimize treeshaking for smaller bundles
      treeshake: {
        preset: 'recommended',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    }
  }
});
