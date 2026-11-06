import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages sirve el sitio desde el subdirectorio del repositorio.
  base: process.env.VITE_GITHUB_PAGES === 'true'
    ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || 'supermercado-alonso-guzman-PFY2202'}/`
    : '/',
});
