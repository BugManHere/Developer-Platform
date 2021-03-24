<template>
  <div class="btn-group">
    <gree-row>
      <gree-col
        v-for="(btn, index) in btnList"
        width="25"
        class="btn-col"
        :id="`btn-group-${btn.key}`"
        :class="{
          'set-gray': btn.gray,
          'set-hide': btn.hide,
          select: btn.icon.type === 'on' && !btn.gray,
          blur: btn.icon.type === 'off' && !btn.gray
        }"
        :key="index"
      >
        <!-- 图标 -->
        <div class="icon" @click="btn.handler(btn.key, btn.gray)">
          <i class="iconfont" :class="{ [`iconfont-${btn.icon.key}`]: true }" />
        </div>
        <!-- 名称 -->
        <div class="btn-group-text" v-text="btn.name" />
      </gree-col>
    </gree-row>
  </div>
</template>

<script>
import { Row, Col } from 'gree-ui';
export default {
  name: 'btn-group',
  components: {
    [Row.name]: Row,
    [Col.name]: Col
  },
  props: {
    btnList: {
      type: Array,
      default: () => {
        return [
          {
            key: 'Lig',
            name: '灯光',
            gray: false,
            hide: false,
            icon: {
              key: 'Lig',
              type: 'off'
            },
            page: {
              routerName: 'Lig'
            },
            handler: () => {
              console.log('Lig');
            }
          }
        ];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-group {
  position: relative;
  width: 100%;
  height: auto;
  background-color: transparent;
  .row {
    width: 100%;
    height: auto;
    display: flex;
    text-align: center;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .btn-col {
      width: 25%;
      height: 258px;
      display: flex;
      justify-content: center;
      align-content: flex-start;
      flex-wrap: wrap;
      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        height: 140px;
        width: 140px;
        margin-top: 40px;
        border-radius: 50%;
        background-color: rgba(152, 152, 152, 0.15);
        i {
          font-size: 72px;
        }
      }
      .btn-group-text {
        padding-top: 8px;
        width: 100%;
      }
      &.select {
        .icon {
          background-image: linear-gradient(rgb(141, 191, 253), rgb(119, 167, 224));
          box-shadow: 0 9px 21px rgba(14, 110, 227, 0.15);
          i {
            color: #fff;
          }
        }
      }
      &.blur {
        .icon {
          transition: all 0.5s;
          box-shadow: 0 3px 24px rgba(64, 70, 87, 0.03);
        }
      }
    }
  }
}
</style>
