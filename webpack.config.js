const path = require('path');
const glob = require('glob');

const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");



module.exports = {
  plugins: [
    new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, 'src/**/*'), { nodir: true })
    }),
    new CompressionPlugin(),
    new TerserPlugin()
  ]
};
