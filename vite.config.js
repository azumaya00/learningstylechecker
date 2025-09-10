import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '学習スタイル診断',
        short_name: '学習診断',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ea5e9', // primary に寄せる。後で調整可
        icons: [
          // 後で実アイコンに差し替え。いまはダミーパスでOK（存在しなくてもビルド可）
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: { 
        navigateFallback: '/' 
      }
    })
  ],
  server: {
    port: 3000
  },
  assetsInclude: ['**/*.json'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
