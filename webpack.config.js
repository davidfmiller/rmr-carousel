
const
    path = require('path'),
    webpack = require('webpack');
//    terser = require('terser-webpack-plugin');

const config = {
  entry: './src/scripts/build.js',
  output: {
    path: path.resolve(__dirname, 'docs/build/'),
    filename: 'rmr-carousel.bundle.js'
  },
//  mode: 'production',
  mode: 'development',
  watch: true,
  plugins : [
//     new terser({
//       extractComments: false,
//       test: /\.js(\?.*)?$/i
//     }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
//        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            babelrc: true,
            presets: ['@babel/preset-env']
          }
        }]
      }
    ]
  }
};

module.exports = config;
