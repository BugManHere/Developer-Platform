<template>
  <gree-view
    :bg-color="skinConfig && skinConfig.barColor"
    class="home-view"
    :style="{ 'background-size': `${bgWidth}px ${bgHeight}px`, 'background-color': skinConfig.barColor, 'background-image': `url(${skinConfig.homeBg})` }"
  >
    <!-- 头部 -->
    <page-header :is-center-top="isCenterTop" />
    <gree-page no-navbar class="page-home">
      <!-- 主要内容 -->
      <div class="page-main" @touchend="getContentType">
        <!-- 温度调节 -->
        <TemSetting />
        <!-- 卡片 -->
        <GrownCard />
      </div>
    </gree-page>
    <!-- 尾部 -->
    <BottomButton />
    <!-- 授权 -->
    <Authorize />
  </gree-view>
</template>

<script>
import { mapState } from 'vuex';
import { changeBarColor } from '@PluginInterface';
import BottomButton from '@/components/BottomButton';
import TemSetting from '@/components/TemSetting';
import Authorize from '@/components/Authorize';
import PageHeader from '@/components/PageHeader';
import GrownCard from '@/components/card/index';
import LogicWatch from '@logic/watch';

export default {
  components: {
    [PageHeader.name]: PageHeader,
    GrownCard,
    TemSetting,
    Authorize,
    BottomButton
  },
  mixins: [LogicWatch],
  data() {
    return {
      isCenterTop: false,
      onTestFlag: 0,
      bgWidth: 0,
      bgHeight: 0
    };
  },
  computed: {
    ...mapState({
      skinConfig: (state, getters) => getters.skinConfig
    })
  },
  mounted() {
    // 背景自适应
    this.bgWidth = document.body.clientWidth;
    this.bgHeight = this.bgWidth / 0.5625;
  },
  watch: {
    skinConfig: {
      handler(newVal) {
        newVal && changeBarColor(newVal.barColor);
      },
      immediate: true
    }
  },

  methods: {
    getContentType() {
      setTimeout(() => {
        const target = document.getElementsByClassName('page-content')[0];
        const minDistance = this.bgHeight / 50; // 容错距离
        const { scrollHeight, clientHeight, scrollTop } = target;
        if (Math.abs(scrollHeight - clientHeight - scrollTop) < minDistance) {
          this.isCenterTop = true;
        } else {
          this.isCenterTop = false;
        }
      }, 500);
      //  else if (Math.abs(scrollHeight - clientHeight - scrollTop) < minDistance) {
      //   console.log('top');
      // }
    }
  }
};
</script>
