<template>
  <div class="control-card">
    <!-- 头部 -->
    <GrownHeader @isCeiling="getCeiling" @headerHeight="getHeaderHeight" />
    <!-- 内容 -->
    <div class="card-content" :style="{ top: `${isCeiling ? -headerHeight : 0}px` }">
      <FanContent />
      <FuncContent />
    </div>
  </div>
</template>

<script>
import GrownHeader from '@/components/card/control/content/mod';
import FanContent from './content/fan';
import FuncContent from './content/func';

export default {
  name: 'control-card',
  data() {
    return {
      isCeiling: false,
      headerHeight: 0
    };
  },
  components: {
    GrownHeader,
    FanContent,
    FuncContent
  },
  methods: {
    getCeiling(isCeiling) {
      this.isCeiling = isCeiling;
    },
    getHeaderHeight(headerHeight) {
      this.headerHeight = headerHeight;
    }
  }
};
</script>

<style lang="scss">
$musicMainHeight: calc(100vh - #{$cardHeaderHeight} - #{$pageHeaderHeight} - #{$temEditHeight} - #{$footerHeight});
.card-content {
  position: relative;
  height: 100%;
  margin-bottom: $footerHeight;
  min-height: $musicMainHeight;
  background-color: #fff;
}
</style>
