import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    strictPort: true,      // força usar porta fixa, evita trocas
    port: 4200,            // ajuste se precisar
    allowedHosts: 'all',
  },
});