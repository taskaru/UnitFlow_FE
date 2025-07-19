module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "no-console": "warn",
    "no-debugger": "warn",
  },
};
