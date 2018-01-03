// This is my first use of webpack. There are lots of problems yet. I will solve the problems when I have time.

const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    main: './src/js/main.js',
    assets: './src/js/assets.js',
    external: ['jquery']
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'js/[name].bundle.js'
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      inject: false
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'external',
      filename: 'js/[name].bundle.js'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        include: path.resolve(__dirname, './src'),
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            sourceMap: true
          }
        }]
      }, {
        test: /\.css$/,
        use: [
          {loader: 'style-loader', options: {sourceMap: true}},
          {loader: 'css-loader', options: {sourceMap: true}},
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              /* webpack requires an identifier (ident) in options when {Function}/require is used (Complex Options). The ident can be freely named as long as it is unique. It's recommended to name it (ident: 'postcss') */
              indent: 'postcss',
              plugins: [require('autoprefixer')()]
            }
          }
        ]
      }, {
        test: /\.(png|jpe?g|ico|gif)$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        include: path.resolve(__dirname, './src'),
        use: [
          {
            loader: 'url-loader',
            options: {
              // 若图片大于limit则交给file-loader处理，否则直接转为base64编码
              limit: 5000,
              name: 'img/[name].[ext]',
            },
          }
        ],
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5000,
            mimetype: 'application/font-woff',
            name: 'img/[name].[ext]'
          }
        }]
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }]
      }
    ]
  }
}
