import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'tesseract.js', 'dexie', 'canvas-confetti'],
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-pdf': ['pdfjs-dist'],
          'vendor-ocr': ['tesseract.js'],
          'vendor-motion': ['framer-motion', 'canvas-confetti'],
          'vendor-db': ['dexie', 'dexie-react-hooks'],
        },
      },
    },
  },
});
