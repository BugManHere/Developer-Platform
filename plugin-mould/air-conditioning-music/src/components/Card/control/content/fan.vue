<template>
  <div class="fan-content">
    <div class="fan-content-header" v-text="'风速'" />
    <div class="fan-content-main" :class="{ 'set-gray': !this.Pow }">
      <!-- 圆环 -->
      <div class="fan-content-main-circle">
        <div v-for="(fan, index) in fanData" :key="`circle_${index}`" :class="{ select: currentStatus === fan.key }" class="circle" @click="setFan(index)" />
        <div class="line" />
      </div>
      <!-- 文字 -->
      <div class="fan-content-main-txt">
        <div
          v-for="(fan, index) in fanData"
          :key="`txt_${index}`"
          :class="{ select: currentStatus === fan.key }"
          class="txt"
          v-text="fan.text"
          @click="setFan(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import WorkLogic from '@logic/work';

export default {
  mixins: [WorkLogic],
  data() {
    return {
      fanStatusList: [], // 风档的顺序
      currentStatus: '' // 当前状态
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow
    }),
    fanData() {
      const result = this.fanStatusList.map((fanStatus, value) => {
        // status定义
        const statusDefine = this.work_fanDefine.statusDefine[fanStatus];
        // 定义key
        const key = fanStatus;
        // 名称
        const statusName = statusDefine.name;
        const stateName = `${this.work_fanIdentifier}_${statusName}`;
        const text = this.$language(`fan.${stateName}`);
        return { text, key, value };
      });
      return result;
    }
  },
  watch: {
    g_statusLoop: {
      handler(newVal) {
        const startStatus = 'default';
        const fanLoop = newVal[this.work_fanIdentifier];
        if (fanLoop) {
          const result = JSON.parse(JSON.stringify(newVal[this.work_fanIdentifier]));
          const length = result.length;
          let i = 0;
          while (result[0] !== startStatus && i < length) {
            result.push(result.shift());
            i += 1;
          }
          this.fanStatusList = result;
        }
      },
      deep: true,
      immediate: true
    },
    g_statusMap: {
      handler(newVal) {
        const statusMap = newVal[this.work_fanIdentifier];
        if (statusMap) this.currentStatus = statusMap.status;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    setFan(index) {
      if (!this.Pow) return;
      const status = this.fanData[index].key;
      const funcDefine = this.work_fanDefine;
      const statusDefine = funcDefine.statusDefine[status];
      const identifier = funcDefine.identifier;
      const currentStatus = this.currentStatus;
      const customize = statusDefine.customize;
      // 执行自定义函数 'before'
      switch (customize) {
        case 'replace':
          this.customizeFunc(identifier, currentStatus, status);
          return;
        case 'before':
          this.customizeFunc(identifier, currentStatus, status);
          break;
        case 'after':
          setTimeout(() => {
            this.customizeFunc(identifier, currentStatus, status);
          }, 0);
          break;
        default:
          break;
      }
      const moreCommand = statusDefine.moreCommand;
      const json = funcDefine.json;
      const value = statusDefine.value;
      let setData = moreCommand || {};
      setData[json] = value;
      this.changeData(setData);
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
        // border: 1px solid rgba(228, 229, 231, 1);
        height: 2px;
        background-color: rgba(228, 229, 231, 1);
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
