<template>
  <gree-view
    :bg-color="skinConfig && skinConfig.barColor"
    class="home-view"
    :style="{ 'background-size': `${bgWidth}px ${bgHeight}px`, 'background-color': skinConfig.bgColor, 'background-image': `url(${skinConfig.homeBg})` }"
  >
    <!-- 头部 -->
    <page-header :is-center-top="isCenterTop" />
    <!-- 主要内容 -->
    <gree-page no-navbar class="page-home">
      <!-- 内容 -->
      <div class="page-main" @touchend="getContentType(500)">
        <!-- 头部遮罩层  -->
        <!-- <div
          class="page-bg-mask"
          :style="{
            'background-size': `100% ${bgHeight}px`,
            'background-image': `url(${skinConfig.homeBg})`,
            height: `${headerHeight}px`
          }"
        /> -->
        <!-- 温度调节 -->
        <TemSetting />
        <!-- 卡片 -->
        <BottmCard />
      </div>
    </gree-page>
    <!-- 尾部 -->
    <BottomButton />
    <!-- 授权 -->
    <Authorize />
  </gree-view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { changeBarColor } from '@PluginInterface';
import BottomButton from '@/components/BottomButton';
import TemSetting from '@/components/TemSetting';
import Authorize from '@/components/Authorize';
import PageHeader from '@/components/PageHeader';
import BottmCard from '@/components/card/index';

export default {
  components: {
    [PageHeader.name]: PageHeader,
    BottmCard,
    TemSetting,
    Authorize,
    BottomButton
  },
  data() {
    return {
      isCenterTop: false,
      onTestFlag: 0,
      bgWidth: 0,
      bgHeight: 0,
      headerHeight: 0,
      contentScrollTop: 0
    };
  },
  computed: {
    ...mapState('control', {
      selectKey: state => state.selectKey
    }),
    ...mapGetters('control', ['skinConfig'])
  },
  activated() {
    try {
      const target = document.getElementsByClassName('page-content')[0];
      target.scrollTo(0, this.contentScrollTop);
    } catch (e) {
      e;
    }
  },
  beforeRouteLeave(to, from, next) {
    const target = document.getElementsByClassName('page-content')[0];
    const { scrollTop } = target;
    this.contentScrollTop = scrollTop;
    next();
  },
  mounted() {
    // 背景自适应
    this.bgWidth = document.body.clientWidth;
    this.bgHeight = this.bgWidth / 0.5625;
    // 获取卡片栏高度
    setTimeout(() => {
      this.headerHeight = document.getElementsByClassName('card-header-box')[0].clientHeight;
    }, 200);
  },
  watch: {
    skinConfig: {
      handler(newVal) {
        newVal && changeBarColor(newVal.barColor);
      },
      immediate: true
    },
    selectKey: {
      handler(newVal) {
        if (newVal) {
          this.isCenterTop = false;
          this.getContentType(0);
        }
      },
      immediate: true
    }
  },
  methods: {
    getContentType(delay = 500) {
      setTimeout(() => {
        const target = document.getElementsByClassName('page-content')[0];
        const minDistance = this.bgHeight / 50; // 容错距离
        const { scrollHeight, clientHeight, scrollTop } = target;
        if (Math.abs(scrollHeight - clientHeight - scrollTop) < minDistance) {
          this.isCenterTop = true;
        } else {
          this.isCenterTop = false;
        }
      }, delay);
    }
  }
};
</script>
