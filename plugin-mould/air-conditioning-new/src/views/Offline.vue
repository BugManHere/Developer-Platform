<template>
  <offline-component :title="devname" />
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      devname: state => state.deviceInfo.name,
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
  },
  methods: {
    /**
     * @description 返回键
     */
    goBack() {
      closePage();
    }
  }
};
</script>
