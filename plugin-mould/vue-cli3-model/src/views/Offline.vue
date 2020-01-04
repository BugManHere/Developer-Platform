<!--
 * @Author: Jerry-Rain
 * @Date: 2019-08-09 14:43:49
 * @LastEditors: Jerry-Rain
 * @LastEditTime: 2019-10-08 15:43:34
 * @Description: 
 -->
<template>
  <gree-view>
    <gree-header
      theme="transparent"
      :left-options="{preventGoBack: true}"
      :right-options="{showMore: true}"
      @on-click-back="goBack"
      @on-click-more="moreInfo"
    >{{ devname }}</gree-header>
    <gree-error-page type="offline" :bg-url="BgUrl" :img-url="offlineImgUrl"></gree-error-page>
    <div class="tipList">
      <ol>
        <li>{{$language('offline.prompt1')}}</li>
        <li>{{$language('offline.prompt2')}}</li>
        <li>{{$language('offline.prompt3')}}</li>
        <li>{{$language('offline.prompt4')}}</li>
      </ol>
    </div>
  </gree-view>
</template>

<script>
import { ErrorPage, Header } from "gree-ui";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  components: {
    [ErrorPage.name]: ErrorPage,
    [Header.name]: Header
  },
  data() {
    return {
      BgUrl: require("@/assets/img/bg_off.png"),
      offlineImgUrl: require("@/assets/img/offline.png")
    };
  },
  computed: {
    ...mapState({
      devname: state => state.deviceInfo.name,
      mac: state => state.mac
    })
  },
  watch: {
    /**
     * @description 设备上线时返回主页
     */
    isOffline(newV) {
      if (newV === 2) {
        this.$router.push({ path: "/" });
      }
    }
  },
  methods: {
    goBack() {
      closePage();
    },
    moreInfo() {
      editDevice(this.mac);
    }
  }
};
</script>

<style lang="scss" scoped>

.tipList {
  position: absolute;
  top: 1000px;
  z-index: inherit;
  
}
<style>
