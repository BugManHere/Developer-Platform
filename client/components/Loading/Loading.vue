<template>
  <div class="gr-loading">
    <img src="@assets/img/loading.png">
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.gr-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  img {
    height: 60px;
    z-index: 99;
    animation: pinwheel .75s infinite linear;
  }
  @keyframes pinwheel {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
  }
}
</style>