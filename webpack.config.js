const path = require('path');

const mainConfig = {
  mode: 'development',
  entry: './src/main/main.ts',
  target: 'electron-main',
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: 'ts-loader'
    }]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/main')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

const rendererConfig = {
  mode: 'development',
  entry: './src/renderer/renderer.tsx',
  target: 'web',
  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: 'ts-loader'
    }]
  },
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist/renderer'),
    libraryTarget: 'umd',  // Wichtig für die Kompatibilität
    globalObject: 'this'   // Wichtig für die Kompatibilität
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

module.exports = [mainConfig, rendererConfig];