const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
  entry: ["./src/js/index.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
    library: "Conquer",
  },
  plugins: [new NodemonPlugin()],
  module: {
    rules: [],
  },
  devtool: "source-map",
  mode: "development",
};
