import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ESM compatibility: get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Plugin to copy database file to public directory
function copyDatabasePlugin() {
  return {
    name: 'copy-database',
    buildStart() {
      const sourcePath = path.resolve(__dirname, 'data/complete-database.json');
      const targetDir = path.resolve(__dirname, 'public/data');
      const targetPath = path.resolve(targetDir, 'complete-database.json');

      try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Copy file if source exists
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log('✓ Copied database to public/data/');
        }
      } catch (error) {
        console.warn('⚠ Could not copy database file:', error);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [copyDatabasePlugin(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  publicDir: 'public',
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
  },
});
