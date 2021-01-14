<template>
  <div class="sleep-card">
    <!-- 头部 -->
    <SleepHeader :switch-sleep="switchSleep" />
    <!-- 内容 -->
    <div class="sleep-content">
      <!-- 选择体质 -->
      <div class="sleep-content-body">
        <div class="body-btn-box">
          <div
            v-for="(btn, index) in bodyBtnList"
            :key="index"
            class="body-btn"
            :class="{ select: selectBody === btn.value, gray: !powType }"
            @click="changeBody(btn.value, !powType)"
          >
            <span v-text="btn.text" />
          </div>
        </div>
      </div>
      <!-- 曲线 -->
      <keep-alive>
        <Curve v-show="imshowCurve" :imshow-chart="imshowCurve" />
      </keep-alive>
      <!-- 功能开关 -->
      <gree-list>
        <gree-list-item title="防直吹" style="font-size: 18px" :class="{ gray: disableBlow }" footer="防止风直接吹人">
          <gree-switch :disabled="disableBlow" slot="after" class="blue" v-model="blowActive" @change="switchBlow" />
        </gree-list-item>
        <gree-list-item title="自动灯光" style="font-size: 18px" footer="夜间自动关闭灯光">
          <gree-switch slot="after" class="blue" v-model="ligActive" @change="switchLig" />
        </gree-list-item>
      </gree-list>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import { Switch, List, Item } from 'gree-ui';
import Curve from '@/components/card/sleep/Curve';
import SleepHeader from '@/components/card/sleep/Header';
import { types } from '@/store/types';

export default {
  name: 'sleep-card',
  components: {
    SleepHeader,
    Curve,
    [Switch.name]: Switch,
    [List.name]: List,
    [Item.name]: Item
  },
  data() {
    return {
      bodyBtnList: [
        {
          value: 1,
          text: '平和体质'
        },
        {
          value: 2,
          text: '偏寒体质'
        },
        {
          value: 3,
          text: '偏热体质'
        },
        {
          value: 0,
          text: 'DIY模式'
        }
      ],
      selectBody: 1,
      blowActive: false,
      ligActive: false,
      blowId: 'AntiDirectBlow'
    };
  },
  computed: {
    ...mapState('control', {
      SwhSlp: state => state.dataObject.SwhSlp,
      SlpMod: state => state.dataObject.SlpMod,
      SmartSlpMod: state => state.dataObject.SmartSlpMod
    }),
    ...mapGetters('machine', ['statusMap', 'blindModelArr']),
    ...mapGetters(['powType']),
    // 当前体质
    bodyType() {
      if (this.SlpMod === 3 && this.SmartSlpMod === 0) {
        return 0;
      } else if (this.SlpMod === 2 && this.SmartSlpMod <= 3 && this.SmartSlpMod > 0) {
        return this.SmartSlpMod;
      }
      return -1;
    },
    // 是否显示曲线
    imshowCurve() {
      return Boolean(this.SwhSlp && this.SlpMod === 3 && this.SmartSlpMod === 0);
    },
    // 防直吹
    blowStatusName() {
      const statusMap = this.statusMap;
      return statusMap[this.blowId] && statusMap[this.blowId].statusName;
    },
    // 防直吹
    blowType() {
      return this.blowStatusName === 'status_1' && !this.disableBlow;
    },
    disableBlow() {
      return this.blindModelArr.includes(this.blowId);
    },
    // 自动灯光
    ligStatusName() {
      const statusMap = this.statusMap;
      return statusMap.Lig && statusMap.Lig.statusName;
    },
    // 自动灯光
    ligType() {
      return this.ligStatusName === 'status_1';
    }
  },
  watch: {
    bodyType: {
      handler(newVal) {
        this.selectBody = Number(newVal);
      },
      immediate: true
    },
    blowType: {
      handler(newVal) {
        this.blowActive = newVal;
      },
      immediate: true
    },
    ligType: {
      handler(newVal) {
        this.ligActive = newVal;
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setMusicData: types.SET_MUSIC_DATA,
      setDataObject: types.SET_DATA_OBJECT,
      setState: types.CONTROL_SET_STATE
    }),
    ...mapActions({
      sendCtrl: types.SEND_CTRL
    }),
    changeData(map) {
      this.setState({ watchLock: false, ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    // 选择体质
    changeBody(value, disable) {
      if (disable) return;
      const sendData = {
        SwhSlp: 1,
        SlpMod: value ? 2 : 3, // DIY模式发送3
        SmartSlpMod: value
      };
      this.changeData(sendData);
      this.setCacheData(sendData);
    },
    // 开关睡眠
    switchSleep(value) {
      const sendData = { SwhSlp: Number(value), SmartSlpMod: 0, SlpMod: 0 };
      if (value) {
        const { SmartSlpMod, SlpMod } = this.getCacheData();
        sendData.SmartSlpMod = SmartSlpMod;
        sendData.SlpMod = SlpMod;
        this.switchBlow(true); // 打开防直吹
        this.openQuiet(); // 打开静音
      }
      this.changeData(sendData);
    },
    // 开关防直吹
    switchBlow(value) {
      this.$stateMachine.toStatus(this.blowId, value ? 'status_1' : 'default');
    },
    // 开关灯光
    switchLig() {
      this.$stateMachine.nextStatus('Lig');
    },
    // 开关静音
    openQuiet() {
      this.changeData({
        Quiet: 2,
        Tur: 0,
        WdSpd: 1
      });
    },
    // 设置缓存数据
    setCacheData(map, key = 'sleepSetting') {
      let sleepSetting = window.storage.get(key) || {};
      sleepSetting = {
        sleepSetting,
        ...map
      };
      window.storage.set(key, sleepSetting);
    },
    // 获取缓存数据
    getCacheData(key = 'sleepSetting') {
      return window.storage.get(key) || {};
    }
  }
};
</script>

<style lang="scss">
$cardHeight: calc(100vh - #{$pageHeaderHeight} - env(safe-area-inset-top));
$cardContentHeight: calc(100vh - #{$pageHeaderHeight} - #{$cardHeaderHeight} - env(safe-area-inset-top));
$sleepMainHeight: calc(100vh - #{$cardHeaderHeight} - #{$pageHeaderHeight} - #{$temEditHeight} - #{$footerHeight} - env(safe-area-inset-top));
.sleep-card {
  max-height: $cardHeight;
  // overflow: hidden;
  .sleep-content {
    position: relative;
    height: 100%;
    // max-height: $cardContentHeight;
    min-height: $sleepMainHeight;
    padding-bottom: 50px;
    background-color: #fff;
    overflow-y: auto;
    &-body {
      height: auto;
      width: auto;
      .body-btn-box {
        margin-top: 14px;
        height: 340px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .body-btn {
          margin-top: 42px;
          height: 120px;
          width: 428px;
          border-radius: 60px;
          border: 4px solid #e0e0e0;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 44px;
          &.select {
            border: 4px solid rgb(133, 216, 255);
            span {
              color: rgb(133, 216, 255);
            }
          }
        }
      }
    }
    > .list {
      margin-bottom: calc(#{$footerHeight} + 80px);
    }
  }
}
</style>
