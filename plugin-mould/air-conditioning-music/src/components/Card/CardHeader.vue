<template>
  <div ref="header-box" class="card-header-box">
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
export default {
  props: {
    headerId: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
$cardHeaderHeight: 142px;
$fontSize: 44px;
.card-header-box {
  position: sticky;
  top: 0;
  z-index: 999;
  height: $cardHeaderHeight;
  .card-header {
    position: relative;
    top: 0;
    height: $cardHeaderHeight;
    max-height: $cardHeaderHeight;
    // min-height: $cardHeaderHeight;
    display: flex;
    background: #fff;
    border-radius: 100px 100px 0 0;
    width: 100%;
    justify-content: space-between;
    font-size: $fontSize;
  }
}
</style>
