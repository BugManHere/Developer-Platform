const plugins = [
  [
    'import',
    {
      libraryName: 'gree-ui',
      libraryDirectory: 'lib'
    }
  ]
];

// 生产模式使用 transform-remove-console 插件
if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_MODE !== 'debug') {
  plugins.push('transform-remove-console');
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins
};
