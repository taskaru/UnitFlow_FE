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
    "no-console": "error",
    "no-debugger": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "vue/script-setup-uses-vars": "error",
    "vue/multi-word-component-names": [
      "error",
      {
        "ignores": ["index", "Layout"] 
      }
    ]
  },
};
