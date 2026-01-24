import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        server: {
            host: true,
            port: 5173,
            proxy: {
                '/api': {
                    target: env.VITE_API_URL || 'http://127.0.0.1:8000',
                    changeOrigin: true,
                    rewrite: (path) => path,
                }
            }
        }
    }
})
