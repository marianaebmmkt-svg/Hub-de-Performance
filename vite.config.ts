import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: 'VITE_',
  // Removed define block that shadowed process.env with an empty object,
  // allowing injected environment variables to be accessible.
});