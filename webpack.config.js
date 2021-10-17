const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = {
  entry: path.resolve( __dirname, './server.js' ),
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true,
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve( __dirname, './dist' ),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin( {
      title: 'Hot Module Replacement',
    } ),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  },
  resolve: {
    extensions: [ '*', '.js' ]
  }
};