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
};
export default getters;
