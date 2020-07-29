<template>
  <gree-view bg-color="#ffffff">
    <gree-page class="page-music-detail no-navbar">
      <!-- 标题 -->
      <div class="page-header">
        <gree-header 
          theme="#404657"
          :left-options="{ preventGoBack: true }" 
          @on-click-back="goBack">
          <span v-text="'歌单详情'" />
        </gree-header>
      </div>
      <!-- 内容 -->
      <div class="page-main">
        <!-- 简介 -->
        <div class="song-info">
          <img :src="listInfo.pic">
          <div class="info-text">
            <div id="intro">
              <span v-text="listInfo.playlistName"/>
              <span v-text="listInfo.intro" style="color: #999"/>
            </div>
            <div v-text="'内容来源：酷狗音乐'" style="color: #999; margin-top: 20px"/>
          </div>
        </div>
        <!-- 内容列表 -->
        <div class="song-list">
          <div v-for="(song, index) in songsMap[playlistId]" :key="index">
            <div v-text="index + 1" id="index"/>
            <div id="name">
              <span v-text="song.songName"/>
              <span v-text="song.singerName" style="color: #999"/>
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
// import { 
//   closePage, 
//   // getMsg 
// } from '@PluginInterface';

export default {
  components: {
    [Header.name]: Header,
  },
  data() {
    return {
      listInfo: {},
      playlistId: ''
    };
  },
  computed: {
    ...mapState({
      playMap: state => state.musicData.playMap,
      songsMap: state => state.musicData.songsMap,
    }),
  },
  mounted() {
    const { key, index } = this.$router.currentRoute.params;
    this.listInfo = this.playMap[key][index];
    this.playlistId = this.listInfo.playlistId;
    // // eslint-disable-next-line
    // const res = require('@api/playlist/song');
    // this.songs = res.payload.data.songs;

    const data = {
      header: {},
      payload: {
        clientIp: '116.6.120.23',
        page: 1,
        size: 50,
        playlistId: this.playlistId
      }
    };
    window.websock.onsend(JSON.stringify({data, url: '/tme/playlist/song'}));
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA',
    }),
    /**
     * @description 返回键
     */
    goBack() {
      // closePage();
      this.$router.push('Home');
    },
  },
};
</script>

<style lang="scss">
.page-music-detail {
  position: relative;
  $headerHeight: 127px;
  .page-header {
    .gree-header {
      background-color: transparent !important;
    }
    height: $headerHeight;
  }
  .song-info {
    position: relative;
    padding: 70px;
    padding-bottom: 50px;
    display: flex;
    justify-content: flex-start;
    img {
      height: 300px;
      width: 300px;
    }
    .info-text {
      padding-left: 50px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 44px;
      #intro {
        // height: 155px;
        display: flex;
        flex-wrap: wrap;
        span {
          margin-bottom: 30px;
          line-height: 44px;

          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .song-list {
    background-color: #fff;
    overflow: hidden;
    > div {
      width: 100%;
      height: 150px;
      display: flex;
      flex-wrap: nowrap;
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
</style>
