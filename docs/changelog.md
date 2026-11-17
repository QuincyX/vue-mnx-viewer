# 变更记录

只追加，不重写历史。

## 2026-11-17 · 工作区目录改为 `vue-mnx-viewer`

- 目录由 `mnx-viewer/` 改为 `vue-mnx-viewer/`，npm 包名 `@quincyx/vue-mnx-viewer` 不变；同步
  `pnpm-workspace.yaml`、`pnpm-lock.yaml`（importer 与 `workspace:*` 链接）以及各项目文档中的目录链接。
- 生产部署路径仍为 `/mnx/`，试验场 `base` 与现有资源 URL 不变。
- 验证：`pnpm install --offline`、`pnpm test`、`pnpm type-check`、`pnpm build:lib` 通过；三个前端生产构建通过。

## 2026-11-16 · 试验场接入 PU 品牌图标

- 试验场 `index.html` 增加带 `%BASE_URL%` 前缀的 `favicon.svg` / `favicon.ico` / `apple-touch-icon.png`
  与 `og:*`、`twitter:*`；生产构建下解析为 `/mnx/…`。
- 新增 `public/brand/`（`pu-mark*.svg`、`pu-logo-*`、`pu-app-icon.svg`）、`public/og-image.png` 与
  多尺寸 `favicon.ico`；源文件在仓库根 `brand/`。
- 组件 API、构建产物与 npm 发布内容不变（`files` 仍只含 `dist`、README、LICENSE、changelog）。
- 验证：`pnpm test`（8 项）、`pnpm type-check`、`pnpm build`（试验场与库）通过；
  `dist-playground/index.html` 的图标引用为 `/mnx/favicon.svg`。

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

## 2026-11-16 · 试验场部署到 pu.q-dev.cn/mnx/

- 生产构建 base 改为 `/mnx/`（`command === 'build'` 时启用，本地 dev 仍为 `/`）。
- 示例数据改为从 `import.meta.env.BASE_URL + 'samples/'` 加载，引擎资源传
  `${BASE_URL}score-engine/`，避免部署在子路径时从域名根取 WASM/字体。
- 线上验证：`https://pu.q-dev.cn/mnx/` 200，WASM/字体加载成功，Canvas 正常渲染，无控制台错误。
