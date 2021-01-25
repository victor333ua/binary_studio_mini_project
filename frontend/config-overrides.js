const { override, useEslintRc } = require('customize-cra');
const eslintConfigOverrides = require('customize-cra-eslint');
const eslintConfig = require('./.eslintrc.js');


// const path = require('path');

module.exports = override(
  // useEslintRc(path.resolve(__dirname, '.eslintrc.js'))
  eslintConfigOverrides(eslintConfig),
);
