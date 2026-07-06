/**
 * generate-icons.mjs —— 用 sharp 把 icon.svg 转换为三个尺寸的 PNG
 * 输出: public/icon-192.png / public/icon-512.png / public/apple-touch-icon.png
 * 运行: npm install sharp --no-save && node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const svgPath = fileURLToPath(new URL('./icon.svg', import.meta.url))
const svg = readFileSync(svgPath)

// 三个尺寸:192/512 用于 PWA manifest,180 用于 iOS apple-touch-icon
const targets = [
  { size: 192, out: '../public/icon-192.png' },
  { size: 512, out: '../public/icon-512.png' },
  { size: 180, out: '../public/apple-touch-icon.png' }
]

for (const { size, out } of targets) {
  const outPath = fileURLToPath(new URL(out, import.meta.url))
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(outPath)
  console.log(`✓ ${out} (${size}x${size})`)
}

console.log('\n图标生成完成')
