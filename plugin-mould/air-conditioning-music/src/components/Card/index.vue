<template>
  <div class="card-view">
    <div class="card-body">
      <!-- 内容 -->
      <div class="card-main">
        <keep-alive>
          <component :is="selectKey" class="card-main-component" ref="card-main-component">
            <template v-slot:mask>
              <!-- 头部遮罩层  -->
              <div
                class="page-bg-mask"
                :style="{
                  'background-size': `100% ${bgHeight}px`,
                  'background-image': `url(${skinConfig.homeBg})`,
                  height: `${headerHeight}px`
                }"
              />
            </template>
          </component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import GrownCard from './grown/index';
import ControlCard from './control/index';
import SleepCard from './sleep/index';
import { mapGetters } from 'vuex';

export default {
  components: {
    [GrownCard.name]: GrownCard,
    [ControlCard.name]: ControlCard,
    [SleepCard.name]: SleepCard
  },
  data() {
    return {
      bgHeight: 0,
      headerHeight: 0
    };
  },
  computed: {
    ...mapState('control', {
      selectKey: state => state.selectKey
    }),
    ...mapGetters('control', ['skinConfig'])
  },
  mounted() {
    // 背景自适应
    this.bgHeight = document.body.clientWidth / 0.5625;
    // 获取卡片标题高度
    setTimeout(() => {
      this.headerHeight = document.getElementsByClassName('card-header-box')[0].clientHeight;
    }, 200);
  }
};
</script>

<style lang="scss" scoped>
.card-view {
  margin-top: env(safe-area-inset-top);
  // position: relative;
  // $cardHeight: calc(100vh - #{$pageHeaderHeight} - #{$footerHeight});
  // max-height: $cardHeight;
}
</style>
