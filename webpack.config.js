const PurifyCSSPlugin = require('purifycss-webpack');
const path = require('path');
const glob = require('glob');

module.exports = {
  plugins: [
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'app/*.html')),
    })
  ]
};
