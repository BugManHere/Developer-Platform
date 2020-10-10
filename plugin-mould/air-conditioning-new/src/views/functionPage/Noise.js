import { mapState, mapMutations, mapActions } from 'vuex';
import WorkLogic from '@logic/work';

const NoiseConfig = {
  mixins: [WorkLogic],
  data() {
    return {
      heatMod: 4,
      silderVal: 25
    };
  },
  computed: {
    ...mapState({
      NoiseSet: state => state.dataObject.NoiseSet,
      CoolNoise: state => state.dataObject.CoolNoise || 25,
      HeatNoise: state => state.dataObject.HeatNoise || 32
    }),
    // 当前模式的status
    modStatus() {
      return this.g_statusMap[this.work_modIdentifier];
    },
    // 制热和制冷不一样的配置
    silderType() {
      const value = this.modStatus ? this.modStatus.define.value : undefined;
      // 如果是制热
      return value === this.heatMod
        ? {
            key: 'HeatNoise',
            default: 32,
            min: 29,
            max: 39
          }
        : {
            key: 'CoolNoise',
            default: 25,
            min: 22,
            max: 38
          };
    }
  },
  watch: {
    silderType: {
      handler(newVal) {
        if (newVal) {
          const { key } = newVal; //
          this.silderVal = this[key]; // 赋值
          this.minSilderVal = newVal.min; // 赋予最小值
          this.maxSilderVal = newVal.max; // 赋予最大值
          this.sliderImshow = false;
          this.$nextTick(() => {
            this.sliderImshow = true;
          });
        }
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
    // 发送数据
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    // 开关噪声
    switchStatus(boolean) {
      this.changeStatus('', Number(boolean));
    },
    // 设置噪声
    changeStatus(e, NoiseSet = 1) {
      const { key } = this.silderType;
      this.changeData({ NoiseSet, [key]: this.silderVal });
    }
  }
};

export default NoiseConfig;
