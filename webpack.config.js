const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
  entry: './src/sass/style.scss',
  output: {
    filename: 'bundle.js',
    path: path.resolve( __dirname, 'public' )
  },
  plugins: [
    new MiniCssExtractPlugin( { filename: 'css/style.css' } )
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map',
  mode: 'development'
};