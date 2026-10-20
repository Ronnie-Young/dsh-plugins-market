# 维护说明

## 自动同步

市场索引由 GitHub Actions **自动维护**，不需要手动改：

- `.github/workflows/sync.yml` 每小时检查 [dsh-scnet-plan](https://github.com/Ronnie-Young/dsh-scnet-plan) 的最新 Release；
- 发现新版本时，自动读取 tag 与 commit，写进 `index.json`，校验通过后提交推送（Pages 随即更新）；
- 也可以在 Actions 页面点「Run workflow」手动触发，或由插件仓库发版后通过 `repository_dispatch` 即时触发（需要在插件仓库配置 `MARKET_TOKEN` secret）。
