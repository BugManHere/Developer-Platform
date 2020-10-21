const { skinsConfig } = require('@/mixins/config/skins');

const getters = {
  // 歌词
  lyric: state => {
    if (!state.musicData.lyricMap) return '';
    return state.musicData.lyricMap[state.musicData.songId] || '';
  },
  currentPlaylist: state => {
    if (!state.musicData.listSongsMap) return [];
    return state.musicData.listSongsMap[state.musicData.playlistId] || [];
  },
  // 当前歌曲
  currentSongInfo: state => {
    if (!state.musicData.songInfosMap) return {};
    return state.musicData.songInfosMap[state.musicData.songId] || {};
  },
  // 当前皮肤
  skinConfig: state => {
    const index = state.skinIndex;
    const result = skinsConfig[index];
    return {
      ...result,
      homeBg: require(`@assets/img/skins/${state.skinIndex}/bg.png`),
      bottomBg: require(`@assets/img/skins/${state.skinIndex}/bg_bottom.png`),
      bottomBtnList: [
        {
          url: require(`@assets/img/skins/${state.skinIndex}/grown.png`),
          name: '智慧成长',
          key: 'GrownCard'
        },
        {
          url: require(`@assets/img/skins/${state.skinIndex}/control.png`),
          name: '空调控制',
          key: 'ControlCard'
        },
        {
          url: require(`@assets/img/skins/${state.skinIndex}/sleep.png`),
          name: '健康睡眠',
          key: 'SleepCard'
        }
      ]
    };
  }
};
export default getters;
