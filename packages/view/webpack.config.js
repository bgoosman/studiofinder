const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // alternative to rm -rf dist/*
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.tsx?$/, use: 'ts-loader' },
      // https://webpack.js.org/guides/asset-management
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "assets" },
      ],
    }),
    new HtmlWebpackPlugin({
      favicon: 'src/static/favicon/favicon.ico',
      title: 'Studio Finder',
    }),
    new HtmlWebpackPartialsPlugin([{
      path: './src/html/goatcounter.html',
      location: 'head'
    }, {
      path: './src/html/react-app-root.html'
    }, {
      path: './src/html/app-loader.html',
    }])
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: {
      '.ts': ['.js', '.ts'],
    },
    plugins: [new TsconfigPathsPlugin({/* options: see below */ })]
  },
};