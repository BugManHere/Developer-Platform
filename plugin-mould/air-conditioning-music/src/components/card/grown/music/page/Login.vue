<template>
  <div class="login-page">
    <div class="logo-list">
      <div v-for="(logoInfo, logoIndex) in logoList" :key="logoIndex" class="logo-list-box">
        <img :src="logoInfo.img" class="logo" />
        <div v-text="logoInfo.txt" class="name" />
      </div>
    </div>
    <div v-text="'登录后有更多精彩内容哦'" class="text" />
    <gree-button round v-text="'一键授权'" size="small" @click="goLoginPage" />
  </div>
</template>

<script>
import { toVoicePage } from '@PluginInterface';
import { Button } from 'gree-ui';
import { mapState } from 'vuex';

export default {
  components: {
    [Button.name]: Button
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('control', {
      mac: state => state.mac,
      authReasult: state => state.musicData.authReasult,
      authDialog: state => state.musicData.authDialog
    }),
    logoList() {
      const result = [];
      this.authReasult === 0 &&
        result.push({
          txt: '腾讯云小微',
          img: require('@assets/img/music/logo2.png')
        });
      this.authReasult < 2 &&
        result.push({
          txt: '酷狗音乐',
          img: require('@assets/img/music/logo1.png')
        });
      return result;
    }
  },
  methods: {
    goLoginPage() {
      toVoicePage(this.mac, 2);
    }
  }
};
</script>

<style lang="scss">
.login-page {
  $fontSize: 36px;
  $musicMainHeight: calc(100vh - #{$cardHeaderHeight} - #{$pageHeaderHeight} - #{$temEditHeight} - #{$footerHeight});
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: $musicMainHeight;
  min-height: $musicMainHeight;
  color: rgba(64, 70, 87, 1);
  .logo-list {
    width: 60%;
    display: flex;
    justify-content: space-around;
    .logo {
      height: 186px;
      width: 186px;
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
      font-size: $fontSize;
      text-align: center;
      padding-bottom: 100px;
    }
  }
  .gree-button {
    position: relative;
    top: 40px;
    background: #0099ff;
    color: #fff;
    width: 60%;
    height: 147px;
    margin-bottom: 80px;
    font-size: 50px;
  }
}
</style>
