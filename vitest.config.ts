import { defineConfig } from 'vitest/config';
import path from 'path';

const root = import.meta.dirname ?? path.resolve();

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/**', 'src/data/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
    },
  },
});
