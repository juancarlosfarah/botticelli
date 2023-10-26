module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    // disabling due to conflicts with prettier
    // '@electron-toolkit/eslint-config-prettier'
  ],
}
