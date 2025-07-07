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
    viteCompression({ algorithm: 'gzip', ext: '.gz', compressionOptions: { level: 9 }, deleteOriginFile: false }),
    require('vite-plugin-compression2').default({ algorithm: 'gzip', ext: '.gz', compressionOptions: { level: 9 }, deleteOriginFile: false })
  ],
  css: {
    postcss: './postcss.config.js',
  },
  base: '/pollyglot/',
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined // Let Vite handle chunking, or customize if needed
      }
    }
  }
});
