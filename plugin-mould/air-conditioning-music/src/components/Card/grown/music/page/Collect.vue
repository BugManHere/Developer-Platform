<template>
  <gree-view bg-color="#ffffff">
    <gree-page class="page-music-collect no-navbar">
      <!-- 标题 -->
      <div class="page-header">
        <gree-header theme="#404657" :left-options="{ preventGoBack: true }" @on-click-back="goBack">
          <span v-text="'歌单集锦'" />
        </gree-header>
      </div>
      <!-- 内容 -->
      <div class="page-main">
        <div class="content-header">
          <span v-for="(name, index) in headerList" :key="index" v-text="name" />
        </div>
        <div class="content-body">
          <div class="content-card" v-for="(item, index) in playMap[1110]" :key="index">
            <img :src="item.pic" />
            <span v-text="item.playlistName" />
            <!-- <span v-text="item.playlistName.slice(0, 8)"/>
            <span v-text="item.playlistName.substr(8, 8).length > 7 ? `${item.playlistName.substr(8, 7)}...` : item.playlistName.substr(8, 8)"/> -->
          </div>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { mapState } from 'vuex';
import { Header } from 'gree-ui';
// import {
//   closePage,
//   // getMsg
// } from '@PluginInterface';

export default {
  components: {
    [Header.name]: Header
  },
  data() {
    return {
      headerList: ['最近播放', '睡眠音乐', '童趣故事', '国学课堂', '欢乐动画']
    };
  },
  computed: {
    ...mapState('control', {
      playMap: state => state.musicData.playMap
    })
  },
  mounted() {
    console.log(this.playMap);
  },
  methods: {
    /**
     * @description 返回键
     */
    goBack() {
      // closePage();
      this.$router.push('Home');
    }
  }
};
</script>

<style lang="scss">
.page-music-collect {
  background-image: linear-gradient(#ced2d5 0%, #f8f8f8 30%);
  position: relative;
  $headerHeight: 127px;
  .page-header {
    .gree-header {
      background-color: transparent !important;
    }
    height: $headerHeight;
  }
  .page-main {
    position: relative;
    top: 0;
    height: 100%;
    width: 100%;
    .content-header {
      position: relative;
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border: 0;
      margin-bottom: 20px;
      font-size: 44px;
    }
    .content-body {
      height: 100%;
      max-width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .content-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 33.3%;
        height: 450px;
        img {
          width: 300px;
          height: 300px;
          border-radius: 20px;
        }
        span {
          font-size: 36px;
          width: 91%;

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
}
</style>
