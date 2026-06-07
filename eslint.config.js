// ESLint 10+ Flat Config
// Next.js 16 recommended config (replaces legacy .eslintrc.json)
const nextConfig = require("eslint-config-next/core-web-vitals");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...nextConfig,
  {
    rules: {
      // Custom overrides for this project
    },
  },
];
