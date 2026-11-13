import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './': the Remix Worker serves a pinned version under /_v/<id>/ and sets <base href>,
// so every asset URL in the build must be relative. (The builder forces it anyway.)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: 'assets' },
});
