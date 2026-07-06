import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages 项目站点部署在子路径 /<repo>/ 下。
// CI 环境使用仓库子路径避免资源 404，本地开发保持根路径 '/'。
const base = process.env.GITHUB_ACTIONS ? '/what-to-eat/' : '/'

// Vite 配置:集成 React 插件与 PWA 自动生成
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: '今天吃什么',
        short_name: '今天吃什么',
        description: '家庭点餐小网页 · 菜单点菜与菜谱备料',
        theme_color: '#C8643C',
        background_color: '#FAF7F2',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        lang: 'zh-CN',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true
      }
    })
  ],
  server: {
    host: true
  }
})
