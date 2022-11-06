const path = require('path');
const destPath = path.resolve(__dirname, 'docs');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.tsx',
  output: {
    path: destPath,
    filename: 'main.js',
  },
  devServer: {
    port: '8080',
    hot: true,
    open: true,
    static: {
      directory: destPath,
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/index.html', to: '' },
        { from: 'src/assets', to: 'assets' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx|\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
  },
  target: ['web', 'es5'],
};
