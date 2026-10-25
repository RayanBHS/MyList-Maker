import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = env.PORT || 3001

  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:' + apiPort
      }
    }
  }
})