const path = require('path');

const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'stellaris-to-json.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
};

module.exports = config;
