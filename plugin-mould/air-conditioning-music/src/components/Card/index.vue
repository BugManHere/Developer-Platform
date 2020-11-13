<template>
  <div class="card-view">
    <div class="card-body">
      <!-- 内容 -->
      <div class="card-main" style="{height: 100%}">
        <keep-alive>
          <component :is="selectKey" class="card-main-component" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import GrownCard from './grown/index';
import ControlCard from './control/index';

export default {
  components: {
    [GrownCard.name]: GrownCard,
    [ControlCard.name]: ControlCard
  },
  computed: {
    ...mapState({
      selectKey: state => state.selectKey
    })
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
