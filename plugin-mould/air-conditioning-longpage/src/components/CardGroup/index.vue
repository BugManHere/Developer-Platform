<template>
  <div class="card-group">
    <div class="card-group-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'card-group'
};
</script>

<style lang="scss" scoped>
.card-group {
  position: relative;
  width: 100%;
  height: auto;
  background-color: transparent;
  display: flex;
  justify-content: center;
  padding-bottom: 36px;
  &-content {
    // background-image: url('~@assets/img/bottom_bg.png');
    background-color: rgba(243, 248, 255, 1);
    background-size: cover;
    display: flex;
    width: 1026px;
    height: auto;
    border-radius: 36px;
    box-shadow: 0 9px 21px 3px rgba(0, 85, 255, 0.05);
  }
}
</style>
