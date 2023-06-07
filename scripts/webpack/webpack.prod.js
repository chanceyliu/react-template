// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  // plugins: [new BundleAnalyzerPlugin()], // 查看包的依赖图以及大小
})
