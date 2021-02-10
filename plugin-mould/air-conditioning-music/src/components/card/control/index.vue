<template>
  <div class="control-card">
    <!-- 头部 -->
    <ControlHeader @modUnfold="getModUnfold" :headerText="headerText" />
    <!-- 头部遮罩层  -->
    <template class="mask">
      <slot name="mask" />
    </template>
    <!-- 内容 -->
    <div class="card-content">
      <div class="card-content-box">
        <ModContent @modName="getModName" :modUnfold="modUnfold" />
        <FanContent />
        <FuncContent />
      </div>
    </div>
  </div>
</template>

<script>
import ControlHeader from './Header';
import ModContent from './content/mod';
import FanContent from './content/fan';
import FuncContent from './content/func';

export default {
  name: 'control-card',
  data() {
    return {
      isCeiling: false,
      headerHeight: 0,
      headerText: '',
      modUnfold: true
    };
  },
  components: {
    ControlHeader,
    ModContent,
    FanContent,
    FuncContent
  },
  methods: {
    getModUnfold(val) {
      this.modUnfold = val;
    },
    getModName(val) {
      this.headerText = val;
    }
  }
};
</script>

<style lang="scss">
$cardHeight: calc(100vh - #{$pageHeaderHeight} - env(safe-area-inset-top));
$cardContentHeight: calc(100vh - #{$pageHeaderHeight} - #{$cardHeaderHeight} - env(safe-area-inset-top));
$musicMainHeight: calc(100vh - #{$cardHeaderHeight} - #{$pageHeaderHeight} - #{$temEditHeight} - #{$footerHeight} - env(safe-area-inset-top));
.control-card {
  // max-height: $cardHeight;
  // overflow: hidden;
  .card-content {
    position: relative;
    height: 100%;
    // max-height: $cardContentHeight;
    min-height: $musicMainHeight;
    background-color: #fff;
    overflow: hidden;
    z-index: 1;
    transform: scale3d(1, 1, 1);
    &-box {
      height: auto;
    }
  }
}
</style>
