import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env, .env.local, .env.[mode], .env.[mode].local
  const env = loadEnv(mode, process.cwd(), '');

  // Debug: Log what we're loading (don't log the actual key for security)
  console.log('Loading env vars:', {
    mode,
    hasGEMINI_API_KEY: !!env.GEMINI_API_KEY,
    apiKeyLength: env.GEMINI_API_KEY?.length || 0,
    apiKeyPrefix: env.GEMINI_API_KEY ? env.GEMINI_API_KEY.substring(0, 10) + '...' : 'none'
  });

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/generate': {
          target: 'https://ai.twoblk.workers.dev',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/generate/, '/generate'),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, _req, _res) => {
              proxyReq.setHeader('X-Platform', 'imageeditor');
            });
          },
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
