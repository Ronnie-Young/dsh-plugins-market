// Sync index.json with the latest GitHub Release of the plugin repository.
// Runs inside GitHub Actions (GITHUB_TOKEN provided) or locally with GH_TOKEN.
import fs from 'node:fs'
import path from 'node:path'

const PLUGIN = process.env.PLUGIN_REPO || 'Ronnie-Young/dsh-scnet-plan'
const INDEX_URL = 'https://ronnie-young.github.io/dsh-plugins-market/index.json'
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

const release = await api(`/repos/${PLUGIN}/releases/latest`)
const version = String(release.tag_name || '').replace(/^v/, '')
if (!/^\d+\.\d+\.\d+/.test(version)) throw new Error(`unexpected tag ${release.tag_name}`)
const commit = (await api(`/repos/${PLUGIN}/commits/${release.tag_name}`)).sha
const publishTimestamp = Math.floor(Date.parse(release.published_at) / 1000)

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
const plugin = index.plugins.find((entry) => entry.name === 'dsh-scnet-plan')
if (!plugin) throw new Error('dsh-scnet-plan missing from index.json')

if (plugin.versions.some((entry) => entry.version === version)) {
  console.log(`up to date: ${version}`)
  process.exit(0)
}

plugin.versions = [
  {
    version,
    publishTimestamp,
    source: { type: 'git', url: `https://github.com/${PLUGIN}`, commit },
    engines: { dsh: '>=0.2.1-rc.2' },
  },
  ...plugin.versions,
].slice(0, 10)

fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`)
console.log(`added ${version} (${commit.slice(0, 10)}) for ${INDEX_URL}`)
