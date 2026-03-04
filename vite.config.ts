import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Ne pas écraser VITE_API_URL : utiliser .env / .env.development / .env.production
    server: {
      host: true,
      port: 5173,
      // Port 5173 pour que vercel dev ecoute sur le port principal et route /api. les requêtes /api doivent aller vers l’API (souvent 3000).
    },
    base: '/',
    publicDir: 'public',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          format: 'es',
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      },
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true
        }
      }
    }
  };
});
