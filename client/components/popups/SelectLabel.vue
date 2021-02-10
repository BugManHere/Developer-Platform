<template>
  <div class="select-label">
    <div class="panel-body">
      <!-- 全选按钮 -->
      <div class="btn-all">
        <div class="btn-all-box" @click="selectItem('all')">
          <i class="iconfont iconfont-check" v-if="isAllSelect" />
          <i class="iconfont iconfont-uncheck" v-else />
          <span v-text="'全选'" />
        </div>
      </div>
      <!-- 标签 -->
      <div class="label-group">
        <div v-for="(item, index) in labelList" :key="index">
          <div class="label-item" :class="{ select: selectType[index] }" @click="selectItem(index)" v-text="item.name" />
        </div>
      </div>
    </div>
    <!-- 底部按钮组 -->
    <div class="btn-group btn-group-justified col-md-12">
      <button class="btn " v-for="(btn, index) in bottomBtns" v-html="btn.text" :class="`btn-${btn.class}`" :key="index" @click="btn.method" />
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@utils';

export default {
  name: 'gdp-select-label',
  props: {
    selectAxis: {
      type: String,
      default: ''
    },
    selectLabel: {
      type: Object,
      default: () => {
        return {};
      }
    },
    labelList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    outputHandler: {
      type: Function,
      default: () => {
        return () => {};
      }
    },
    bottomBtns: {
      type: Array,
      default: function() {
        return [
          {
            class: 'primary',
            text: '完&emsp;成',
            method: () => {
              this.selectDone();
            }
          }
        ];
      }
    }
  },
  data() {
    return {
      selectType: []
    };
  },
  watch: {
    labelList: {
      handler(newVal) {
        if (!newVal || !newVal.length) return;
        this.updateSelect(newVal);
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    isAllSelect() {
      return !this.selectType.some(item => {
        return item === false;
      });
    }
  },
  methods: {
    selectItem(index) {
      if (index === 'all') {
        this.selectType = Array(this.selectType.length).fill(!this.isAllSelect);
      } else {
        this.$set(this.selectType, index, !this.selectType[index]);
      }
    },
    updateSelect(labelList = this.labelList) {
      const selectLabel = deepCopy(this.selectLabel);
      const val = selectLabel[this.selectAxis];
      if (val.length) {
        this.selectType = selectLabel[this.selectAxis];
      } else {
        this.selectType = Array(labelList.length).fill(false);
      }
    },
    selectDone() {
      this.outputHandler({ labels: this.selectType, selectAxis: this.selectAxis });
      this.$popup.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
.select-label {
  $mainHeight: 540px;
  $buttonHeight: 64px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  height: auto;
  width: auto;
  .panel-body {
    position: relative;
    max-height: $mainHeight;
    height: auto;
    width: 100%;
    overflow-y: auto;
    .btn-all {
      position: relative;
      left: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 8px;
      &-box {
        cursor: pointer;
        > span {
          line-height: 22px;
          height: 22px;
          margin: 0 25px 0 3px;
          font-size: 14px;
          color: #404657;
        }
      }
    }
    .label-group {
      padding-bottom: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      font-size: 12px;
      .label-item {
        background-color: #eef1f6;
        padding: 5px 5px;
        margin: 10px 12px;
        border-radius: 15px;
        border: 1px#D6DEE6 solid;
        width: auto;
        cursor: pointer;
        color: #404657;
        &:hover {
          border: 1px#14B5E0 solid;
        }
        &.select {
          border: 1px#00a1d6 solid;
          color: #00a1d6;
        }
      }
    }
  }
  .btn-group {
    position: relative;
    height: $buttonHeight;
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #fff;
    padding: 15px 0;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    border-top: 1px #ddd solid;
    button {
      width: 80px;
      margin-right: 10px;
      margin-left: 10px;
    }
  }
}
</style>
