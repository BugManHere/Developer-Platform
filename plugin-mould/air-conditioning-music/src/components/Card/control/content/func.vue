<template>
  <div class="func-content">
    <div class="func-content-header" v-text="'高级功能'" />
    <div class="func-content-main"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
$fontSize: 44px;
.func-content {
  position: relative;
  height: 352px;
  background-color: #fff;
  font-size: $fontSize;
  padding: 0 66px;
  &-header {
    padding: 52px 0px 0 8px;
    border-top: 1px solid rgba(238, 238, 238, 1);
  }
  &-main {
  }
}
</style>
