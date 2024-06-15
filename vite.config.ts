import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pomotrick',
        short_name: 'Pomotrick',
        description: 'time management application with pomodoro',
        theme_color: '#0B1C2B',
        background_color: '#0B1C2B',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-384x384.png',
            sizes: '512x512',
            type: 'image/png'
          },
        ]
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
