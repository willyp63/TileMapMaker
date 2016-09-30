var path = require("path");

module.exports = {
  context: __dirname,
  entry: "./assets/js/mapMaker.js",
  output: {
    path: path.join(__dirname, 'assets', 'js'),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  devtool: 'source-maps'
};
