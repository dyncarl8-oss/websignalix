import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Use the specific key provided by the user if not in env, or override it.
  // For this request, we prioritize the user's provided key.
  const API_KEY = "AIzaSyDO8xhhzWyox1xNPskUeal1jN2IKNdpIQs";

  return {
    plugins: [react()],
    define: {
      // Safely expose process.env.API_KEY without replacing the entire process object
      'process.env.API_KEY': JSON.stringify(API_KEY),
      // Mock the process object for other potential usages
      'process.env': {
        API_KEY: API_KEY
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});