/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv').config({
  path: `${__dirname}/.env`
});

const APP_DIR = path.join(__dirname, 'src');

const stringifyObjKeys = (obj) => {
  const stringified = {};
  Object.keys(obj).forEach((key) => {
    stringified[key] = JSON.stringify(obj[key]);
  });
  return stringified;
};

const parseEnvVariables = (env1, env2) => ({
  ...process.env,
  ...stringifyObjKeys(env1),
  ...stringifyObjKeys(env2)
});

module.exports = (env) => {
  const { PLATFORM } = env;
  const envVars = parseEnvVariables(env, dotenv.parsed);
  return merge([
    {
      entry: ['@babel/polyfill', APP_DIR],
      output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        chunkFilename: '[name].js',
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            resolve: {
              extensions: ['.js', '.jsx']
            },
            use: ['babel-loader']
          },
          {
            test: /\.(css|scss)$/,
            use: [
              PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
              'css-loader',
              'sass-loader'
            ]
          },
          {
            test: /\.json$/,
            loader: 'json-loader',
            type: 'javascript/auto'
          },
          {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            include: [/fonts/],
            use: [{
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'styles/fonts/'
              }
            }]
          },
          {
            test: /\.mp3$/,
            use: [{
              loader: 'file-loader',
              options: {
                limit: false,
                name: '[name].[ext]',
                outputPath: 'media/'
              }
            }]
          },
          {
            test: /\.(png|jpg|gif)$/,
            include: [/resources/],
            use: [{
              loader: 'file-loader',
              options: {
                limit: false,
                name: '[name].[ext]',
                outputPath: 'assets/'
              }
            }]
          },
          {
            test: /\.(svg)$/,
            include: [/resources/],
            loader: 'svg-inline-loader'
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            include: [/styles/],
            use: [{
              loader: 'url-loader',
              options: {
                limit: 5000,
                outputPath: 'images/'
              }
            }]
          },
          {
            test: /\.html$/,
            include: [/resources/],
            use: [{
              loader: 'html-loader',
              options: {
                minimize: true
              }
            }]
          }
        ]
      },
      resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.join(__dirname, 'src', 'index.html'),
          filename: './index.html'
        }),
        new webpack.DefinePlugin({
          'process.env': {
            ...envVars
          }
        }),
        new CopyWebpackPlugin([{
          from: path.join(__dirname, 'src', 'resources')
        }])
      ]
    }
  ]);
};
