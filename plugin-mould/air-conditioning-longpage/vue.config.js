const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ThemeColorReplacer = require('webpack-theme-color-replacer');
const forElementUI = require('webpack-theme-color-replacer/forElementUI');

const xml2js = require('xml2js');
const webpack = require('webpack');

const resolve = dir => {
  return path.join(__dirname, dir);
};

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const { key } = require('./plugin.id.json');
const { productModel, moreOption } = require(`../../output/${key}.json`);
const statueJson = moreOption.statueJson;
const statueJson2 = moreOption.statueJson2;

process.env.VUE_APP_VER = moreOption.pluginVer;
process.env.VUE_APP_MID = productModel;
process.env.VUE_APP_JSON = JSON.stringify(statueJson);
process.env.VUE_APP_JSON2 = JSON.stringify(statueJson2);

const configList = fs.readdirSync(resolve('../../output'));
const deleteConfigList = configList.filter(config => !config.includes(key));

const { matchColors } = require('./src/utils/themeColorReplacer');
// console.log([...forElementUI.getElementUISeries('#fffe11')]);
module.exports = {
  publicPath: '',
  outputDir: `dist/plugins/Plugins/${process.env.VUE_APP_MID}`,
  lintOnSave: isDevelopment,
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: isProduction ? 'control.html' : 'index.html'
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
        '@logic': resolve('src/logic'),
        '@components': resolve('src/components'),
        '@utils': resolve('src/utils'),
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
                const outPut = result;
                outPut.device.version = process.env.VUE_APP_VER;
                outPut.device.mid = process.env.VUE_APP_MID;
                outPut.device.statueJson = process.env.VUE_APP_JSON;
                outPut.device.statueJson2 = process.env.VUE_APP_JSON2;
                // eslint-disable-next-line new-cap
                xml = new Buffer.from(builder.buildObject(outPut));
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
      ]),
      new ThemeColorReplacer({
        fileName: 'css/theme-colors.[contenthash:8].css',
        matchColors,
        changeSelector: forElementUI.changeSelector,
        isJsUgly: process.env.NODE_ENV !== 'development'
      })
    ]
  },
  chainWebpack: config => {
    if (isProduction) {
      process.env.VUE_APP_MODE === 'debug' && config.optimization.minimize(false);
      config.module.noParse([/^(vue|vue-router|vuex|vuex-router-sync)$/, ...deleteConfigList.map(str => new RegExp(str))]); // 按需打包配置
    }
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 10000;
        return options;
      });
    if (process.env.npm_config_report) {
      config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
    }
  },
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8084,
    https: false,
    hotOnly: false,
    proxy: '',
    before: () => {},
    disableHostCheck: true
  }
};
