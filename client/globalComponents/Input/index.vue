<template>
  <div>
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
        <form class="gdp-input-content-box">
          <div v-for="(fromInfo, index) in inputForm" :key="index" class="gdp-input-form-group">
            <label :class="{ required: fromInfo.required }" class="gdp-input-form-group-label" v-text="fromInfo.title" />
            <!-- 输入框，type：input -->
            <span v-if="fromInfo.type === 'text'" v-text="fromInfo.value" class="form-control-static" />
            <!-- 输入框，type：input -->
            <input
              v-else-if="fromInfo.type === 'input'"
              type="text"
              class="form-control"
              :placeholder="fromInfo.placeholder"
              :value="fromInfo.defalut"
              @input="fromInfo.method"
            />
          </div>
        </form>
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
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    inputForm: {
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
          }
        ];
      }
    },
    onConfirm: {
      type: Function,
      default: function() {
        return () => {};
      }
    },
    onCancel: {
      type: Function,
      default: function() {
        return () => {};
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
  data() {
    return {
      isShow: false, // 是否显示
      isConfirm: false, // 是否确认
      isCancel: false // 是否取消
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

<style lang="scss">
.gdp-input {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
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
    .gdp-input-content-box {
      position: relative;
      width: 100%;
      height: auto;
      padding: 10px 0;
      border-bottom: 1px solid #e7e7e7;
      .gdp-input-form-group {
        height: auto;
        min-height: 40px;
        padding: 10px 0 10px 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &-label {
          margin: auto 0;
          padding: 7px 0;
          width: 100px;
          &.required {
            &::before {
              content: '*';
              position: relative;
              font-family: SimSun;
              right: 4px;
              color: #ff3333;
            }
          }
        }
        > input {
          width: auto;
          min-width: 300px;
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
