import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Increase the warning limit slightly (optional, but clean)
    chunkSizeWarningLimit: 1000, 
    
    // 2. Configure Rollup to split the code
    rollupOptions: {
      output: {
        manualChunks(id) {
          // If the file is inside node_modules (a library), put it in a 'vendor' chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
