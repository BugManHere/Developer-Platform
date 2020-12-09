<template>
  <div class="fan-content">
    <div class="fan-content-header" v-text="'风速'" />
    <div class="fan-content-main" :class="{ 'set-gray': isGray }">
      <!-- 圆环 -->
      <div class="fan-content-main-circle">
        <div
          v-for="(fan, index) in fanData"
          :key="`circle_${index}`"
          :class="{ select: !isGray && fan.type }"
          class="circle"
          @click="fan.func(fan.key, isGray)"
        />
        <div class="line" />
      </div>
      <!-- 文字 -->
      <div class="fan-content-main-txt">
        <div
          v-for="(fan, index) in fanData"
          :key="`txt_${index}`"
          :class="{ select: !isGray && fan.type }"
          class="txt"
          v-text="fan.text"
          @click="fan.func(fan.key, isGray)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      fanStatusNameList: [] // 风档的顺序
    };
  },
  mounted() {
    this.updateStatusNameList();
  },
  computed: {
    ...mapState('control', {
      Pow: state => state.dataObject.Pow
    }),
    ...mapGetters(['fanDefine', 'fanIdentifier', 'fanCurrentStatusName', 'fanAbleSet', 'fanLoop']),
    fanData() {
      const result = this.fanStatusNameList.map(fanStatusName => {
        // status定义
        const statusDefine = this.fanDefine.statusDefine[fanStatusName];
        // 定义key
        const key = fanStatusName;
        // 开关图标
        const type = this.fanCurrentStatusName === fanStatusName;
        // 名称
        const statusName = statusDefine.name;
        const stateName = `${this.fanIdentifier}_${statusName}`;
        const text = this.$language(`fan.${stateName}`);
        // 执行的函数
        const func = (fanStatusName, disable = false) => {
          disable || this.$stateMachine.toStatus(this.fanIdentifier, fanStatusName);
        };
        return { text, key, func, type };
      });
      return result;
    },
    isGray() {
      return !this.Pow;
    }
  },
  watch: {
    fanLoop() {
      this.updateStatusNameList();
    },
    fanCurrentStatusName() {
      this.updateStatusNameList();
    }
  },
  methods: {
    // 给风挡排序
    updateStatusNameList() {
      let startStatus = 'default';
      if (this.fanLoop) {
        const result = [...this.fanLoop];
        if (!result.includes(startStatus)) {
          result.sort((statusNameA, statusNameB) => {
            return statusNameA[statusNameA.length - 1] - statusNameB[statusNameB.length - 1];
          });
          startStatus = result[0];
        }
        const length = result.length;
        let i = 0;
        while (result[0] !== startStatus && i < length) {
          result.push(result.shift());
          i += 1;
        }
        this.fanStatusNameList = result;
      }
    }
  }
};
</script>

<style lang="scss">
$fontSize: 44px;
.fan-content {
  position: relative;
  height: $fanContentHeight;
  background-color: #fff;
  font-size: $fontSize;
  padding: 0 66px;
  &-header {
    padding: 52px 0px 0 8px;
    border-top: 1px solid rgba(238, 238, 238, 1);
    color: rgba(64, 70, 87, 1);
    font-size: 48px;
  }
  &-main {
    &.set-gray {
      opacity: 0.4;
    }
    &-circle {
      position: relative;
      margin: 64px 20px 0 20px;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      width: auto;
      .circle {
        height: 40px;
        width: 40px;
        border-radius: 100%;
        background-color: rgba(228, 229, 231, 1);
        z-index: 2;
        &.select {
          background-color: rgba(0, 174, 255, 1);
        }
      }
      .line {
        position: absolute;
        left: 0;
        top: calc(50% - 0.5px);
        width: 100%;
        border-bottom: 1px solid rgba(228, 229, 231, 1);
      }
    }
    &-txt {
      padding-top: 40px;
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 42px;
      color: #b9bbc0;
      .select {
        color: rgba(0, 174, 255, 1);
      }
    }
  }
}
</style>
