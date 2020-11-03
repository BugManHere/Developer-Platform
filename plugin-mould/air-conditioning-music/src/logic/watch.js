import { mapState, mapMutations, mapActions } from 'vuex';
import LogicDefine from './define';

const LogicWatch = {
  mixins: [LogicDefine],
  computed: {
    ...mapState({
      watchLock: state => state.watchLock,
      deviceInfo: state => state.deviceInfo,
      devOptions: state => state.devOptions
    })
  },
  watch: {
    g_mid(newVal) {
      console.info(`Current Running mid: ${newVal}`);
    },
    g_outputMap: {
      handler(newVal) {
        if (newVal) {
          this.setDataObject(newVal);
        }
      },
      deep: true,
      immediate: true
    },
    // 当前状态的信息
    g_statusMap: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          if (this.watchLock || !(oldVal && Object.keys(oldVal).length)) return;
          // 存储改变的状态
          const stateArr = [];
          for (const item in newVal) {
            if (item) {
              // push state
              newVal[item].status !== oldVal[item].status && stateArr.push(`${item}_${newVal[item].status}`);
            }
          }
          // 输入: state
          stateArr.forEach(item => {
            this.g_checkLogic(item);
          });
        });
      },
      deep: true
    },
    // 显示设备名
    g_deviceName: {
      handler(newVal) {
        if (newVal && process.env.NODE_ENV === 'development') {
          const deviceInfo = JSON.parse(JSON.stringify(this.deviceInfo));
          deviceInfo.name = newVal;
          this.setDeviceInfo(deviceInfo);
        }
      }
    },
    g_identifierArr: {
      handler(newVal) {
        this.setState({
          devOptions: {
            ...this.devOptions,
            identifierArr: newVal
          }
        });
      }
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setDeviceInfo: 'SET_DEVICE_INFO',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    g_changeData(map) {
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    /**
     * @description 检查互斥
     */
    g_checkLogic(state) {
      if (this.g_excludeMap[state] && this.g_excludeMap[state].length) {
        // 如果存在排斥的状态
        const itemLogicMap = this.g_excludeMap[state]; // 需要排斥的状态数组
        itemLogicMap.forEach(item => {
          const id = this.g_stateToId[item]; // 状态对应的功能id
          if (!id) return; // 如果功能id不存在于这个插件，则不处理
          const currentStatus = this.g_statusMap[id].realStatus;
          const currentState = `${id}_${currentStatus}`; // 该功能id的当前状态
          item === currentState && this.g_runLogic(id); // 如果当前状态为需要互斥的状态，则执行互斥
        });
      }
    },
    /**
     * @description 执行互斥
     */
    g_runLogic(id) {
      const toStatus = this.g_statusDirectionMap[id];
      const func = this.g_funcDefineMap[id];
      const json = func.json;
      const statusDefine = func.statusDefine[toStatus];
      const moreCommand = statusDefine.moreCommand;
      let setData = moreCommand || {};
      setData[json] = statusDefine.value;
      this.g_changeData(setData);
    }
  }
};

export default LogicWatch;
