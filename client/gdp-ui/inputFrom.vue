<template>
  <!-- 列表内容 -->
  <form class="gdp-input-form">
    <div v-for="(formInfo, index) in inputFormConfig" :key="index" class="gdp-input-form-group">
      <label :class="{ required: formInfo.required }" class="gdp-input-form-group-label" v-text="formInfo.title" />
      <!-- 文本框，type：text -->
      <span v-if="formInfo.type === 'text'" v-text="formInfo.value" class="form-control-static" />
      <!-- 输入框，type：input -->
      <input
        v-else-if="formInfo.type === 'input'"
        type="text"
        class="form-control"
        :placeholder="formInfo.placeholder"
        v-model="formInfo.defalut"
        @input="formInfo.method"
        @submit="formInfo.method"
      />
      <!-- 选择框 -->
      <select v-else-if="formInfo.type === 'select'" v-model="formInfo.default" class="select-medium form-control" @change="formInfo.method(formInfo.default)">
        <!-- 选项 -->
        <option v-for="(optionValue, index) in formInfo.options" v-text="optionValue" :key="index" :value="index" />
      </select>
      <!-- 开关 -->
      <label
        v-else-if="formInfo.type === 'switch'"
        @change="switchHandler(formInfo.method, formInfo.default)"
        class="gdp-input-form-group-switch"
        :class="`switch-${formInfo.default}`"
      >
        <input type="checkbox" v-model="formInfo.default" />
        <span class="on" :class="{ 'on-hide': !formInfo.default }" v-text="formInfo.onText" />
        <span class="off" :class="{ 'off-hide': formInfo.default }" v-text="formInfo.offText" />
        <div class="toggle-inner" :class="{ right: formInfo.default }" />
      </label>
    </div>
  </form>
</template>

<script>
export default {
  name: 'gpd-input-form',
  props: {
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
            method: () => {
              console.log(this);
            }
          }
        ];
      }
    }
  },
  methods: {
    switchHandler(method, value) {
      this.$forceUpdate();
      method(value);
    }
  }
};
</script>

<style lang="scss" scoped>
.gdp-input-form {
  position: relative;
  width: 100%;
  height: auto;
  padding: 10px 0;
  border-bottom: 1px solid #e7e7e7;
  &-group {
    height: auto;
    min-height: 40px;
    padding: 10px 0 10px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &-label {
      position: relative;
      margin: auto 0;
      padding: 7px 0;
      width: 100px;
      margin: 0 10px;
      &.required {
        &::before {
          content: '*';
          position: absolute;
          font-family: SimSun;
          left: -12px;
          color: #ff3333;
        }
      }
    }
    > input {
      width: auto;
      min-width: 300px;
    }
    > select {
      width: auto;
      min-width: 100px;
    }
    &-switch {
      $switchHeight: 28px;
      position: relative;
      cursor: pointer;
      width: 70px;
      height: $switchHeight;
      margin-bottom: 0;
      input {
        width: 100%;
        opacity: 0;
      }
      .on {
        &.on-hide {
          transition: 0.4s linear all;
          opacity: 0;
          visibility: hidden;
        }
        transition: 0.4s linear all;
        opacity: 1;
        visibility: visible;
        color: #ffffff;
        font-size: 14px;
        font-weight: bold;
        position: absolute;
        white-space: nowrap;
        top: 4px;
        z-index: 1;
        left: 11px;
      }
      .off {
        &.off-hide {
          transition: 0.4s linear all;
          opacity: 0;
          visibility: hidden;
        }
        left: 39px;
        font-size: 14px;
        font-weight: bold;
        position: absolute;
        white-space: nowrap;
        top: 4px;
        z-index: 1;
      }
      .toggle-inner {
        background-color: #e9ecef;
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        &.right {
          background-color: #3bb6b6;
          &::before {
            transition: 0.4s linear all;
            transform: translateX(31px);
          }
        }
        &::before {
          background-color: #ffffff;
          content: '';
          height: calc(#{$switchHeight} - 5px);
          left: 5px;
          position: absolute;
          top: 2px;
          transition: 0.4s linear all;
          width: 30px;
        }
      }
    }
    .form-control {
      position: relative;
      width: 85px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
