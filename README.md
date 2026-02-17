# 新年烟花 (Yanhua)

国潮风格的新年烟花互动网页。用户点击屏幕即可发射烟花，支持多种特效页面、祝福内容展示与贺卡生成。

## 功能简介
- 烟花互动：点击触发多形态烟花效果
- 悄悄话页面：展示祝福文案与情绪化动效
- 水墨转场：页面切换时加入国风过渡动画
- 许愿页：沉浸式氛围页面
- 贺卡生成：组合祝福语并导出静态贺卡

## 技术栈
- React 18
- TypeScript
- Vite 7
- Tailwind CSS 3
- Framer Motion
- Canvas/Web Audio API

## 本地运行
1. 安装依赖
```bash
npm install
```
2. 启动开发服务器
```bash
npm run dev
```
3. 打开浏览器访问
```text
http://localhost:5173/
```

## 构建与预览
- 生产构建：`npm run build`
- 本地预览：`npm run preview`

## 目录结构
```text
src/
  App.tsx                    # 页面编排与状态管理
  main.tsx                   # 入口文件
  index.css                  # 全局样式与 Tailwind 指令
  components/
    FireworksCanvas.tsx      # 烟花主画布
    SilkBackground.tsx       # 丝绸背景
    InkTransition.tsx        # 水墨转场
    SecretWhispers.tsx       # 悄悄话页面
    WishPage.tsx             # 许愿页面
    CardGenerator.tsx        # 贺卡生成
  utils/
    audio.ts                 # 音频控制
```

## 环境要求
- Node.js 18+（建议 LTS）
- npm 9+

## 常见问题
- 样式显示异常  
  检查是否存在 `postcss.config.js`，并确认已执行 `npm install`。
- 启动时报 `vite` 找不到  
  说明依赖未完整安装，重新执行 `npm install`。
- 编辑器出现大量 TS 红线  
  执行 `TypeScript: Restart TS Server`，并确认项目根目录有 `tsconfig.json`。

## 说明
该项目以交互体验与视觉表现为主，建议在桌面端 Chrome/Edge 下体验，以获得更稳定的动画与音频效果。
