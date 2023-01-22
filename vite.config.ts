import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/beta/',
  build: {
    target: 'es2015'
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: true
      }
    })
  ]
})
