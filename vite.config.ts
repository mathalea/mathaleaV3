import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/alea/',
  build: {
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, 'src', 'mathaleaLoader'),
      name: 'loader',
      formats: ['es'],
      fileName: 'mathaleaLoader'
    }
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: true
      }
    })
  ]
})
