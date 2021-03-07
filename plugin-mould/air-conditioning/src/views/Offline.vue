<template>
  <gree-view :bg-color="barColor">
    <gree-header theme="transparent" :left-options="{ preventGoBack: true }" @on-click-back="goBack">{{ state.deviceInfo.name }}</gree-header>
    <gree-error-page type="offline" :bg-url="HeaderImg" :img-url="offlineImgUrl" :text="$language('offline.prompt')">
      <a href="javascript:;" class="link" @click="offlineDialog">{{ $language('offline.detail') }}</a>
    </gree-error-page>
  </gree-view>
</template>

<script>
import { View, Header, Dialog, ErrorPage } from 'gree-ui';
import { mapState } from 'vuex';
import { closePage, editDevice, changeBarColor } from '@PluginInterface';
import LogicDefine from '@/logic/define';

export default {
  components: {
    [View.name]: View,
    [Header.name]: Header,
    [Dialog.name]: Dialog,
    [ErrorPage.name]: ErrorPage
  },
  mixins: [LogicDefine],
  data() {
    return {
      offlineImgUrl: require('@/assets/img/offline.png')
    };
  },
  computed: {
    ...mapState({
      state: state => state,
      isOffline: state => state.deviceInfo.deviceState,
      devOptions: state => state.devOptions,
      Mod: state => state.dataObject.Mod
    }),
    isB() {
      return ['10f04'].includes(this.devOptions.mid); // B分体特殊ui
    },
    barColor() {
      if (this.isB) {
        changeBarColor('#2BB2E3');
        return '#2BB2E3';
      }
      if (this.Mod === 4) {
        changeBarColor('#f78d00');
        return '#f78d00';
      }
      changeBarColor('#6ba0e2');
      return '#6ba0e2';
    },
    /**
     * @description 更新背景图片
     */
    HeaderImg() {
      if (this.isB) {
        return require('@/assets/img/mode/bg_b_off.png');
      }
      return require(`@/assets/img/bg_off_${this.state.dataObject.Mod === this.state.ModHeat ? 'heat' : 'cool'}.png`);
    }
  },
  watch: {
    /**
     * @description 设备上线时返回主页
     */
    isOffline(newVal) {
      newVal === 2 ? this.$router.replace({ path: '/' }) : '';
    }
  },
  methods: {
    /**
     * @description 返回键
     */
    goBack() {
      closePage();
    },
    /**
     * @description 编辑设备名称
     */
    moreInfo() {
      editDevice(this.mac);
    },
    /**
     * @description 离线检查Dialog
     */
    offlineDialog() {
      Dialog.alert({
        title: this.$language('offline.title'),
        content: this.$language('offline.content'),
        confirmText: this.$language('offline.confirmText')
      });
    }
  }
};
</script>
