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
        <div class="song-info">
          <img :src="listInfo.pic">
          <div class="info-title" v-text="listInfo.playlistName"/>
          <div />
        </div>
      </div>
      <!-- 内容 -->
      <div class="page-main">
        
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
    [Header.name]: Header,
  },
  data() {
    return {
      listInfo: {},
      detailList: []
    };
  },
  computed: {
    ...mapState({
      playMap: state => state.musicData.playMap,
    }),
  },
  mounted() {
    const { key, index } = this.$router.currentRoute.params;
    this.listInfo = this.playMap[key][index];
  },
  methods: {
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

}
</style>
