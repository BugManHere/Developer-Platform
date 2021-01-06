<template>
  <div class="gdp-top">
    <div class="gdp-top-box">
      <i class="gdp-top-box-icon iconfont iconfont-xiangshang" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.gdp-top {
  position: fixed;
  bottom: 15px;
  right: 32px;
  height: auto;
  width: auto;
  background-color: black;
  opacity: 0.2;
  cursor: pointer;
  &-box {
    height: 21px;
    width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    &-icon {
      color: #fff;
      font-size: 8px;
    }
  }
  &:hover {
    opacity: 1;
  }
}
</style>
