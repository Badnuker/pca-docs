# PCA Docs

跨平台比价智能体（Price Compare Agent）的文档站点。

基于 [Starlight](https://starlight.astro.build) + [Catppuccin](https://github.com/catppuccin/starlight) 主题构建。

## 开发

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

## 构建

```bash
pnpm build      # 输出到 dist/
pnpm preview    # 预览构建产物
```

## 部署

推送 `main` 分支自动触发 GitHub Actions，部署到 [badnuker.github.io/pca-docs](https://badnuker.github.io/pca-docs)。
