<template>
  <div class="fan-content">
    <div class="fan-content-header" v-text="'风速'" />
    <div class="fan-content-main"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
$fontSize: 44px;
.fan-content {
  position: relative;
  height: $fanContentHeight;
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
