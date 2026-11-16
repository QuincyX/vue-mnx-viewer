# 变更记录

只追加，不重写历史。

## 2026-11-16 · 改名 `@quincyx/vue-mnx-viewer` 并准备 npm 发布

- 包名由 `@pu/mnx-viewer` 改为 `@quincyx/vue-mnx-viewer`；工作区内三个前端与全部文档同步。
- 发布形态：
  - `dist/index.js`（组件与工具）、`dist/vite.js`（`scoreEngineAssets()`）、`dist/samples.js`（示例数据）、
    `dist/style.css`、`dist/types/**/*.d.ts`。
  - `package.json` 增加 `main` / `module` / `types` / `exports` / `files` / `publishConfig`（public）。
  - `vue` 改为 peerDependency `^3.5`，`@viritura/*` 保持精确锁定。
- 构建：`build:lib` = Vite 多入口构建 + `vue-tsc` 声明 + 声明清理（移除 CSS side-effect import、
  删除重复 JSON）。
- 文档：README 增加安装、样式引入、发布说明；新增 LICENSE 与 AGENTS。
- 验证：`npm pack --dry-run` 产物 10.7 kB / 14 files；消费方 TypeScript 检查通过；三个前端生产构建通过。

## 2026-11-16 · 初始化

- 新建 `@pu/mnx-viewer`：Vue 3 封装 `@viritura/score-engine` 0.2.0 与 `@viritura/score-viewer` 0.1.1。
- 提供 `MnxViewer` 组件、`scoreEngineAssets()` Vite 插件与 5 个 W3C MNX 示例数据。
- 试验场验证：Edge 无头浏览器渲染 2 份 SVG/Canvas 图层，字体与 WASM 均从 `/score-engine/` 成功加载。
- 明确不重写排版/绘谱；MusicXML 转换与编辑交互留在 pu-studio。
