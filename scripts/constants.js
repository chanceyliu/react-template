const path = require('path')

const dir = process.cwd()
const srcDir = path.resolve(dir, './src')
const entryPath = path.resolve(srcDir, './index.tsx')
const buildPath = path.resolve(dir, './dist')
const templatePath = path.resolve(dir, './public/index.html')
const faviconPath = path.resolve(dir, './public/favicon.ico')
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  dir,
  srcDir,
  entryPath,
  buildPath,
  templatePath,
  faviconPath,
  isDev,
}
