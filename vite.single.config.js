import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

/**
 * 单文件构建配置:将所有 JS/CSS 内联到一个 index.html 中
 * 产物可直接传到 iPhone,Safari 打开即用,无需服务器
 * 注意:单文件模式下不生成 Service Worker(本地文件无法注册 SW)
 */
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile({
      inlinePattern: ['**/*.{js,css,woff2,png,svg}'],
      useRecommendedBuildConfig: true
    })
  ],
  build: {
    outDir: 'dist-single',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    }
  }
})
