<template>
  <gree-view bg-color="#F4F4F4">
    <gree-page class="page-offline">
      <gree-header :left-options="{ preventGoBack: true }" @on-click-back="goBack">{{ $language('name') }}</gree-header>
      <div class="page-main">
        <!-- 图片 -->
        <div class="page-main-img">
          <img src="@assets/img/offllne_tip.png" />
        </div>
        <!-- 文字1 -->
        <div class="page-main-txt" v-text="$language('offline.txt')" />
        <!-- 文字2 -->
        <div class="page-main-tip" v-html="$language('offline.tip')" />
        <!-- 文字3 -->
        <!--  <div class="page-main-bottom" v-text="$language('offline.bottom')" /> -->
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { mapState } from 'vuex';
import { closePage, startCatalogConfigActivity } from '@PluginInterface';
import { Header, Toast, Radio, RadioList, Switch, List, Item } from 'gree-ui';

export default {
  components: {
    [Header.name]: Header,
    [Radio.name]: Radio,
    [RadioList.name]: RadioList,
    [Switch.name]: Switch,
    [List.name]: List,
    [Item.name]: Item,
    [Toast.name]: Toast
  },
  data() {
    return {};
  },
  mounted() {
    const span = document.getElementById('btn');
    span.addEventListener('click', () => {
      startCatalogConfigActivity();
    });
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

<style lang="scss">
.page-offline {
  .gree-header {
    &-left {
      height: 100%;
      display: flex !important;
      align-items: center !important;
    }
  }
  .page-main {
    position: relative;
    top: 0;
    height: 100%;
    width: 100%;
    &-img {
      position: relative;
      margin-top: 210px;
      width: 100%;
      height: 543px;
      display: flex;
      justify-content: center;
      img {
        height: 100%;
        width: 867px;
      }
    }
    &-txt {
      position: relative;
      width: 100%;
      margin-top: 45px;
      text-align: center;
      font-size: 36px;
      color: rgba(152, 152, 152, 1);
    }
    &-tip {
      position: relative;
      width: 100%;
      margin-top: 170px;
      margin-left: 132px;
      font-size: 36px;
      letter-spacing: 0.5px;
      line-height: 60px;
      color: rgba(152, 152, 152, 1);
      span {
        color: rgba(97, 156, 231, 1);
        border-bottom: 1px solid rgba(97, 156, 231, 1);
      }
    }
    &-bottom {
      position: relative;
      width: 100%;
      font-size: 36px;
      text-align: center;
      margin-top: 240px;
      color: rgba(64, 70, 87, 1);
    }
  }
}
</style>
