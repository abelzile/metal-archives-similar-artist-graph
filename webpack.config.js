const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

module.exports = {
  entry: {
    app: './src/scripts/app/main.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/apps/metal-archives-similar-artist-graph/'
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader?minimize', 'style-loader')
      },
      {
        test: /\.(gif|jpg|png)$/,
        loader: 'file-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': "jquery'",
      'window.$': 'jquery'
    }),
    new ExtractTextPlugin('styles.css'),
    new UglifyJSPlugin(),
    new webpack.BannerPlugin({
      banner:
        new Date().toLocaleDateString() +
        ' ' +
        new Date().toLocaleTimeString() +
        '\n\n' +
        fs.readFileSync('./LICENSE.txt', 'utf8')
    })
  ],
  resolve: {
    alias: {
      underscore: 'lodash'
    }
  }
};
