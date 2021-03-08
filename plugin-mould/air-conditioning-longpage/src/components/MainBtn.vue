<template>
  <div class="main-btn-group">
    <!-- 引导箭头 -->
    <div class="main-btn-group-direction-guide" />
    <!-- 底部按钮 -->
    <gree-toolbar position="bottom" no-hairline>
      <!-- 按钮组 -->
      <gree-row>
        <gree-col
          v-for="(btn, index) in btnList"
          class="main-btn-group-item"
          width="25"
          :id="`main-btn-${btn.key}`"
          :key="index"
          :class="{
            'set-gray': btn.gray,
            'set-hide': btn.hide,
            select: btn.icon.type === 'on' && !btn.gray
          }"
        >
          <div class="icon" @click="btn.func(btn.key, btn.gray)">
            <i class="iconfont" :class="`iconfont-${btn.icon.key}`" />
          </div>
          <div class="main-btn-group-item-text" v-text="btn.name" />
        </gree-col>
      </gree-row>
    </gree-toolbar>
  </div>
</template>

<script>
import { Row, Col, ToolBar } from 'gree-ui';
import { mapGetters } from 'vuex';
import { glyphs } from '@assets/iconfont/iconfont.json';

export default {
  name: 'main-btn-list',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [ToolBar.name]: ToolBar
  },
  computed: {
    ...mapGetters(['popupDefine', 'powType']),
    ...mapGetters('machine', ['statusMap', 'blindModelArr']),
    btnList() {
      if (!Object.keys(this.statusMap).length) return [];
      const result = this.popupDefine.map(model => {
        const identifier = model.identifier;
        if (!this.statusMap[identifier])
          return {
            icon: {},
            func: () => {
              console.log('Undefined function');
            }
          };
        // 当前status定义
        const status = this.statusMap[identifier].status;
        // 取名称
        const defaultNameKey = `btn.${identifier}`;
        const statusNameText = status.name;
        const stateNameText = `${defaultNameKey}_${statusNameText}`;
        const name = stateNameText === this.$language(stateNameText) ? this.$language(defaultNameKey) : this.$language(stateNameText);
        // 图标
        const icon = glyphs.some(item => item.font_class === status.icon.key) ? status.icon : { key: 'undefined', type: 'off' };
        // 是否置灰
        const gray = this.blindModelArr.includes(identifier);
        // 是否隐藏
        const hide = status.icon.key === 'disable';
        // 执行的方法
        const func = (identifier, disable = false) => {
          disable || this.$stateMachine.nextStatus(identifier);
        };
        return { key: identifier, name, icon, gray, hide, func };
      });
      return result;
    }
  },
  methods: {
    switchPow() {
      this.$stateMachine.nextStatus('Pow');
    }
  }
};
</script>

<style lang="scss">
.main-btn-group {
  .toolbar {
    background-image: url('~@assets/img/bottom_bg.png');
    display: flex;
    width: 1026px;
    height: 258px !important;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 36px;
    box-shadow: 0 9px 21px 3px rgba(0, 85, 255, 0.05);
    justify-content: center !important;
    align-items: flex-start !important;
  }
}
</style>

<style lang="scss" scoped>
.main-btn-group {
  position: relative;
  width: 100%;
  height: auto;
  background-color: transparent;
  bottom: 0 !important;
  &-direction-guide {
    position: relative;
    height: 72px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      border-radius: 6px;
      height: 9px;
      width: 120px;
      background-color: rgba(152, 152, 152, 0.45);
      font-family: 'Roboto-Light';
      content: '';
    }
  }
  .toolbar-inner {
    .row {
      width: 100%;
      height: 100%;
      display: flex;
      text-align: center;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      .main-btn-group-item {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
          height: 140px;
          width: 140px;
          border-radius: 50%;
          background-color: rgba(152, 152, 152, 0.15);
          box-shadow: 0 3px 24px rgba(64, 70, 87, 0.03);
          i {
            font-size: 72px;
          }
        }
        &-text {
          padding-top: 8px;
          width: 100%;
        }
        &#main-btn-Pow {
          .icon {
            color: #fff;
            background: linear-gradient(180deg, rgb(141, 191, 253), rgb(119, 167, 224));
            box-shadow: 0 9px 21px rgba(14, 110, 227, 0.35);
          }
        }
      }
    }
  }

  .pow-button {
    $buttonHeight: 132px;
    position: relative;
    min-height: $buttonHeight;
    min-width: $buttonHeight;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(rgb(139, 210, 236), rgb(99, 164, 248));
    opacity: 0.5;
    border: 0.5px solid #398acb;
    border-radius: 50%;
    z-index: 2;
    // padding: 1px;
    margin: 1px;
    span {
      font-size: 60px;
      color: #fff;
      z-index: inherit;
    }
    &.off {
      border: 0.5px solid transparent;
      padding: 1px;
      margin: 0;
      span {
        color: rgb(112, 187, 242);
      }
    }
  }
  .select {
    i {
      color: #fff;
    }
  }
}
</style>
