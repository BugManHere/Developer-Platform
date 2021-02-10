<template>
  <div class="gdp-confirm-group">
    <div class="overlay-backdrop" v-if="isShow" />
    <div class="gdp-confirm" v-lift:show="isShow">
      <div class="gdp-confirm-box">
        <!-- 标题栏按钮 -->
        <div class="gdp-title-btn">
          <button class="gdp-title-btn-group close" v-for="(btnInfo, index) in titleBtn" :key="index" @click="btnInfo.method">
            <span v-html="btnInfo.text" />
          </button>
        </div>
        <!-- 内容 -->
        <div class="gdp-confirm-content">
          <i class="gdp-confirm-content-icon iconfont" :class="`iconfont-${icon.type}`" :style="{ color: icon.color }" />
          <div class="gdp-confirm-content-text" v-html="content" />
        </div>
        <!-- 勾选框 -->
        <div class="gdp-confirm-required" v-if="requiredText !== ''">
          <i v-if="isCheck" class="iconfont iconfont-check" @click="isCheck = !isCheck" />
          <i v-else class="iconfont iconfont-uncheck" @click="isCheck = !isCheck" />
          <span v-text="requiredText" />
        </div>
        <!-- 底部按钮 -->
        <div class="gdp-confirm-button">
          <div class="gdp-confirm-button-group ">
            <!-- 确认按钮 -->
            <button type="button" class="btn btn-default  confirm" @click="clickConfirm" :disabled="requiredText !== '' && !isCheck">
              <span v-text="confirmText" />
            </button>
          </div>
          <div class="gdp-confirm-button-group ">
            <!-- 取消按钮 -->
            <button type="button" class="btn btn-default cancel" @click="clickCancel">
              <span v-text="cancelText" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: Object,
      default: () => {
        return {
          type: 'info',
          color: 'rgb(128, 157, 225)'
        };
      }
    },
    content: {
      type: String,
      default: '烹饪进行中，如果中途取消烹饪工作，会影响烹饪效果。是否确定取消烹饪？'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    onConfirm: {
      type: Function,
      default: function() {
        window.myvm.$confirm.hide();
      }
    },
    onCancel: {
      type: Function,
      default: () => {
        window.myvm.$confirm.hide();
      }
    },
    requiredText: {
      type: String,
      default: '必须勾选才能继续'
    },
    titleBtn: {
      type: Array,
      default: function() {
        return [
          {
            text: '&times;',
            method: this.onCancel
          }
        ];
      }
    }
  },
  data() {
    return {
      isShow: false, // 是否显示
      isCheck: false // 是否勾选
    };
  },
  watch: {
    isShow: {
      handler(newVal) {
        if (newVal) {
          document.onkeydown = e => {
            switch (e.keyCode) {
              // Enter
              case 13:
                this.onConfirm();
                break;
              // Esc
              case 27:
                this.onCancel();
                break;
              default:
                break;
            }
          };
        } else {
          document.onkeydown = () => {};
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.isShow = true;
  },
  methods: {
    clickConfirm() {
      this.$confirm.hide();
      this.onConfirm();
    },
    clickCancel() {
      this.$confirm.hide();
      this.onCancel();
    }
  }
};
</script>

<style lang="scss" scoped>
.gdp-confirm {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  $titleHeight: 48px;
  &-box {
    position: relative;
    height: auto;
    width: auto;
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
    .gdp-confirm-title {
      height: auto;
      min-height: 34px;
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: 20px;
      border-bottom: 1px solid #e7e7e7;
      background-color: #f4f4f4;
      span {
        height: $titleHeight;
        font-size: 18px;
        display: flex;
        align-items: center;
      }
    }
    .gdp-confirm-required {
      width: 100%;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      font-size: 14px;
      i {
        font-size: 14px;
        padding-right: 6px;
        &.iconfont-check {
          color: rgb(57, 155, 255);
        }
      }
    }
    .gdp-confirm-content {
      font-size: 16px;
      padding: 0 30px;
      padding-top: 36px;
      padding-bottom: 12px;
      display: flex;
      justify-content: space-around;
      height: auto;
      &-icon {
        height: 100%;
        font-size: 18px;
        padding-right: 10px;
      }
      &-text {
        max-width: 370px;
        width: auto;
        line-height: 25px;
      }
    }
    .gdp-title-btn {
      position: absolute;
      top: 0;
      right: 5px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      &-group {
        padding: 6px 8px;
        > span {
          cursor: pointer;
        }
      }
    }
    .gdp-confirm-button {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      padding-bottom: 16px;
      &-group {
        height: auto;
        padding: 10px;
        .confirm {
          background-color: rgb(128, 157, 225);
          color: #fff;
        }
      }
    }
  }
}
</style>
