<template>
  <!-- 纵向的表单 -->
  <div class="form-horizontal">
    <form class="form-horizontal-box">
      <div class="form-group" v-for="(form, index) in formList" :key="index">
        <!-- 表单标题 -->
        <label class="col-sm-2 control-label" :class="{ required: form.required }" v-text="form.title" />
        <!-- 表单内容 -->
        <div class="col-sm-10">
          <!-- 文本，type：text -->
          <span v-if="form.type === 'text'" class="form-control-static" v-text="form.value" />
          <!-- 输入框，type：input -->
          <input
            v-else-if="form.type === 'input'"
            type="text"
            class="form-control"
            :placeholder="form.placeholder"
            :value="form.defalut"
            @change="form.change"
          />
          <!-- 选择框 -->
          <select v-else-if="form.type === 'select'" class="select-medium form-control" @change="form.change">
            <!-- 选项 -->
            <option
              v-for="(optionValue, optionKey) in form.options"
              v-text="optionValue.name"
              :key="optionKey"
              :value="optionKey"
              :selected="optionKey === form.default"
            />
          </select>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'horizontal-form',
  props: {
    formList: {
      type: Array,
      defalut: () => {
        return [];
      }
    }
  }
};
</script>

<style lang="scss">
.form-horizontal {
  display: flex;
  align-items: center;
  height: auto;
  width: 100%;
  &-box {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .form-group {
      display: flex;
      align-items: center;
      margin-right: 10%;
      width: 60%;
      .col-sm-2 {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 64px;
        width: 100px;
        font-size: 14px;
        padding-top: 0;
        padding-right: 9px;
        color: #86898e;
      }
      .required {
        &::before {
          content: '*';
          position: relative;
          font-family: SimSun;
          right: 4px;
          color: #ff3333;
        }
      }
      .col-sm-10 {
        font-size: 14px;
        height: 64px;
        display: flex;
        align-items: center;
        span {
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
