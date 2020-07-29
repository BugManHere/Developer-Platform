<template>
  <div
    class="card-music"
    :style="{transform: `translate(0, ${headerHeight - headerMoveCurrent - headerMoveLast}px)`}"
    @touchstart="startDrag"
    @touchmove="dragCard"
    @touchend="endDrag"
  >
    <!-- 标题 -->
    <div 
      class="music-header"
    >
      <!-- 左边文字 -->
      <div class="left">
        <div v-text="'点播'" @click="imshowType = 0" :class="{select: imshowType === 0}"/>
        <div v-text="'技能'" @click="imshowType = 1" :class="{select: imshowType === 1}"/>
      </div>
      <!-- 右边按钮 -->
      <div class="right">
        <img src="@assets/img/music/statistical.png" >
        <img src="@assets/img/music/history.png" >
      </div>
    </div>
    <!-- 内容 -->
    <div class="music-main" style="{height: `100%`}">
      <keep-alive>
        <component :is="['songList', 'voiceSkill'][imshowType]" :is-top="isTop" @isScrollTop="getSrollType"/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import songList from './songList';
import voiceSkill from './voiceSkill';

export default {
  components: {
    songList,
    voiceSkill,
  },
  data() {
    return {
      imshowType: 0, // 0：点播, 1：技能
      headerPos: 0,
      headerMoveLast: 0,
      headerMoveCurrent: 0,
      baseHeight: 0,
      isTop: false,
      isScrollTop: true,
    };
  },
  computed: {
    ...mapState({
      playMap: state => state.musicData.playMap,
    }),
    // 可拉伸高度
    headerHeight() {
      return (1800 - 1251) / 1920 * document.documentElement.clientHeight;
    },
  },
  created() {
  },
  destroyed() {
    // 离开路由之后断开websocket连接
    this.websock.close();
  },
  mounted() {
    this.initWebSocket();

    this.baseHeight = document.documentElement.clientHeight / 1920 * 1251;

    document.getElementsByClassName('list-main')[0].addEventListener('touchmove', e => {
        if (this.isScrollTop && !this.isTop) {
          this.$nextTick(() => {
            e.preventDefault();
          });
        }
    }, {passive: false});
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA',
    }),
    // 记录开始点击的位置
    startDrag(e) {
      if (!this.isScrollTop) return;
      this.headerPos = e.changedTouches[0].pageY;
    },
    // 拖动结束时记录拖动长度
    endDrag() {
      this.headerMoveLast += this.headerMoveCurrent;
      this.headerMoveCurrent = 0;
      this.headerPos = 0;
    },
    // 拖动函数
    dragCard(e) {
      if (!this.isScrollTop) return;
      this.headerPos || (this.headerPos = e.changedTouches[0].pageY);
      let moveY = this.headerPos - e.changedTouches[0].pageY; // 计算Y轴拖动距离
      // 拖动计算
      if (this.headerHeight - moveY - this.headerMoveLast <= 0) { // 到顶部
        this.headerMoveCurrent = this.headerHeight - this.headerMoveLast;
        this.isTop = true;
      } else if (moveY + this.headerMoveLast <= 0) { // 到底部
        this.headerMoveCurrent = -this.headerMoveLast;
        this.isTop = false;
      } else {
        this.headerMoveCurrent = moveY;
        this.isTop = false;
      }
    },
    // 初始化weosocket
    initWebSocket() {
      const wsuri = 'ws://192.168.31.94:9999';
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
      this.websock.onsend = this.websocketsend;
      window.websock = this.websock;
    },
    // 连接建立之后执行send方法发送数据
    websocketonopen() { 
    },
    // 连接建立失败重连
    websocketonerror() {
      console.log('------------websocket重连中---------------');
      this.initWebSocket();
    },
    // 数据接收
    websocketonmessage(e) {
      const res = JSON.parse(e.data);
      const data = JSON.parse(res.data);
      const params = res.params;
      const postUrl = res.postUrl;
      const { playlistId, categoryId } = params.data.payload;

      switch (postUrl) {
        // 请求类别
        case '/tme/playlist/category':
          const imshowTypeList = [];
          data.payload.data.groups.forEach(group => {
            imshowTypeList.push(...group.categories);
          });
          this.setMusicData({ imshowTypeList });
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
        // 请求歌单下的歌曲
        case '/tme/playlist/song':
          this.setMusicData({
            songsMap: {
              [playlistId]: data.payload.data.songs
            }
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
      sendData = `@$_$${(sendData.length).toString().padStart(8, 0)}${sendData}`;
      this.websock.send(sendData);
    },
    // 断开连接
    websocketclose(e) {
      console.log('断开连接', e);
    },
    getSrollType(type) {
      this.isScrollTop = type;
    }
  },
};
</script>

<style lang="scss">
.card-music {
  position: absolute;
  bottom: 0;
  $headerHeight: 142px; 
  $mainHeight: calc(100vh - 142px - 120px);
  $fontSize: 44px;
  width: 100%;
  background: #fff;
  border-radius: 100px;
  .music-header {
    position: relative;
    border-bottom: 1px solid #F2F2F2;
    height: $headerHeight;
    display: flex;
    justify-content: space-between;
    .left {
      position: relative;
      padding: 62px 0 0 12px;
      font-size: $fontSize;
      width: 380px;
      display: flex;
      justify-content: space-around;
      div {
        width: 200px;
        display: flex;
        justify-content: center;
      }
      .select {
        color: rgb(0, 153, 255);
        border-bottom: 6px solid rgb(0, 153, 255);
      }
    }
    .right {
      position: relative;
      padding-top: 62px;
      width: 380px;
      display: flex;
      justify-content: flex-end;
      img {
        width: 60px;
        height: 54px;
        padding-right: 70px;
      }
    }
  }
  .music-main {
    position: relative;
    height: $mainHeight;
  }
  // ::-webkit-scrollbar {
  //   display: none;
  // }
}

</style>
