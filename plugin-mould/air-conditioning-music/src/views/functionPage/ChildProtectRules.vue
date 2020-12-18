<template>
  <gree-view bg-color="#F4F4F4">
    <gree-page class="page-child-protect-rules">
      <!-- 标题栏 -->
      <gree-header theme="#000000" :left-options="{ preventGoBack: true }" :right-options="{ showMore: false }" @on-click-back="goBack"
        ><strong v-text="'隐私政策'" style="text-align:center;margin-bottom: 0px; margin-top: 20px; font-size: 20px; color: #000000"
      /></gree-header>
      <iframe class="page-rules-iframe" src="https://grih.gree.com/declaration/childProtectRules.html" frameborder="0" />
    </gree-page>
  </gree-view>
</template>

<script>
import { Header } from 'gree-ui';

export default {
  components: {
    [Header.name]: Header
  },
  data() {
    return {
      loading: true,
      html: ''
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
.page-child-protect-rules {
  .page-content {
    overflow: hidden;
    background-color: #f4f4f4;
  }
  .gree-header {
    height: $pageHeaderHeight;
  }
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .page-rules-iframe {
    width: 100%;
    height: calc(100vh - #{$pageHeaderHeight});
  }
}
</style>
