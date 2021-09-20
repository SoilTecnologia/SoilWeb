module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': ['warn', 'never'],
    'no-console': [
      'error',
      { allow: ['warn', 'error', 'info', 'debug', 'dir'] }
    ]
  },
  overrides: [
    {
      files: ['src/**/*.s']
    }
  ]
};
