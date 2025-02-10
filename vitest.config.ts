/* eslint-disable prettier/prettier */

import { resolve } from 'path'
import { defineConfig  } from 'vitest/config'; 
import react from '@vitejs/plugin-react';

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src')
    }
  },
  plugins: [
    react(),
  ],
});

