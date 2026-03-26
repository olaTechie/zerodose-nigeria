import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/zerodose-nigeria/',
  build: { outDir: 'dist' },
  worker: { format: 'es' },
});
