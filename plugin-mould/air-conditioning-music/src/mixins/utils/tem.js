import { mapState, mapMutations, mapActions } from 'vuex';
import { types } from '@/store/types';

const temConfig = {
  data() {
    return {
      maxTem: 30,
      minTem: 16,
      changeStepFlag: false
    };
  },
  computed: {
    ...mapState('control', {
      SetTem: state => state.dataObject.SetTem,
      add01: state => state.dataObject['Add0.1'],
      add05: state => state.dataObject['Add0.5'],
      has01: state => state.dataObject.has01,
      has05: state => state.dataObject.has05
    }),
    // 温度间隔
    temStep() {
      return (this.has01 && 0.1) || (this.has05 && 0.5) || 1;
    },
    // 实际温度值
    currentTem() {
      const hasDcm = this.has05 || this.has01;
      let result = this.SetTem + ((hasDcm && this.add01 * 0.1) || (hasDcm && this.add05 * 0.5) || 0);
      if (result >= this.maxTem) return this.maxTem;
      if (result <= this.minTem) return this.minTem;
      return result;
    },
    // 计算用温度值
    computeTem() {
      let result = this.SetTem + ((this.has01 && this.add01 * 0.1) || ((this.has05 || this.has01) && this.add05 * 0.5) || 0);
      if (result >= this.maxTem) return this.maxTem;
      if (result <= this.minTem) return this.minTem;
      return result;
    }
  },
  methods: {
    ...mapMutations({
      setMusicData: types.SET_MUSIC_DATA,
      setDataObject: types.SET_DATA_OBJECT,
      setCheckObject: types.SET_CHECK_OBJECT,
      setState: types.CONTROL_SET_STATE
    }),
    ...mapActions({
      sendCtrl: types.SEND_CTRL
    }),
    changeData(val) {
      this.setState({ watchLock: false, ableSend: true });
      this.setDataObject(val);
      this.sendCtrl(val);
    },
    setTem(type) {
      let { temInt, temDcm } = this.customizeTem(type);
      let sendData = {
        SetTem: temInt
      };
      if (this.has01) {
        sendData = {
          ...sendData,
          'Add0.1': temDcm,
          'Add0.5': Number(temDcm >= 5)
        };
      } else if (this.has05) {
        sendData = {
          ...sendData,
          'Add0.1': Number(temDcm >= 5) * 5,
          'Add0.5': Number(temDcm >= 5)
        };
      }
      this.changeData(sendData);
    },
    // 业务判断
    customizeTem(type) {
      let result;
      if (this.temStep === 0.5) {
        const base = 1 / this.temStep;
        const reTem = (this.currentTem + this.temStep * type) * base;
        if (type === 1) {
          const inputTem = Math.floor(reTem) / base;
          result = this.getTem(inputTem, 0);
        } else {
          const inputTem = Math.ceil(reTem) / base;
          result = this.getTem(inputTem, 0);
        }
      } else {
        result = this.getTem(this.computeTem, this.temStep * type);
      }
      return result;
    },
    // 温度计算
    getTem(from, fixed) {
      let tem = this.fixNum(from + fixed);
      tem > this.maxTem && (tem = this.maxTem);
      tem < this.minTem && (tem = this.minTem);
      const temInt = Math.floor(tem);
      const temDcm = this.fixNum(tem - temInt) * 10;
      return { tem, temInt, temDcm };
    },
    // 取整：小数点后一位
    fixNum(value) {
      return Number(value.toFixed(1));
    }
  }
};

export default temConfig;
