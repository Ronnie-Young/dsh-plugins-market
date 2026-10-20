// Validate index.json against DSH's format-1 market index rules.
import fs from 'node:fs'
import { parseMarketIndex } from '@deepseek-ai/dsh-plugin-market-index'

const url = 'https://raw.githubusercontent.com/Ronnie-Young/dsh-plugins-market/main/index.json'
const index = JSON.parse(fs.readFileSync(new URL('../index.json', import.meta.url), 'utf8'))
const parsed = parseMarketIndex(index, url)
console.log(`ok: ${parsed.plugins.length} plugin(s)`)
for (const plugin of parsed.plugins) {
  for (const version of plugin.versions) {
    console.log(`- ${plugin.name}@${version.version} (${version.source.type})`)
  }
}
