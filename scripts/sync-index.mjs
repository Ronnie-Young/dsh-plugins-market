// Sync index.json with the latest GitHub Release of every indexed plugin repository.
// Runs inside GitHub Actions (GITHUB_TOKEN provided) or locally with GH_TOKEN.
//
// 环境变量 PLUGIN_REPO（可选）用来只同步某一个仓库，例如 Ronnie-Young/dsh-session-team；
// 不设置时按 index.json 里每个插件的 repository.url 逐个同步。
import fs from 'node:fs'
import path from 'node:path'

const OVERRIDE = (process.env.PLUGIN_REPO || '').trim()
const root = path.dirname(new URL(import.meta.url).pathname).replace(/\/scripts$/, '')
const indexPath = path.join(root, 'index.json')
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || ''

async function api(pathname) {
  const res = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token === '' ? {} : { Authorization: `Bearer ${token}` }),
    },
  })
  if (!res.ok) throw new Error(`${pathname} -> HTTP ${res.status}`)
  return res.json()
}

/** 从插件的 repository/homepage 里解析出 owner/repo。 */
function repoOf(plugin) {
  const url = plugin?.repository?.url || plugin?.homepage || ''
  const match = String(url).match(/github\.com\/([^/]+\/[^/#?]+)/i)
  return match === null ? '' : match[1].replace(/\.git$/, '')
}

/** 读发布提交里的 package.json，取 engines.dsh；读不到就返回空。 */
async function enginesDshOf(repo, ref) {
  try {
    const file = await api(`/repos/${repo}/contents/package.json?ref=${encodeURIComponent(ref)}`)
    const text = Buffer.from(String(file.content || '').replace(/\n/g, ''), 'base64').toString('utf8')
    const pkg = JSON.parse(text)
    const range = pkg?.engines?.dsh
    return typeof range === 'string' ? range : ''
  } catch {
    return ''
  }
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
const targets = OVERRIDE === ''
  ? index.plugins
  : index.plugins.filter(plugin => repoOf(plugin) === OVERRIDE)
if (targets.length === 0) throw new Error(`no indexed plugin matches ${OVERRIDE || '(all)'}`)

let changed = false
for (const plugin of targets) {
  const repo = repoOf(plugin)
  if (repo === '') {
    console.log(`skip ${plugin.name}: repository url missing`)
    continue
  }
  const release = await api(`/repos/${repo}/releases/latest`)
  const version = String(release.tag_name || '').replace(/^v/, '')
  if (!/^\d+\.\d+\.\d+/.test(version)) throw new Error(`${repo}: unexpected tag ${release.tag_name}`)
  if (plugin.versions.some((entry) => entry.version === version)) {
    console.log(`up to date: ${plugin.name}@${version}`)
    continue
  }
  const commit = (await api(`/repos/${repo}/commits/${release.tag_name}`)).sha
  const publishTimestamp = Math.floor(Date.parse(release.published_at) / 1000)
  const dshRange = (await enginesDshOf(repo, release.tag_name))
    || plugin.versions[0]?.engines?.dsh
    || '>=0.2.1-rc.2'
  plugin.versions = [
    {
      version,
      publishTimestamp,
      source: { type: 'git', url: `https://github.com/${repo}`, commit },
      engines: { dsh: dshRange },
    },
    ...plugin.versions,
  ].slice(0, 10)
  changed = true
  console.log(`added ${plugin.name}@${version} (${commit.slice(0, 10)})`)
}

if (!changed) {
  console.log('index unchanged')
  process.exit(0)
}
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
console.log('index.json updated')
