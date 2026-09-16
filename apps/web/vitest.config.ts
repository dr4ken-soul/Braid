import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@braid/domain': path.resolve(__dirname, '../../packages/domain/src/index.ts'),
      '@braid/ui': path.resolve(__dirname, '../../packages/ui/src/index.tsx'),
    },
  },
});
