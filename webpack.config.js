const path = require('path');

const commonConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: 'ts-loader',
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: 'source-map'
};

const mainConfig = {
  ...commonConfig,
  target: 'electron-main',
  entry: './src/main/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/main')
  }
};

const rendererConfig = {
  ...commonConfig,
  target: 'web',
  entry: './src/renderer/renderer.tsx',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist/renderer')
  }
};

module.exports = [mainConfig, rendererConfig];