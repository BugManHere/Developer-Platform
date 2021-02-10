<template>
  <div class="gdp-panel">
    <!-- 头部 -->
    <div class="gdp-panel-header">
      <!-- 标题 -->
      <div class="gdp-panel-header-title">
        <slot name="title">
          <span v-text="'标题'" />
        </slot>
      </div>
      <!-- 标题右边按钮组 -->
      <div class="btn-group gdp-panel-header-right">
        <slot name="right">
          <!-- <button type="button" class="btn btn-default" v-text="'按钮'" /> -->
        </slot>
      </div>
    </div>
    <!-- 内容 -->
    <div class="gdp-panel-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'gdp-panel'
};
</script>

<style lang="scss" scoped>
.gdp-panel {
  position: relative;
  height: auto;
  width: auto;
  border: 1px #d6dee6 solid;
  border-radius: 4px;
  background: #ffffff;
  &-header {
    width: 100%;
    border-bottom: 1px rgba(211, 222, 230, 0.6) solid;
    min-height: 43px;
    height: auto;
    clear: both;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    padding: 0 20px;
    &-title {
      width: auto;
      height: 16px;
      font-size: 16px;
      float: left;
      color: #11191c;
    }
    &-right {
      height: 100%;
      button,
      select {
        width: auto;
        height: 24px;
        font-size: 12px;
        line-height: 22px;
        margin: 0px;
        padding: 0 12px;
        border-radius: 4px;
        border-width: 1px;
        color: #469dff;
        border-style: solid;
        background-color: transparent;
        border-color: #469dff;
      }
      button {
        &:hover {
          color: #ffffff;
          background-color: #469dff;
          border-color: #469dff;
          text-decoration: none;
        }
      }
      div {
        width: auto;
        display: flex;
        flex-wrap: nowrap;
      }
    }
  }
  &-content {
    width: 1084px;
    height: auto;
    clear: both;
    overflow: hidden;
  }
}
</style>
