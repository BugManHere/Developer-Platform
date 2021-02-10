<template>
  <div class="gdp-input-group">
    <div class="overlay-backdrop" v-if="isShow" />
    <div class="gdp-input" v-lift:show="isShow">
      <div class="gdp-input-box">
        <!-- 大标题 -->
        <div class="gdp-input-title">
          <span v-text="title" v-show="title && title !== ''" />
        </div>
        <!-- 标题栏按钮 -->
        <div class="gdp-title-btn">
          <button class="gdp-title-btn-group close" v-for="(btnInfo, index) in titleBtn" :key="index" @click="btnInfo.method">
            <span v-html="btnInfo.text" />
          </button>
        </div>
        <!-- 内容 -->
        <gpd-input-form :input-form-config="inputFormConfig" />
        <!-- 底部按钮 -->
        <div class="gdp-input-button">
          <div class="gdp-input-button-group" v-for="(btnInfo, index) in buttonList" :key="index" @click="btnInfo.method">
            <button type="button" class="btn" :class="`btn-${btnInfo.type}`">
              <span v-text="btnInfo.text" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import inputFrom from '@/gdp-ui/inputFrom';

export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    inputFormConfig: {
      type: Array,
      default: () => {
        return [
          {
            type: 'text',
            title: '品类',
            value: '测试'
          },
          {
            type: 'text',
            title: '品牌',
            value: '格力'
          },
          {
            type: 'input',
            title: '产品名称',
            placeholder: '请输入产品名称，如：贝塔柜机',
            required: true,
            method: val => {
              console.log(val);
            }
          },
          {
            type: 'select',
            title: '协议',
            default: 2,
            options: ['a', 'b', 'c'],
            method: index => {
              console.log(index);
            }
          },
          {
            type: 'switch',
            title: '是否',
            onText: 'ON',
            offText: 'OFF',
            default: false,
            method: e => {
              console.log(e);
            }
          }
        ];
      }
    },
    onConfirm: {
      type: Function,
      default: function() {
        myvm.$input.hide();
      }
    },
    onCancel: {
      type: Function,
      default: () => {
        myvm.$input.hide();
      }
    },
    buttonList: {
      type: Array,
      default: function() {
        return [
          {
            type: 'default',
            text: '取消',
            method: this.onCancel
          },
          {
            type: 'primary',
            text: '确定',
            method: this.onConfirm
          }
        ];
      }
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
  components: {
    [inputFrom.name]: inputFrom
  },
  data() {
    return {
      isShow: false // 是否显示
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
  }
};
</script>

<style lang="scss" scoped>
.gdp-input {
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
    min-width: 540px;
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
    .gdp-input-title {
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
    .gdp-input-button {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: flex-end;
      flex-wrap: nowrap;
      &-group {
        height: auto;
        padding: 10px;
      }
    }
  }
}
</style>
