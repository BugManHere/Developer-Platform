<template>
  <gree-view class="page-view" style="background: #bbb">
    <!-- 标题 -->
    <div class="page-header">
      <gree-header>
        <span slot="overwrite-left" class="gree-icon icon-font icon-back back md" style="color: #fff" @click="goBack" />
        <span v-text="'歌单详情'" style="color: #fff" />
      </gree-header>
    </div>
    <!-- 卡片标题 -->
    <div class="list-title" v-text="`播放列表（共${listLen}首）`" v-show="cardHeaderShow" />
    <!-- 背景 -->
    <div class="page-bg">
      <img :src="listInfo.pic" />
    </div>
    <gree-page class="page-music-detail no-navbar" :style="cardHeaderShow ? { 'padding-top': `${titleHeight}px` } : {}">
      <!-- 内容 -->
      <div class="page-main">
        <!-- 简介 -->
        <div class="song-info">
          <img v-lazy="listInfo.pic" />
          <div class="info-text">
            <div id="intro">
              <span v-text="listInfo.playlistName" style="opacity: 0.95" />
              <span v-text="listInfo.intro" style="opacity: 0.7" />
            </div>
            <div v-text="'内容来源：酷狗音乐'" style="opacity: 0.7; margin-top: 10px" />
          </div>
        </div>
        <!-- 内容列表 -->
        <div class="list-title" v-text="`播放列表（共${listLen}首）`" :style="cardHeaderShow ? { height: 0, opacity: 0 } : {}" />
        <!-- v-show="!cardHeaderShow" -->
        <div class="song-list">
          <div v-for="(song, index) in currentPlaylist" :key="index" @click="goPlayPage(song.songId)">
            <div v-text="index + 1" id="index" />
            <div id="name">
              <span v-text="song.songName" />
              <span v-text="song.singerName" style="color: #777" />
            </div>
          </div>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Header } from 'gree-ui';

export default {
  components: {
    [Header.name]: Header
  },
  data() {
    return {
      img: '../../../../assets/img/music/logo.png',
      scrollTimer: null,
      scrollTimer2: null,
      cardHeaderShow: false,
      titleHeight: 0
    };
  },
  computed: {
    ...mapState({
      playlistId: state => state.musicData.playlistId,
      listInfo: state => state.musicData.listInfo,
      currentPlaylist: (state, getters) => getters.currentPlaylist
    }),
    listLen() {
      if (!this.currentPlaylist) return 0;
      return this.currentPlaylist.length;
    }
  },
  watch: {
    listLen: {
      handler(newVal) {
        if (!newVal) return;
        this.$nextTick(() => {
          this.titleHeight = document.getElementsByClassName('list-title')[1].offsetHeight;
          const dom = document.getElementsByClassName('page-content')[0];
          dom.addEventListener('scroll', this.getScroll);
          dom.addEventListener('touchmove', () => {
            clearTimeout(this.scrollTimer2);
            this.scrollTimer2 = setTimeout(() => {
              clearInterval(this.scrollTimer);
              this.scrollTimer = null;
            }, 1500);
            if (this.scrollTimer) return;
            this.scrollTimer = setInterval(() => {
              this.getScroll();
            }, 20);
          });
        });
      },
      immediate: true
    }
  },
  mounted() {
    const data = {
      header: {},
      payload: {
        clientIp: '116.6.120.23',
        page: 1,
        size: 50,
        playlistId: this.playlistId
      }
    };
    window.websock.onsend(JSON.stringify({ data, url: '/tme/playlist/song' }));
  },
  // 离开路由时清除定时器
  beforeRouteLeave(to, from, next) {
    clearInterval(this.scrollTimer);
    clearTimeout(this.scrollTimer2);
    this.scrollTimer = null;
    next();
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA'
    }),
    /**
     * @description 返回键
     */
    goBack() {
      this.$router.push('Home');
    },
    getScroll() {
      const dom = document.getElementsByClassName('page-content')[0];
      const currentScrollTop = dom.scrollTop;
      const imshowTop = document.getElementsByClassName('song-info')[0].offsetHeight;
      const distance = currentScrollTop - imshowTop;
      if (distance >= 2) {
        this.cardHeaderShow = true;
      } else {
        this.cardHeaderShow = false;
      }
      this.$forceUpdate();
    },
    goPlayPage(songId) {
      this.setMusicData({
        songId
      });
      this.$router.push('MusicPlay');
    }
  }
};
</script>

<style lang="scss" scoped>
$headerHeight: 127px;
$titleHeight: 120px;
.page-view {
  position: relative;
  .page-header {
    .gree-header {
      background-color: transparent !important;
      background-image: none;
    }
    height: $headerHeight;
  }
  .page-bg {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    img {
      opacity: 0.45;
      filter: blur(200px) brightness(120%);
      height: 100%;
      width: 100%;
    }
  }
}
.page-music-detail {
  position: absolute;
  top: $headerHeight;
  background-color: transparent;
  z-index: 1;
  .page-content {
    overflow: hidden;
  }
  .page-main {
    .song-info {
      position: relative;
      padding: 70px;
      padding-bottom: 50px;
      display: flex;
      justify-content: flex-start;
      color: #fff;
      img {
        min-height: 300px;
        min-width: 300px;
        max-height: 300px;
        max-width: 300px;
      }
      .info-text {
        padding-left: 50px;
        padding-right: 0px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 36px;
        #intro {
          // height: 155px;
          display: flex;
          flex-wrap: wrap;
          span {
            margin-bottom: 30px;
            line-height: 44px;

            text-overflow: -o-ellipsis-lastline;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            overflow: hidden;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
    .song-list {
      position: relative;
      background-color: #fefefe;
      min-height: calc(100vh - 144px - 420px - 120px);
      > div {
        width: 100%;
        height: 150px;
        display: flex;
        flex-wrap: nowrap;
        border-bottom: 1px solid #f5f5f5;
        #index {
          position: relative;
          width: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
        }
        #name {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
  }
}
.list-title {
  position: relative;
  background-color: #fefefe;
  z-index: 999;
  border-radius: 100px 100px 0 0;
  height: $titleHeight;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  font-size: 48px;
  padding-left: 60px;
}
</style>
