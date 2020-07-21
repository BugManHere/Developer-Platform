<template>
  <div class="song-list">
    <!-- 没登录的时候显示 -->
    <div v-if="!isLogin" class="no-login">
      <img src="@assets/img/music/logo.png" class="logo">
      <div v-text="'酷狗音乐'" class="name"/>
      <div v-text="'登录后，可畅享千万正版曲库'" class="text"/>
      <gree-button 
        round 
        v-text="'立即登录'" 
        size="small"
      />
    </div>
    <!-- 已登录显示 -->
    <div v-else class="list-main">
      <gree-search-bar 
        :placeholder="reWord" 
        shape="round" 
        left-icon="" 
        right-icon="search"
        :class="{focus: searchBarOnFocus}"
        @focus="searchBarOnFocus = true"
        @blur="searchBarOnFocus = false"/>
      <div class="content" v-for="(list, key) in playMap" :key="key">
        <div class="content-header" v-text="'儿童'"/>
        <div class="content-body">
          <div class="content-card" v-for="index in 3" :key="index">
            <img src="@assets/img/music/test1.jpg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, SearchBar, Icon } from 'gree-ui';
import { mapActions } from 'vuex';

export default {
  components: {
    [Button.name]: Button,
    [SearchBar.name]: SearchBar,
    [Icon.name]: Icon,
  },
  data() {
    return {
      isLogin: true,
      reWord: '贝瓦儿歌',
      searchBarOnFocus: false,
      categoryList: [],
      playMap: {}
    };
  },
  watch: {
    isLogin: {
      async handler(newVal) {
        if (newVal) {
          const category = await this.getCategory();
          this.categoryList = category.data.groups;
          const awesome = await this.getAwesome();
          this.$set(this.playMap, 1110, awesome.data.playlists)
          console.log(this.categoryList);
          console.log(this.playMap);
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      getCategory: 'GET_CATEGORY',
      getAwesome: 'GET_AWESOME',
    }),
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
    flex-wrap: wrap;
    .gree-search-bar {
      width: 90%;
      .gree-search-bar__content {
        border: 1px solid #ccc;
      }
      &.focus {
        .gree-search-bar__content {
          border: 1px solid #878787;
        }
      }
    }
    .content {
      $contentHeight: 500px;
      $contentHeaderHeight: 60px;
      $contentHeaderPadding: 20px;
      height: $contentHeight;
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
      .content-header {
        padding: $contentHeaderPadding;
        padding-bottom: 0;
        height: $contentHeaderHeight;
        font-size: 20px;
        display: flex;
        justify-content: space-between;
        &::after {
          content: '更多';
          padding-right: 30px;
        }
        &::before  {
          font-family: Gree-UI-Icon!important;
          content: '\E658';
          position: absolute;
          right: 40px;
          transform: rotate(90deg);
        }
      }
      .content-body {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
        height: $contentHeight - $contentHeaderHeight - $contentHeaderPadding;
        .content-card {
          display: flex;
          justify-content: center;
          width: 33%;
          img {
            width: 300px;
            height: 300px;
          }
        }
      }
    }
  }
}
</style>
