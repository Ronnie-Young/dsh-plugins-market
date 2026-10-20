# dsh-plugins-market

Ronnie-Young 的个人 **DeepSeek Harness 插件市场索引**，用 DSH 的 format 1 索引格式维护自己开发的插件。

## 索引地址

在 DSH 里添加这个 URL 即可浏览和安装本仓库收录的插件（**推荐 GitHub Pages**，直读仓库、没有 CDN 缓存延迟）：

```text
https://ronnie-young.github.io/dsh-plugins-market/index.json
```

备用地址（jsDelivr，`@main` 有缓存，更新后可能滞后）：

```text
https://cdn.jsdelivr.net/gh/Ronnie-Young/dsh-plugins-market@main/index.json
```

> `raw.githubusercontent.com` 在部分网络会连接超时，不建议使用。

## 在 DSH 里使用

1. 打开侧栏 **插件** → 右上「实验性插件」旁的 **更多**，启用 **自定义插件市场**；
2. 进入 **发现** 标签 → **管理索引源** → **添加索引源**，粘贴上面的地址；
3. 回到「发现」，即可看到收录的插件并一键安装。

> 索引源只能由用户手动添加；本仓库只提供索引文件。

## 自动同步

市场索引由 GitHub Actions **自动维护**，不需要手动改：

- `.github/workflows/sync.yml` 每小时检查 [dsh-scnet-plan](https://github.com/Ronnie-Young/dsh-scnet-plan) 的最新 Release；
- 发现新版本时，自动读取 tag 与 commit，写进 `index.json`，校验通过后提交推送（Pages 随即更新）；
- 也可以在 Actions 页面点「Run workflow」手动触发，或由插件仓库发版后通过 `repository_dispatch` 即时触发（需要在插件仓库配置 `MARKET_TOKEN` secret）。

## 收录插件

| 插件 | 版本 | 说明 |
| --- | --- | --- |
| `dsh-scnet-plan` | 0.0.2 | [SCNet 套餐](https://github.com/Ronnie-Young/dsh-scnet-plan)：侧栏显示 Credits 余量、每日热力图与 token 构成 |

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

## License

MIT © Ronnie-Young
