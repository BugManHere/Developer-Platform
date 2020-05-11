module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'import',
      {
        libraryName: 'gree-ui',
        libraryDirectory: 'lib'
      }
    ]
  ]
};
