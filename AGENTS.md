# Agent 工程指南（@quincyx/vue-mnx-viewer）

本文件适用于在 `vue-mnx-viewer` 目录内工作的 Agent。

## 1. 定位

`@quincyx/vue-mnx-viewer` 是 W3C MNX 的 Vue 3 渲染组件，封装
`@viritura/score-engine` 与 `@viritura/score-viewer`。**不要重写排版、绘谱或分页逻辑**。

## 2. 不可协商的边界

1. 渲染内核版本锁定：`@viritura/score-engine@0.2.0`、`@viritura/score-viewer@0.1.1`。升级必须在
   `docs/changelog.md` 记录，并回归渲染、播放头、SVG 导出与运行时资源加载。
2. `src/index.ts` 是浏览器入口，不得引入 `node:*`；Node-only 的 `src/vite-plugin.ts` 只能从
   `@quincyx/vue-mnx-viewer/vite` 导出。
3. 发布产物由 `pnpm build:lib` 生成：`dist/index.js`、`dist/vite.js`、`dist/samples.js`、
   `dist/style.css` 与 `dist/types/`。不要手工编辑 `dist/`。
4. `files` 只发布 `dist`、README、LICENSE 与 changelog；源码、试验场与测试不进入 npm 包。
5. 运行时资源由 `scoreEngineAssets()` 复制，目标是使用方的 `public/score-engine/`，必须保持
   `.gitignore` 忽略，不得提交 WASM/字体。

## 3. 验证

提交或发布前：

```bash
pnpm test
pnpm type-check
pnpm build:lib
npm pack --dry-run   # 检查发布内容
```

`build:lib` 必须同时产出 JS、CSS 与 `types/index.d.ts`；缺失类型声明视为未完成。

## 4. 文档

- 行为、构建、发布方式变化：更新 `README.md` 与 `docs/changelog.md`。
- 发布前更新 `package.json` 版本并写入 changelog；不要改写已发布版本记录。
