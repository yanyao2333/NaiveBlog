/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
  resolve: {
    alias: {
      // 与 tsconfig alias 保持一致
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/layouts': path.resolve(__dirname, 'src/layouts'),
      '@/css': path.resolve(__dirname, 'src/css'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/data': path.resolve(__dirname, 'data'),
      '@/temp': path.resolve(__dirname, 'temp'),
      '@/public': path.resolve(__dirname, 'public'),
      '@/mdx-plugins': path.resolve(__dirname, 'src/mdx-plugins'),
      'contentlayer/generated': path.resolve(__dirname, './.contentlayer/generated'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
})
