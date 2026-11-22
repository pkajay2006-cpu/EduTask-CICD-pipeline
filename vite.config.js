import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setting base to './' allows relative asset URLs, ensuring seamless deployment
  // to GitHub Pages regardless of whether it's hosted at /<repository-name>/ or at root.
  // Can also be customized via VITE_BASE_PATH if needed.
  base: process.env.VITE_BASE_PATH || './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
