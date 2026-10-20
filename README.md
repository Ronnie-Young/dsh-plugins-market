# dsh-plugins-market

Ronnie-Young 的个人 **DeepSeek Harness 插件市场索引**，用 DSH 的 format 1 索引格式维护自己开发的插件。

## 索引地址

在 DSH 里添加这个 URL 即可浏览和安装本仓库收录的插件（**推荐 jsDelivr**，国内可访问）：

```text
https://cdn.jsdelivr.net/gh/Ronnie-Young/dsh-plugins-market@main/index.json
```

备用地址（GitHub Pages）：

```text
https://ronnie-young.github.io/dsh-plugins-market/index.json
```

> `raw.githubusercontent.com` 在部分网络会连接超时，不建议作为主地址。

## 在 DSH 里使用

1. 打开侧栏 **插件** → 右上「实验性插件」旁的 **更多**，启用 **自定义插件市场**；
2. 进入 **发现** 标签 → **管理索引源** → **添加索引源**，粘贴上面的地址；
3. 回到「发现」，即可看到收录的插件并一键安装。

> 索引源只能由用户手动添加；本仓库只提供索引文件。

## 收录插件

| 插件 | 版本 | 说明 |
| --- | --- | --- |
| `dsh-scnet-plan` | 0.0.1 | [SCNet 套餐](https://github.com/Ronnie-Young/dsh-scnet-plan)：侧栏显示 Credits 余量、每日热力图与 token 构成 |

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
