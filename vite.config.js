import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

// Resolve `__dirname` in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('vite').UserConfig} */
export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
};
