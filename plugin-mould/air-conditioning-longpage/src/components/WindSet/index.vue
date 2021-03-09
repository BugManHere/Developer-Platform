<template>
  <card-group class="wind-set-group">
    <!-- <div class="wind-set-group"> -->
    <template v-slot:content>
      <!-- 风速设置 -->
      <wind-speed />
      <!-- 风向设置 -->
      <wind-direction />
    </template>
    <!-- <gree-toolbar position="bottom" no-hairline> </gree-toolbar> -->
    <!-- </div> -->
  </card-group>
</template>

<script>
import { ToolBar } from 'gree-ui';
import WindSpeed from './windSpeed';
import windDirection from './windDirection';
import CardGroup from '@/components/CardGroup/index';

export default {
  name: 'wind-set-group',
  components: {
    [WindSpeed.name]: WindSpeed,
    [windDirection.name]: windDirection,
    [ToolBar.name]: ToolBar,
    [CardGroup.name]: CardGroup
  }
};
</script>

<style lang="scss">
.wind-set-group {
  position: relative;
  width: 100%;
  height: auto;
  background-color: transparent;
  bottom: 0 !important;
  padding-bottom: 36px;
  .card-group-content {
    display: flex;
    flex-wrap: wrap;
  }
  .wind-box {
    width: 100%;
    $headerHeight: 68px;
    &-header {
      width: 100%;
      height: $headerHeight;
      margin-top: 24px;
      &-icon {
        float: left;
        height: $headerHeight;
        width: $headerHeight;
        border-radius: 50%;
        background: linear-gradient(180deg, rgb(127, 181, 246), rgb(109, 164, 230));
        font-size: 40px;
        color: #f4f4f4;
        line-height: $headerHeight;
        text-align: center;
      }
      &-text {
        color: rgb(64, 70, 87);
        line-height: $headerHeight;
        padding-left: 20px;
        font-size: 42px;
      }
    }
  }
}
</style>
