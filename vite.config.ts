import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1100,
    rollupOptions: { output: { manualChunks(id) {
      if (id.includes('maplibre-gl')) return 'maplibre';
      if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) return 'charts';
      if (id.includes('lucide-react')) return 'icons';
      if (id.includes('react-router') || id.includes('react-dom') || /node_modules[\\/]react[\\/]/.test(id)) return 'react';
    } } }
  },
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', css: true }
});
