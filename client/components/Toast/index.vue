<template>
  <div class="gr-toast">
    <div v-fade:show="show" :class="type">
      <span v-text="text"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'info',
    },
    text: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="scss">
.gr-toast {
  position: absolute;
  width: 100%;
  top: 0px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  user-select: none;
  div {
    position: relative;
    width: auto;
    height: 40px;
    min-width: 200px;
    text-align: center;
    padding: 10px 20px;
    border-radius: 6px;
    z-index: 99;
    font-size: 16px;
  }
  .info {
    background-color:#7FFFAA;
    color: forestgreen;
  }
  .warning {
    background-color:palegreen;
    color: goldenrod;
  }
  .error {
    background-color:darkkhaki;
    color: #f5f5f5;
  }
  .message {
    background-color:#7FFFAA;
    color: forestgreen;
  }
}
</style>