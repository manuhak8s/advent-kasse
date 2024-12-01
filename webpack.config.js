const path = require('path');

const commonConfig = {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
};

const mainConfig = {
  ...commonConfig,
  target: 'electron-main',
  entry: './src/main/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: 'main.js'
  },
  node: {
    __dirname: false,
    __filename: false
  }
};

const preloadConfig = {
  ...commonConfig,
  target: 'electron-preload',
  entry: './src/main/preload.ts',
  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: 'preload.js'
  }
};

const rendererConfig = {
  ...commonConfig,
  target: 'web',  // Änderung hier von 'electron-renderer' zu 'web'
  entry: './src/renderer/renderer.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'renderer.js'
  },
  resolve: {
    ...commonConfig.resolve,
    fallback: {
      "path": false,
      "fs": false,
      "crypto": false
    }
  }
};

module.exports = [mainConfig, preloadConfig, rendererConfig];