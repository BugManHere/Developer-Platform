<template>
  <transition name="fade">
    <div v-show="show" class="error-overlay" @click="$emit('reload')">
      <div class="content">
        <span>加载失败了!</span>
        <span>重新加载</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1;
  .content {
    position: absolute;
    background-image: url('../assets/img/skill/share_reload_new.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 650px;
    height: 650px;
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      &:first-child {
        font-size: 46px;
        color: rgba($color: #404657, $alpha: 0.6);
        margin-top: 120px;
        margin-bottom: 20px;
      }
      &:last-child {
        font-size: 36px;
        color: #ffd800;
      }
    }
  }
}
</style>
