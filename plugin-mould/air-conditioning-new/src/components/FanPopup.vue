<template>
  <div class="fan-picker" v-if="showPopup">
    <gree-picker
      v-model="showPopup"
      :title="title"
      ref="fanPicker"
      :data="fanData"
      :cols="1"
      :line-height="40"
      :multiLine="true"
      :default-index="pickerDefalutData"
      :multi-line="false"
      is-cascade
      ok-text=""
      cancel-text=""
      @change="setFan"
    />
  </div>
</template>

<script>
import { Row, Col, Popup, Picker, Overlay } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import LogicDefine from '@logic/define';

export default {
  mixins: [LogicDefine],
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Overlay.name]: Overlay
  },
  data() {
    return {
      showPopup: false,
      fanStatusList: [], // 风档的顺序
      currentStatus: '', // 当前状态
      title: '风速',
      pickerDefalutData: [0]
    };
  },
  computed: {
    ...mapState({
      fanKey: state => state.fanKey,
      Pow: state => state.dataObject.Pow,
      WdSpd: state => state.dataObject.WdSpd
    }),
    // 风档定义
    fanDefine() {
      return this.g_funcDefineMap[this.fanKey];
    },
    fanData() {
      const fanKey = this.fanKey;
      const result = this.fanStatusList.map((fanStatus, value) => {
        // status定义
        const statusDefine = this.fanDefine.statusDefine[fanStatus];
        // 定义key
        const key = fanStatus;
        // 名称
        const statusName = statusDefine.name;
        const stateName = `${fanKey}_${statusName}`;
        const text = this.$language(`fan.${stateName}`);
        return { text, key, value };
      });
      return [result];
    }
  },
  watch: {
    showPopup(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          const index = this.fanData[0].findIndex(fan => fan.key === this.currentStatus);
          this.pickerDefalutData = [index];
          this.$refs.fanPicker.refresh();
        });
      }
    },
    g_statusLoop: {
      handler(newVal) {
        const startStatus = 'default';
        const fanLoop = newVal[this.fanKey];
        if (fanLoop) {
          const result = JSON.parse(JSON.stringify(newVal[this.fanKey]));
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
        const statusMap = newVal[this.fanKey];
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
    setFan() {
      const status = this.$refs.fanPicker.getColumnValues()[0].key;
      const funcDefine = this.fanDefine;
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
