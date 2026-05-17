import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/zerodose-nigeria/',
  build: { outDir: 'dist' },
  worker: { format: 'es' },
});
