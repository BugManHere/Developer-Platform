<template>
  <gree-view :bg-color="barColor">
    <gree-page 
      class="page-offline" 
      no-navbar>
      <gree-header
        theme="transparent"
        :left-options="{preventGoBack: true}"
        @on-click-back="goBack"
        :right-options="{showMore: !state.functype && state.editEnable}"
        @on-click-more="moreInfo"
      >{{ state.deviceInfo.name }}</gree-header>
      <gree-error-page
        type="offline"
        :bg-url="HeaderImg"
        :img-url="offlineImgUrl"
        :text="$language('offline.prompt')"
      >
        <a
          href="javascript:;"
          class="link"
          @click="offlineDialog"
        >{{ $language('offline.detail') }}</a>
      </gree-error-page>
    </gree-page>
  </gree-view>
</template>

<script>
import { View, Header, Dialog, ErrorPage } from 'gree-ui';
import { mapState } from 'vuex';
import {
  closePage,
  editDevice,
  changeBarColor
} from '@PluginInterface';

export default {
  components: {
    [View.name]: View,
    [Header.name]: Header,
    [Dialog.name]: Dialog,
    [ErrorPage.name]: ErrorPage
  },
  data() {
    return {
      BgUrl: require('@/assets/img/bg_off.png'),
      offlineImgUrl: require('@/assets/img/offline.png'),
    };
  },
  computed: {
    ...mapState({
      state: state => state,
      isOffline: state => state.deviceInfo.deviceState,
      Mod: state => state.dataObject.Mod,
    }),
    barColor() {
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
      return require(`@/assets/img/blur_${
        this.state.dataObject.Mod === this.state.ModHeat ? 'heat' : 'cool'
      }.png`);
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
        title: '离线检查',
        content:
          '1.&ensp;空调是否连接电源？<br>2. 空调是否关闭了WiFi功能？按遥控器上的“WiFi”按键打开。<br>3. 拔掉电源插头再插上试试看。<br>4. 路由器名称和密码是否有变动，若有变动则需要重新添加设备。',
        confirmText: '取消'
      });
    }
  }
};
</script>
