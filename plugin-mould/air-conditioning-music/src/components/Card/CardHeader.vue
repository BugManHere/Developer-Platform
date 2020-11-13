<template>
  <div ref="header-box">
    <div class="card-header" :ref="headerId" :id="headerId">
      <!-- 左边插槽 -->
      <div class="left">
        <slot name="left"></slot>
      </div>
      <!-- 右边插槽 -->
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    headerId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cardHeaderShow: false,
      headerHeight: 0,
      contentHeight: 0,
      contentDom: null,
      scrollPos: 0,
      scrollTimer: null,
      scrollTimer2: null,
      currentScrollTop: 0,
      safeAreaHeight: 0
    };
  },
  computed: {
    ...mapState({
      selectKey: state => state.selectKey
    })
  },
  mounted() {},
  deactivated() {},
  // 离开路由时清除定时器
  beforeRouteLeave(to, from, next) {},
  watch: {},
  methods: {
    ...mapMutations({})
  }
};
</script>

<style lang="scss">
$cardHeaderHeight: 142px;
$fontSize: 44px;
.card-header {
  position: relative;
  top: 0;
  max-height: $cardHeaderHeight;
  min-height: $cardHeaderHeight;
  display: flex;
  background: #fff;
  border-radius: 100px 100px 0 0;
  width: 100%;
  justify-content: space-between;
  font-size: $fontSize;
}
</style>
