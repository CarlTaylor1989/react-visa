/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
// Plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// Configs
const baseConfig = require('./webpack.base.config');

const prodConfiguration = () => merge([
  {
    optimization: {
      minimizer: [new UglifyJsPlugin()],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'initial',
            enforce: true
          },
        }
      },
      runtimeChunk: 'single'
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new OptimizeCssAssetsPlugin()
    ],
  },
]);

module.exports = env => merge(baseConfig(env), prodConfiguration());
