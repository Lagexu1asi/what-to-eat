# 今天吃什么 · 家庭点餐小网页 PWA

家庭点菜 + 菜谱备料清单,基于 React + Vite 构建,支持 iPhone 离线使用。

## 功能

- **今日菜单**:按荤菜/素菜/汤品/主食/凉菜等分类浏览菜品,+/- 调整份数
- **今日备菜清单**:点菜后自动聚合所有菜品的食材与用量,一目了然
- **菜谱库**:展开查看每道菜的备料清单与烹饪步骤,可新增/删除菜品
- **数据持久化**:LocalStorage 本地存储,关闭浏览器数据不丢失
- **每日自动重置**:跨天自动清空今日点单
- **PWA 离线**:添加到 iPhone 主屏幕后,断网也能使用

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

## 生产构建

```bash
npm run build      # 产出 dist/ 目录
npm run preview    # 本地预览构建结果
```

## 部署到 iPhone(两种方式任选)

### 方式零:单文件 HTML(完全跳过电脑部署,推荐先用这个)

无需任何服务器或托管,生成一个自包含的 HTML 文件,传到手机即用:

```bash
npm run build:single
```

产物在 `dist-single/index.html`(所有 JS/CSS 已内联)。

**传到 iPhone 的方式(任选其一):**
- AirDrop 发送到 iPhone → 用 Safari 打开
- 微信「文件传输助手」发送 → iPhone 上点开 → 用 Safari 打开
- 上传到 iCloud Drive → iPhone「文件」App 中打开
- 发邮件附件 → iPhone 邮件 App 中打开

**iPhone 上的使用:**
1. 在 Safari 中打开该 HTML 文件
2. 可正常使用全部功能(点菜/备菜清单/菜谱/添加菜品),数据 LocalStorage 持久化
3. 可点击 Safari 分享 →「添加到主屏幕」作为快捷方式

> 限制:本地文件无法注册 Service Worker,因此没有离线缓存和 PWA 图标/全屏模式。但所有功能完全正常,数据不会丢失。

### 方式一:Netlify Drop(完整 PWA,30 秒拖拽)

1. 电脑浏览器打开 https://app.netlify.com/drop
2. 将 `dist` 文件夹拖入页面(先执行 `npm run build` 生成)
3. 立即获得 HTTPS 网址
4. iPhone Safari 打开网址 → 分享 →「添加到主屏幕」
5. 完整 PWA 体验:离线缓存 / 应用图标 / 全屏模式

### 方式二:Vercel / Netlify(GitHub 自动部署)

1. 将项目推送到 GitHub
2. 登录 https://vercel.com 或 https://netlify.com ,导入仓库
3. 构建命令 `npm run build`,发布目录 `dist`
4. 同上 iPhone Safari 安装

### 方式三:GitHub Pages

仓库已配置 GitHub Actions(见 `.github/workflows/deploy-pages.yml`),推送到 main 分支即自动部署到 GitHub Pages。

## iPhone 安装步骤

1. 用 **Safari** 打开部署后的网址(必须是 HTTPS)
2. 点击底部「分享」按钮
3. 选择「添加到主屏幕」
4. 桌面出现「今天吃什么」图标,点击即可全屏使用,离线可用

> 注意:iPhone 的 PWA 必须通过 Safari 添加,Chrome 等浏览器不支持「添加到主屏幕」。

## 项目结构

```
what-to-eat/
├── index.html              # 入口 HTML(PWA meta 配置)
├── vite.config.js          # Vite + PWA 插件配置
├── public/
│   ├── icon-192.png        # PWA 图标
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── src/
    ├── main.jsx            # React 入口
    ├── App.jsx             # 根组件(标签切换 + 点单状态 + 每日重置)
    ├── index.css           # 全局样式 + 色板变量
    ├── App.css             # 应用布局
    ├── data/defaults.js    # 默认菜品与菜谱数据
    ├── hooks/useLocalStorage.js  # 本地持久化 Hook
    └── components/
        ├── TabNav.jsx          # 顶部标签切换(菜单/菜谱)
        ├── MenuModule.jsx      # 今日菜单模块(点菜 + 备菜清单)
        ├── RecipeModule.jsx    # 菜谱库模块
        ├── DishItem.jsx        # 菜品加减计数项
        ├── RecipeItem.jsx      # 菜谱展开项(备料 + 步骤)
        └── AddDishSheet.jsx    # 底部添加菜品面板
```

## 自定义

- 修改 `src/data/defaults.js` 调整默认菜品与菜谱
- 修改 `src/index.css` 顶部 `:root` 变量调整配色
- 修改 `vite.config.js` 中 manifest 调整应用名称
