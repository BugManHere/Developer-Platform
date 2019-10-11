const path = require('path');
const webpack = require('webpack');

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: 'client/main.js'
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Popper: ["popper.js", "default"]
      })
    ],
  },
  chainWebpack: (config)=>{
    //修改文件引入自定义路径
    config.resolve
      .merge({
        alias: {
        '@': resolve('client'),
        '@components': resolve('client/components'),
        '@assets': resolve('client/assets'),
        },
      })
  },
  devServer: {
    hotOnly: false,
  },
}
