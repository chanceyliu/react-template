// webpack公共配置文件
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { srcDir, isDev, entryPath, buildPath, templatePath, faviconPath } = require('../constants')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

// 针对不同的样式文件引用不同的loader，因为大部分相同，所以抽成公共方法
function getCssLoader(lang) {
  const loaders = [
    // 开发环境下将css文件分开打包
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('@opd/css-modules-typings-loader'),
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: isDev,
        importLoaders: lang === 'css' ? 1 : 2,
        modules: {
          // 在本地环境下为了方便调试，我们将样式名展示为路径拼接类名
          localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64]',
          // 将本地环境的命名转换为驼峰格式
          exportLocalsConvention: 'camelCaseOnly',
          auto: true,
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            require('postcss-normalize'),
          ],
        },
        sourceMap: isDev,
      },
    },
  ]
  if (lang === 'less') {
    loaders.push({
      loader: 'less-loader',
      options: {
        lessOptions: {
          sourceMap: isDev,
        },
      },
    })
  }
  return loaders
}

module.exports = {
  target: isDev ? 'web' : 'browserslist', // webpack-dev-server热更新与browserslist环境冲突
  entry: {
    app: entryPath,
  },
  output: {
    // 这里我们使用 contenthash，是因为这样 webpack 就会根据文件内容生成不同的 hash 值
    // 因为如果打包后文件 hash 值都一样，那么只要改变任意一个文件会导致所有文件都会重新请求，
    // 而我们之所以要使用 hash 是为了当内容发生更改时，浏览器会去重新发起请求，而不是使用缓存
    filename: `[name]${isDev ? '' : '.[contenthash]'}.js`,
    path: buildPath,
    clean: true, // 打包自动清理dist目录
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // 缓存babel执行结果，提升打包速度
            cacheDirectory: true,
            include: srcDir,
          },
        },
      },
      {
        test: /\.css$/,
        use: getCssLoader('css'),
      },
      {
        test: /\.less$/,
        use: getCssLoader('less'),
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              name: '[name].[hash:8].[ext]',
              outputPath: 'assets/fonts',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 当文件小于10kb的时候采用url-loader将图片打包成base64的格式（否则就用file-loader）
              limit: 10 * 1024,
              // [ext]:取文件的原扩展名
              name: '[name].[hash:8].[ext]',
              outputPath: 'assets/images',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '基础模板',
      template: templatePath, // 复制该路径下的html文件，并自动引入打包输出的所有文件
      favicon: faviconPath,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new WebpackBar(), // 显示编译进度
    new webpack.IgnorePlugin({
      // 忽略样式类型文件的编译
      resourceRegExp: /(css|less)\.d\.ts$/,
    }),
    new ForkTsCheckerWebpackPlugin({
      // 打包时对文件进行类型检测
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
    }),
  ],
  // 可以指定某些条件下使用特定的压缩工具
  optimization: {
    minimize: !isDev,
    minimizer: [new CssMinimizerPlugin()],
    // 将node_modules中的代码单独打包成一个chunk
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    // 路径别名
    alias: {
      '@': srcDir,
    },
    // 添加这些后缀名作为解析，引入时可不用添加后缀（优先级按照数组顺序）
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
}
