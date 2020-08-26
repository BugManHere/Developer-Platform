const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const xml2js = require('xml2js');
const webpack = require('webpack');

const resolve = dir => {
  return path.join(__dirname, dir);
};

module.exports = {
  publicPath: '',
  outputDir: `dist/plugins/Plugins/${process.env.VUE_APP_MID}`,
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: process.env.NODE_ENV !== 'production' ? 'index.html' : 'control.html'
    },
    notify: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'notify.html'
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer')({
            autoprefixer: {
              overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
            }
          }),
          require('postcss-pxtorem')({
            rootValue: 108,
            minPixelValue: 2,
            propWhiteList: []
          })
        ]
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@assets': resolve('src/assets'),
        '@api': resolve('src/api'),
        '@views': resolve('src/views'),
        '@components': resolve('src/components'),
        '@PluginInterface': resolve('../static/lib/PluginInterface.promise')
      },
      extensions: ['.js', '.vue', '.json']
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './src/config/config.xml'),
          to: path.resolve(__dirname, `./dist/plugins/Plugins/${process.env.VUE_APP_MID}/config.xml`),
          transform(content, contentPath) {
            if (contentPath.indexOf('config.xml') !== -1) {
              let xml;
              const options = { explicitArray: false };
              xml2js.parseString(content.toString(), options, (err, result) => {
                const builder = new xml2js.Builder();
                xml = new Buffer.from(builder.buildObject(result));
              });
              return xml;
            }
            return content;
          }
        },
        {
          from: path.resolve(__dirname, '../static/plugin/'),
          to: path.resolve(__dirname, './dist/plugins/')
        },
        {
          from: path.resolve(__dirname, '../static/lib/cordovainit.js'),
          to: path.resolve(__dirname, `./dist/plugins/Plugins/${process.env.VUE_APP_MID}/js/`)
        }
      ])
    ]
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.VUE_APP_MODE === 'debug') {
        config.optimization.minimize(false);
      }
    }
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 10000;
        return options;
      });
    config.module.rules.delete('svg');
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      });

    if (process.env.npm_config_report) {
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
    }
  },
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 3000,
    https: false,
    hotOnly: false,
    proxy: '',
    before: () => {},
    disableHostCheck: true
  },
  pluginOptions: {}
};
