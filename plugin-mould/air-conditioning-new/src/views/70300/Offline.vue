<template>
  <gree-view>
    <gree-error-page type="offline" :bg-url="BgUrl" :img-url="offlineImgUrl" :text="$language('offline.prompt')" />
  </gree-view>
</template>

<script>
import { ErrorPage } from 'gree-ui';
import { mapState } from 'vuex';

export default {
  components: {
    [ErrorPage.name]: ErrorPage
  },
  data() {
    return {
      BgUrl: require('@/assets/img/bg_off.png'),
      offlineImgUrl: require('@/assets/img/offline.png')
    };
  },
  computed: {
    ...mapState({
      isOffline: state => state.deviceInfo.deviceState
    })
  },
  watch: {
    /**
     * @description 设备上线时返回主页
     */
    isOffline(newV) {
      if (newV === 2) {
        this.$router.push({ path: '/' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.gree-header {
  top: calc(0px + #{env(safe-area-inset-top)});
}
</style>
