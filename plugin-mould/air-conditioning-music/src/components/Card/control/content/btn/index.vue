<template>
  <div class="btn-content">
    <gree-row>
      <gree-col
        v-for="(btn, index) in btnList"
        :key="index"
        width="25"
        :class="{
          'set-gray': btn.gray,
          'set-hide': btn.hide
        }"
      >
        <!-- 图标 -->
        <div class="icon" @click="btn.func(btn.key, btn.gray)" :class="{ select: btn.icon.type === 'on' && !btn.gray }">
          <i class="iconfont" :class="{ [`iconfont-${btn.icon.key}`]: true }" />
        </div>
        <!-- 名称 -->
        <span :class="{ triangle: btn.page }" v-text="btn.name" @click="goPage(btn.page, btn.gray)" />
      </gree-col>
    </gree-row>
  </div>
</template>

<script>
import { Row, Col, Popup } from 'gree-ui';
import { showLoading } from '@PluginInterface';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup
  },
  props: {
    title: {
      type: String,
      default: '高级'
    },
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
            func: () => {
              console.log('Lig');
            }
          }
        ];
      }
    }
  },
  methods: {
    goPage(page, isGray) {
      if (isGray || !page) return;
      const { routerName, params } = page;
      try {
        showLoading();
      } catch {
        console.log('showLoading');
      }
      this.$router
        .push({
          name: routerName,
          params
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
$fontSize: 44px;
.btn-content {
  height: auto;
  width: auto;
  display: flex;
  justify-content: center !important;
  align-items: flex-start !important;
  .row {
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: flex-start;
    align-items: center;
    .col-25,
    .col {
      width: 25%;
      padding-top: 76px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      &.set-gray {
        opacity: 0.4;
      }
      .icon {
        height: 154px;
        width: 154px;
        margin: auto;
        border-radius: 50%;
        border: 1px solid #cecece;
        display: flex;
        justify-content: center;
        align-items: center;
        &.select {
          background-color: #00aeff;
          h3,
          i {
            color: #fff;
          }
        }
        i {
          font-size: 90px;
        }
      }
      span {
        padding-top: 36px;
        width: 100%;
        &.triangle {
          &:after {
            content: '';
            position: relative;
            top: 1px;
            left: 12px;
            vertical-align: -2px;
            display: inline-block;
            padding-top: 1px !important;
            border-color: transparent transparent #707070 transparent;
            border-style: solid;
            border-width: 0 0 18px 18px;
            height: 0;
            width: 0;
          }
        }
      }
    }
  }
  .iconfont {
    font-size: 58px;
  }
}
</style>
