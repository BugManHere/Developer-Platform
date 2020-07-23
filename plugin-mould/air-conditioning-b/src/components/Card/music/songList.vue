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
        <div class="content-header" v-text="'儿童'" @click="checkCollect"/>
        <div class="content-body">
          <div class="content-card" v-for="index in 10" :key="index" @click="checkDetail(key, index - 1)">
            <img :src="list[index - 1].pic">
            <span v-text="list[index - 1].playlistName.substr(0, 8)"/>
            <span v-text="list[index - 1].playlistName.substr(8, 8).length > 6 ? `${list[index - 1].playlistName.substr(8, 7)}...` : list[index - 1].playlistName.substr(8, 8)"/>
            <!-- <span v-text="list[index - 1].intro.length > 8 ? `${list[index - 1].intro.slice(0, 7)}...` : list[index - 1].intro"/> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, SearchBar, Icon } from 'gree-ui';
import { mapState ,mapActions, mapMutations } from 'vuex';

export default {
  components: {
    [Button.name]: Button,
    [SearchBar.name]: SearchBar,
    [Icon.name]: Icon,
  },
  props: {
    cardHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isLogin: true,
      reWord: '贝瓦儿歌',
      searchBarOnFocus: false,
      categoryList: [],
    };
  },
  computed: {
    ...mapState({
      playMap: state => state.musicData.playMap,
    }),
  },
  watch: {
    isLogin: {
      async handler(newVal) {
        if (newVal) {
          const category = await this.getCategory();
          this.categoryList = category.data.groups;
          const awesome = await this.getAwesome();
          const playMap = {
            1110: awesome.data.playlists
          }
          this.setMusicData({playMap});
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA',
    }),
    ...mapActions({
      getCategory: 'GET_CATEGORY',
      getAwesome: 'GET_AWESOME',
    }),
    checkCollect() {
      this.$router.push('MusicCollect');
    },
    checkDetail(key, index) {
      this.$router.push({
        name: 'MusicDetail',
        params: {
          key,
          index
        }
      });
    }
  },
};
</script>

<style lang="scss">
.song-list {
  overflow: scroll;
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
    height: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    overflow-y: scroll;
    overflow-x: hidden;
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
      $contentHeight: 520px;
      $contentHeaderHeight: 60px;
      $contentHeaderPadding: 20px;
      height: $contentHeight;
      width: 100%;
      border-bottom: 1px solid #f0f0f0;
      .content-header {
        padding: $contentHeaderPadding 35px;
        padding-bottom: 0;
        height: $contentHeaderHeight;
        font-size: $fontSize;
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        &::after {
          content: '更多';
          padding-right: 40px;
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
        $contentPaddingTop: 20px;
        padding-top: $contentPaddingTop;
        padding-left: $contentPaddingTop;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        height: $contentHeight - $contentHeaderHeight - $contentHeaderPadding - $contentPaddingTop;
        overflow-x: auto;
        overflow-y: hidden;
        .content-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 30%;
          padding-right: 45px;
          img {
            width: 300px;
            height: 300px;
            border-radius: 20px;
          }
          span {
            font-size: 36px;
            width: 100%;

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
}
</style>
