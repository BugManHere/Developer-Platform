<template>
  <div class="song-list">
    <!-- 没登录的时候显示 -->
    <div v-if="!isLogin" class="no-login">
      <img src="@assets/img/music/logo.png" class="logo">
      <div v-text="'酷狗音乐'" class="name"/>
      <div v-text="'登录后，可畅享千万正版曲库'" class="text"/>
      <gree-button round v-text="'立即登录'" size="small"/>
    </div>
    <!-- 已登录显示 -->
    <div v-else class="list-main">
      <gree-search-bar 
        :placeholder="reWord" 
        shape="round" 
        left-icon="" 
        right-icon="search"/>
    </div>
  </div>
</template>

<script>
import { Button, SearchBar } from 'gree-ui';

export default {
  components: {
    [Button.name]: Button,
    [SearchBar.name]: SearchBar,
  },
  data() {
    return {
      isLogin: true,
      reWord: '贝瓦儿歌',
    }
  },
};
</script>

<style lang="scss">
.song-list {
  $fontSize: 44px;
  width: 100%;
  height: 100%;
  // display: flex;
  // justify-content: center;
  // flex-wrap: wrap;
  .no-login {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .logo {
      height: 250px;
      width: 250px;
      padding-bottom: 30px;
    }
    .name {
      width: 100%;
      font-size: $fontSize;
      text-align: center;
      padding-bottom: 130px;
    }
    .text {
      width: 100%;
      font-size: 52px;
      text-align: center;
      padding-bottom: 100px;
    }
    .gree-button {
      position: relative;
      bottom: 0;
      background: #0099FF;
      color: #fff;
      width: 60%;
      height: 120px;
      margin-bottom: 80px;
    }
  }
  .list-main {
    display: flex;
    justify-content: center;
    .gree-search-bar {
      width: 90%;
      .gree-search-bar__content {
        border: 1px solid transparent;
        // border: 1px solid #878787;
      }
    }
  }
}
</style>