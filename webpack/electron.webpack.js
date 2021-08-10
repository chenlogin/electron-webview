const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '../');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
  context: ROOT_PATH,
  devtool: 'source-map',
  mode: "development",
  entry: path.resolve(ROOT_PATH, 'src/main', 'main.js'),
  output: {
    path: DIST_PATH,
    filename: 'main/[name].min.js'
  },
  target: 'electron-main',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    'electron-screenshots': 'require("electron-screenshots")'
  },
  plugins: [
    
    //All files inside webpack's output.path directory will be removed once, but the directory itself will not be
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ["@babel/plugin-transform-runtime"]
          }
        },
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  node: {
    __dirname: false,
  },
};
