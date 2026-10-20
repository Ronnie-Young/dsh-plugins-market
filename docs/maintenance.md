# 维护说明

## 自动同步

市场索引由 GitHub Actions **自动维护**，不需要手动改：

- `.github/workflows/sync.yml` 每小时检查 [dsh-scnet-plan](https://github.com/Ronnie-Young/dsh-scnet-plan) 的最新 Release；
- 发现新版本时，自动读取 tag 与 commit，写进 `index.json`，校验通过后提交推送（Pages 随即更新）；
- 也可以在 Actions 页面点「Run workflow」手动触发，或由插件仓库发版后通过 `repository_dispatch` 即时触发（需要在插件仓库配置 `MARKET_TOKEN` secret）。

## 添加或更新插件

> 改了 `index.json` 后，jsDelivr 的 `@main` 缓存可能滞后，可访问下面地址手动刷新：
> `https://purge.jsdelivr.net/gh/Ronnie-Young/dsh-plugins-market@main/index.json`

编辑 `index.json`：

- 每个插件一个 `plugins[]` 条目，`name` 必须是 npm 包名；
- `versions[]` 里写 `version`、`publishTimestamp`（Unix 秒）、`source`；
- `source` 支持两种：
  - `{"type":"git","url":"https://github.com/...","commit":"40位完整SHA"}`（当前使用，无需 npm 发布）
  - `{"type":"npm"}`（发布到 npm 后更简单）
- `engines.dsh` 写兼容的 DSH 版本范围。

改完在本地校验：

```bash
npm install
npm run validate
```

推送到 `main` 后 GitHub Actions 会自动跑同一个校验。
