import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: './build',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      constants: path.resolve(__dirname, './src/constants'),
      hooks: path.resolve(__dirname, './src/hooks'),
      state: path.resolve(__dirname, './src/state'),
      types: path.resolve(__dirname, './src/types'),
      utils: path.resolve(__dirname, './src/utils'),
      web3: path.resolve(__dirname, './src/web3'),
    },
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
})