import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const listmonkUrl = env.VITE_LISTMONK_URL || 'https://subscribe.vaultscope.de';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/listmonk': {
          target: listmonkUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/listmonk/, '')
        }
      }
    }
  }
})
