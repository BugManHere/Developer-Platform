<template>
  <div>
    <gree-overlay :absolute="true" v-show="authDialog === 1" z-index="1000" />
    <div class="login-dialog" v-show="authDialog === 1">
      <div class="login-dialog-box">
        <div v-text="'智慧鸟需要您的云小微和酷狗账号授权，才能给您带来更丰富的内容'" class="login-dialog-box-msg" />
        <div v-text="'跳过，暂不授权 >'" class="login-dialog-box-cancel" @click="authCancel" />
        <gree-button round v-text="'去授权'" size="small" class="login-dialog-box-confirm" @click="authConfirm" />
      </div>
    </div>
  </div>
</template>

<script>
import { Overlay, Button } from 'gree-ui';
import { mapState, mapMutations } from 'vuex';
import {
  toVoicePage
  // getMsg
} from '@PluginInterface';
export default {
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay
  },
  computed: {
    ...mapState('control', {
      authDialog: state => state.musicData.authDialog
    })
  },
  methods: {
    ...mapMutations('control', {
      setMusicData: 'SET_MUSIC_DATA'
    }),
    authCancel() {
      this.setMusicData({ authDialog: 0 });
    },
    authConfirm() {
      this.setMusicData({ authDialog: 0 });
      toVoicePage(this.mac, 2);
    }
  }
};
</script>

<style lang="scss">
.login-dialog {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  &-box {
    z-index: 1001;
    height: 771px;
    width: 861px;
    background-image: url('../assets/img/music/dialog.png');
    background-size: 100% 100%;
    text-align: center;
    &-msg {
      padding: 339px 108px 0 108px;
      font-size: 38px;
      color: #000;
      line-height: 60px;
    }
    &-cancel {
      font-size: 34px;
      color: rgba(116, 116, 116, 1);
      padding-top: 80px;
    }
    &-confirm {
      margin-top: 42px;
      width: 585px;
      font-size: 38px;
      color: #fff;
      background-color: rgba(0, 174, 255, 1);
    }
  }
}
</style>
