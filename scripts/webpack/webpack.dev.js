const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  // 构建后的代码文件会内联系生成一个能映射到源代码的sourceMap，所以能在运行后追踪到源代码的错误，不同值的详细作用参考官网
  devtool: 'eval-source-map',
  devServer: {
    compress: true, // 是否启用gzip压缩
    clientLogLevel: 'silent',
    stats: 'errors-only', // 终端只打印error
    open: true, // 编译完成自动打开浏览器
    port: 3002,
    hot: true, // 启用HMR-热模块替换（只会更新有改变的模块）
  },
})
