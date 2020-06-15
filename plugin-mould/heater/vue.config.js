const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const browserslist = require('./package.json').browserslist;
const xml2js = require('xml2js');

const resolve = dir => {
  return path.join(__dirname, dir);
};

// eslint-disable-next-line func-names
(function () {
  const { key } = require('./plugin.id.json');
  const { productModel, moreOption } = require(`../../output/${key}.json`);
  const statueJson = moreOption.statueJson;
  const statueJson2 = moreOption.statueJson2;
  process.env.VUE_APP_MID = productModel;
  process.env.VUE_APP_JSON = JSON.stringify(statueJson);
  process.env.VUE_APP_JSON2 = JSON.stringify(statueJson2);
}());

module.exports = {
  publicPath: '',
  outputDir: `dist/plugins/Plugins/${process.env.VUE_APP_MID}`,
  lintOnSave: true,
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename:
        process.env.NODE_ENV !== 'production' ? 'index.html' : 'control.html'
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
            browsers: browserslist
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
        '@components': resolve('src/components'),
        '@PluginInterface': resolve('../static/lib/PluginInterface.promise')
      },
      extensions: ['.js', '.vue', '.json']
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './src/config/config.xml'),
          to: path.resolve(
            __dirname,
            `./dist/plugins/Plugins/${process.env.VUE_APP_MID}/config.xml`
          ),
          transform(content, contentPath) {
            if (contentPath.indexOf('config.xml') !== -1) {
              let xml;
              const options = { explicitArray: false };
              xml2js.parseString(content.toString(), options, (err, result) => {
                const builder = new xml2js.Builder();
                const outPut = result;
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
          to: path.resolve(
            __dirname,
            `./dist/plugins/Plugins/${process.env.VUE_APP_MID}/js/`
          ),
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
        // eslint-disable-next-line no-param-reassign
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
    port: 8081,
    https: false,
    hotOnly: false,
    proxy: '',
    before: () => {},
    disableHostCheck: true
  },
  pluginOptions: {},
};
