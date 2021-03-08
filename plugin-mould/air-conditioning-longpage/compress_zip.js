/**
 * @description 用于生成插件zip压缩包，上传到服务器后台
 * @author IOTFE
 */

var fs = require('fs');
const compressing = require('compressing');
const { key } = require('./plugin.id.json');
const { productModel } = require(`../../output/${key}.json`);

// 插件 mid
var VUE_APP_MID = productModel;

// base 路径
var BASE_PATH = './dist/plugins/Plugins';

// cordova static 路径
var STATIC_DIR = `${BASE_PATH}/${VUE_APP_MID}/static`;
// 插件路径
var APP_MID_DIR = `${BASE_PATH}/${VUE_APP_MID}/`;

// 需要移除的文件路径
var REMOVE_DIR_PATH_LIST = [`${STATIC_DIR}/font`, `${STATIC_DIR}/lib`, `${STATIC_DIR}/plugin`];

// 需要移除的文件
var REMOVE_FILE_LIST = [
  '.git',
  '.eslintrc.js',
  '.gitignore',
  'global.d.ts',
  'globle.d.ts', // 历史遗留 文件名称 问题
  'package-lock.json',
  'package.json',
  'README.md'
];

/**
 * 删除 cordova 文件
 * @param {String} path 需要删除的路径
 */
function deleteAll(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).map(file => {
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteAll(curPath);
      } else {
        fs.unlinkSync(curPath); // delete file
      }
    });
    fs.rmdirSync(path);
  }
}

/**
 * 删除 cordova 文件
 * @param {String} path 需要删除的路径
 */
function deleteAllFile(path, removeFileList = REMOVE_FILE_LIST) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).map(file => {
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isFile() && removeFileList.includes(file)) {
        fs.unlinkSync(curPath); // delete file
      }
    });
    fs.rmdirSync(path);
  }
}

// 删除 cordova api 的文件夹
REMOVE_DIR_PATH_LIST.forEach(dirPath => {
  deleteAll(dirPath);
});

// 删除 static 下 cordova api 的文件
deleteAllFile(STATIC_DIR);

// 压缩需要上传服务器的zip文件格式
compressing.zip
  .compressDir(APP_MID_DIR, `${BASE_PATH}/${VUE_APP_MID}.zip`, { ignoreBase: true })
  .then(() => {
    console.log(`成功压缩 ${BASE_PATH}/${VUE_APP_MID}.zip`);
  })
  .catch(err => {
    console.error(err);
  });
