const tailwindPlugin = require('prettier-plugin-tailwindcss');

const config = {
  semi: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  singleQuote: true,
  plugins: [tailwindPlugin],
};

module.exports = config;
