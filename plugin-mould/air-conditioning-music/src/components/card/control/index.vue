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
<<<<<<< HEAD:plugin-mould/air-conditioning-music/src/components/Card/control/index.vue
    z-index: 1;
=======
<<<<<<< HEAD:plugin-mould/air-conditioning-music/src/components/Card/control/index.vue
<<<<<<< HEAD:plugin-mould/air-conditioning-music/src/components/Card/control/index.vue
=======
    z-index: 1;
>>>>>>> 5a44fac... feat(all):  零零散散的更新:plugin-mould/air-conditioning-music/src/components/card/control/index.vue
=======
    z-index: 1;
>>>>>>> origin/master:plugin-mould/air-conditioning-music/src/components/card/control/index.vue
>>>>>>> 004b7ac... Merge remote-tracking branch 'origin/master':plugin-mould/air-conditioning-music/src/components/card/control/index.vue
    &-box {
      height: auto;
    }
  }
}
</style>
