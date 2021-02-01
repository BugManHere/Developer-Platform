<template>
  <div class="grown-card">
    <!-- 头部 -->
    <GrownHeader />
    <!-- 头部遮罩层  -->
    <template class="mask">
      <slot name="mask" />
    </template>
    <!-- 内容 -->
    <keep-alive>
      <component :is="['MusicContent', 'SkillContent'][imshowType]" />
    </keep-alive>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import GrownHeader from '@/components/card/grown/Header';
import MusicContent from './music/index';
import SkillContent from './skills/index';

export default {
  name: 'grown-card',
  components: {
    GrownHeader,
    MusicContent,
    SkillContent
  },
  computed: {
    ...mapState('control', {
      selectKey: state => state.selectKey,
      imshowType: state => state.musicData.imshowType,
      playMap: state => state.musicData.playMap,
      listSongsMap: state => state.musicData.listSongsMap,
      songInfosMap: state => state.musicData.songInfosMap,
      lyricMap: state => state.musicData.lyricMap
    })
  },
  destroyed() {
    // 离开路由之后断开websocket连接
    this.websock.close();
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {
    ...mapMutations('control', {
      setMusicData: 'SET_MUSIC_DATA'
    }),
    // 初始化weosocket
    initWebSocket() {
      // const wsuri = 'ws://192.168.31.94:9999';
      // this.websock = new WebSocket(wsuri);
      // this.websock.onmessage = this.websocketonmessage;
      // this.websock.onopen = this.websocketonopen;
      // this.websock.onerror = this.websocketonerror;
      // this.websock.onclose = this.websocketclose;
      // this.websock.onsend = this.websocketsend;
      // window.websock = this.websock;
    },
    // 连接建立之后执行send方法发送数据
    websocketonopen() {},
    // 连接建立失败重连
    websocketonerror() {
      console.log('------------websocket重连中---------------');
      // this.initWebSocket();
    },
    // 数据接收
    websocketonmessage(e) {
      const res = JSON.parse(e.data);
      const data = JSON.parse(res.data);
      const params = res.params;
      const postUrl = res.postUrl;
      const payload = params.data.payload;
      const { playlistId, categoryId, songsId, songId } = payload;
      const groupsUnfold = [];
      const songInfosMap = {};

      switch (postUrl) {
        // 请求类别
        case '/tme/playlist/category':
          data.payload.data.groups.forEach(group => {
            groupsUnfold.push(...group.categories);
          });
          groupsUnfold.unshift({
            categoryId: '1110',
            categoryName: '儿童'
          });
          this.setMusicData({ groupsUnfold });
          this.setMusicData({ groups: data.payload.data.groups });
          break;
        // 请求类别下的歌单
        case '/tme/playlist/awesome':
          this.setMusicData({
            playMap: {
              [categoryId]: data.payload.data.playlists,
              ...this.playMap
            }
          });
          break;
        // 歌单下的歌曲
        case '/tme/playlist/song':
          this.setMusicData({
            listSongsMap: {
              [playlistId]: data.payload.data.songs,
              ...this.listSongsMap
            }
          });
          break;
        // 批量请求歌曲信息
        case '/tme/song/infos':
          songsId.forEach((songId, index) => {
            songInfosMap[songId] = data.payload.data.songs[index];
          });
          this.setMusicData({
            songInfosMap: {
              ...songInfosMap,
              ...this.songInfosMap
            }
          });
          break;
        // 歌词
        case '/tme/song/lyric':
          this.setMusicData({
            lyricMap: {
              [songId]: data.payload.data.lyric,
              ...this.lyricMap
            }
          });
          break;
        // 歌曲资源
        case '/tme/song/url':
          this.setMusicData({
            songUrl: data.payload.data
          });
          break;
        default:
          console.log('---------url错误--------');
          console.log(res.postUrl);
          break;
      }
    },
    // 发送数据
    websocketsend(data) {
      // 发送数据格式： @$_${len}{data}#$_$
      let sendData = `${data}#$_$`;
      sendData = `@$_$${sendData.length.toString().padStart(8, 0)}${sendData}`;
      this.websock.send(sendData);
    },
    // 断开连接
    websocketclose(e) {
      console.log('断开连接', e);
    },
    getSrollType(type) {
      this.isScrollTop = type;
    }
  }
};
</script>
