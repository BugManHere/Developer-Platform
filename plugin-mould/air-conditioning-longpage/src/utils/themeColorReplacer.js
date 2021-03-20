const client = require('webpack-theme-color-replacer/client');
const forElementUI = require('webpack-theme-color-replacer/forElementUI');

const btnColor = {
  cold: ['#8dbffd', '#77a7e0', '14, 110, 227'],
  warm: ['#fcc0a2', '#ff9f70', '246, 137, 8']
};

const sliderColor = {
  cold: ['#6ca1e2', '#4a91e8', '#9ec9fc'],
  warm: ['#fe9971', '#ffac83', '#fcd1bc']
};

const powBtnColor = {
  cold: ['#969cd9', '#7abdf1'],
  warm: ['#fe8a71', '#fcb392']
};

const iconColor = {
  cold: ['#6ba4fa'],
  warm: ['#f7a436']
};

const cardIconColor = {
  cold: ['#7fb5f6', '#6da4e6'],
  warm: ['#fcb28d', '#ffac83']
};

const switchColor = {
  cold: ['#619ce7'],
  warm: ['#ffac83']
};

const coldColors = getColors('cold');
const warmColors = getColors('warm');

function getColors(type) {
  const colorsList = [btnColor, powBtnColor, iconColor, sliderColor, cardIconColor, switchColor];
  const result = [];
  colorsList.forEach(colors => {
    result.push(...colors[type]);
  });
  return result;
}

// 动态切换主题色
function changeThemeColor(newColors) {
  const colors = getElementUISeries(newColors);
  var options = { newColors: colors };
  return client.changer.changeColor(options, Promise);
}

function getElementUISeries(colors) {
  const matchColersArray = [];
  colors.forEach(color => {
    matchColersArray.push(...forElementUI.getElementUISeries(color));
  });
  return matchColersArray;
}

module.exports = {
  matchColors: getElementUISeries(coldColors),
  coldColors,
  warmColors,
  changeThemeColor,
  getElementUISeries
};
