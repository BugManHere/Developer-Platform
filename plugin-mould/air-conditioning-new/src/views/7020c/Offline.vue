<template>
  <gree-view>
    <gree-header
      theme="transparent"
      :left-options="{preventGoBack: true}"
      @on-click-back="goBack"
    >{{ devname }}</gree-header>
    <gree-error-page
      class="optrel"
      type="offline"
      :bg-url="BgUrl"
      :img-url="offlineImgUrl"
      text="连接已断开，"
    >
      <a
        href="javascript:;"
        class="link"
        @click="offlineDialog"
      >查看详情</a>
    </gree-error-page>
  </gree-view>
</template>

<script>
import { Header, ErrorPage, Dialog } from 'gree-ui';
import { mapState } from 'vuex';
import { closePage } from '../../../../static/lib/PluginInterface.promise';

export default {
  components: {
    [Header.name]: Header,
    [ErrorPage.name]: ErrorPage
  },
  data() {
    return {
      BgUrl: require('@/assets/img/bg_off.png'),
      offlineImgUrl: require('@/assets/img/offline_optrel.png')
    };
  },
  computed: {
    ...mapState({
      devname: state => state.deviceInfo.name,
      isOffline: state => state.dataObject.OnLine
    })
  },
  watch: {
    /**
     * @description 设备上线时返回主页
     */
    isOffline(newV) {
      if (newV === 'online') {
        this.$router.push({ path: '/' });
      }
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
     * @description 离线检查Dialog
     */
    offlineDialog() {
      Dialog.alert({
        title: '离线检查',
        content: `1.${this.devname}是否连接上电源？<br>2.拔掉电源插头再插上试试看。<br>3.路由器名称和密码是否有变动，若有变动则需要重新添加设备。`,
        confirmText: '取消'
      });
    }
  }
};
</script>
