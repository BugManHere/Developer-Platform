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
    <div 
      v-else
      class="list-main">
      <gree-search-bar 
        :placeholder="reWord" 
        shape="round" 
        left-icon="" 
        right-icon="search"
        :class="{focus: searchBarOnFocus}"
        @focus="searchBarOnFocus = true"
        @blur="searchBarOnFocus = false"/>
      <div class="content" v-for="(category, typeIndex) in groupsUnfold" :key="typeIndex">
        <div class="content-header" @click="checkCollect">
          <span v-text="category.categoryName" />
          <span v-text="'更多'" />
        </div>
        <div class="content-body">
          <div class="content-card" v-for="index in 10" :key="index" @click="checkDetail(category.categoryId, index - 1)">
            <div v-if="playMap[category.categoryId]">
              <img v-lazy="playMap[category.categoryId][index - 1].pic">
              <span v-text="playMap[category.categoryId][index - 1].playlistName.substr(0, 8)"/>
              <span v-text="playMap[category.categoryId][index - 1].playlistName.substr(8, 8).length > 6 ? `${playMap[category.categoryId][index - 1].playlistName.substr(8, 7)}...` : playMap[category.categoryId][index - 1].playlistName.substr(8, 8)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, SearchBar, Icon } from 'gree-ui';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  components: {
    [Button.name]: Button,
    [SearchBar.name]: SearchBar,
    [Icon.name]: Icon,
  },
  props: {
    isTop: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isLogin: false,
      reWord: '贝瓦儿歌',
      searchBarOnFocus: false,
      isScrollTop: true,
      scrollTopNum: 0,
      scrollPercen: 10,
      hasRequestNum: 0,
    };
  },
  computed: {
    ...mapState({
      playMap: state => state.musicData.playMap,
      groupsUnfold: state => state.musicData.groupsUnfold,
      groups: state => state.musicData.groups,
    }),
    scrollRank() {
      if (document.getElementsByClassName('list-main')[0]) {
        const height = document.getElementsByClassName('list-main')[0].scrollHeight;
        return this.scrollTopNum / height;
      }
      return this.scrollTopNum * 0;
    }
  },
  watch: {
    isLogin: {
      handler(newVal) {
        if (newVal) {
          // 请求歌单分类
          this.postRequest('{"data":{"header":{},"payload":{"clientIp":"116.6.120.23"}},"url":"/tme/playlist/category"}');
        }
      },
      immediate: true
    },
    scrollRank: {
      handler(newVal) {
        if (newVal && newVal + 10 > this.scrollPercen) {
          const length = this.groupsUnfold.length;
          let nextRequestNum = Math.floor(length * (newVal * 100 + 10) / 100);
          if (nextRequestNum > this.hasRequestNum && this.hasRequestNum !== length) {
            if (nextRequestNum >= length) {
              for (let i = this.hasRequestNum; i < length; i += 1) {
                const category = this.groupsUnfold[i];
                const data = {
                  header: {},
                  payload: {
                    clientIp: '116.6.120.23',
                    page: 1,
                    size: 10,
                    categoryId: category.categoryId
                  }
                };
                const sendData = JSON.stringify({data, url: '/tme/playlist/awesome'});
                this.postRequest(sendData);
              }
            } else {
              for (let i = this.hasRequestNum; i < nextRequestNum; i += 1) {
                const category = this.groupsUnfold[i];
                const data = {
                  header: {},
                  payload: {
                    clientIp: '116.6.120.23',
                    page: 1,
                    size: 10,
                    categoryId: category.categoryId
                  }
                };
                const sendData = JSON.stringify({data, url: '/tme/playlist/awesome'});
                this.postRequest(sendData);
              }
            }
            this.hasRequestNum = nextRequestNum;
          }
        } else if (newVal === 0) {
          const timer = setInterval(() => {
            if (this.groupsUnfold.length) {
              for (let i = 0; i < 10; i += 1) {
                const category = this.groupsUnfold[i];
                const data = {
                  header: {},
                  payload: {
                    clientIp: '116.6.120.23',
                    page: 1,
                    size: 10,
                    categoryId: category.categoryId
                  }
                };
                const sendData = JSON.stringify({data, url: '/tme/playlist/awesome'});
                this.postRequest(sendData);
              }
              this.hasRequestNum = 10;
              clearInterval(timer);
            }
          }, 300);
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
      if (!this.playMap[key]) return;
      const listInfo = this.playMap[key][index];
      const playlistId = listInfo.playlistId;
      this.setMusicData({ playlistId });
      this.setMusicData({ listInfo });
      this.$router.push('MusicDetail');
    },
    postRequest(data) {
      const timer = setInterval(() => {
        try {
          window.websock.onsend(data);
          clearInterval(timer);
        } catch (e) {
          console.log('连接中');
          e;
        }
      }, 100);
    },
  },
};
</script>

<style lang="scss">
$mainHeight: calc(100vh - 142px - 120px - 669px - 190px);
.song-list {
  overflow: scroll;
  $fontSize: 44px;
  width: 100%;
  min-height: $mainHeight;
  height: 100%;
  // display: flex;
  // justify-content: center;
  // flex-wrap: wrap;
  .no-login {
    height: calc(100vh - 142px - 120px - 669px - 190px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: $mainHeight;
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
          // content: '更多';
          // padding-right: 40px;
        }
        &::before  {
          // font-family: Gree-UI-Icon!important;
          // content: '\E658';
          // position: absolute;
          // right: 40px;
          // transform: rotate(90deg);
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
