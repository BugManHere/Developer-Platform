import { getCloudTimerByMac, showToast } from '@PluginInterface';
import { mapState, mapMutations, mapActions } from 'vuex';

const Customize = {
  mounted() {
    this.g_identifierArr.forEach(id => {
      this.initFunc[id] && this.initFunc[id]();
    });
  },
  computed: {
    ...mapState({
      mac: state => state.mac,
      dataObject: state => state.dataObject
    }),
    customize() {
      return {
        AppTimer: () => {
          try {
            getCloudTimerByMac(this.mac);
          } catch (e) {
            console.log('%c running getCloudTimerByMac()', 'color: blue');
          }
        },
        ConstUD: currentStatus => {
          const goSweep = id => {
            this.$router.push({
              name: 'SweepConst',
              params: { id }
            });
          };
          if (!['undefined', undefined].includes(currentStatus)) {
            goSweep(2);
            return;
          }
          const storage = window.storage;
          const funcData = storage.get('funcData') || {};
          if (funcData.ConstUD) {
            this.changeData({ SwUpDn: funcData.ConstUD });
          } else goSweep(2);
        },
        ConstLR: currentStatus => {
          const goSweep = id => {
            this.$router.push({
              name: 'SweepConst',
              params: { id }
            });
          };
          if (!['undefined', undefined].includes(currentStatus)) {
            goSweep(1);
            return;
          }
          const storage = window.storage;
          const funcData = storage.get('funcData') || {};
          if (funcData.ConstLR) {
            this.changeData({ SwingLfRig: funcData.ConstLR });
          } else goSweep(1);
        },
        Elc: () => {
          this.$router.push('Electric');
        },
        ModPopup: () => {
          this.setDataObject({ ModPopup: 1 });
        },
        FanPopup: () => {
          this.setDataObject({ FanPopup: 1 });
        },
        FuncPopup: () => {
          this.setDataObject({ FuncPopup: 1 });
        },
        BottomSleep: currentStatus => {
          switch (currentStatus) {
            case 'status_1':
              showToast('睡眠已关闭', 0);
              break;
            case 'default':
              showToast('睡眠已开启', 0);
              break;
            default:
              break;
          }
        },
        'BottomSleep(ordinary)': currentStatus => {
          switch (currentStatus) {
            case 'status_1':
              showToast('睡眠已关闭', 0);
              break;
            case 'default':
              showToast('睡眠已开启', 0);
              break;
            default:
              break;
          }
        },
        NoiseSet: async () => {
          // 加载对应页面
          this.setState({ hiddenComponent: 'Noise' });
          // 获取对应组件内容
          const hiddenComponent = window.myvm.$children[0].$refs.hiddenComponent;
          // 获取需要执行的方法
          const defaultFunction = await hiddenComponent.getFunc();
          // 执行二级页面内部方法
          defaultFunction();
        },
        EnvAreaSt: async () => {
          // 加载对应页面
          this.setState({ hiddenComponent: 'AreaFan' });
          // 获取对应组件内容
          const hiddenComponent = window.myvm.$children[0].$refs.hiddenComponent;
          // 获取需要执行的方法
          const defaultFunction = await hiddenComponent.getFunc();
          // 执行二级页面内部方法
          defaultFunction();
        }
      };
    },
    /**
     * @description 自执行函数
     */
    initFunc() {
      return {
        Demo: () => {
          console.log('run Demo init');
        },
        // 如果是场景模式，删除预约图标
        AppTimer: () => {
          if (this.dataObject.functype === 1) {
            this.g_funcDefineMap.AppTimer.type = 'inertia';
          }
        },
        // 噪声二级页面方法
        NoiseSet: () => {}
      };
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      updateDataObject: 'UPDATE_DATAOBJECT',
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    /**
     * @description 执行自定义函数
     */
    customizeFunc(key, currentStatus, afterStatus) {
      try {
        this.customize[key](currentStatus, afterStatus);
      } catch (e) {
        console.log(e);
        console.log(`%c 找不到${key}的自定义函数`, 'color: blue');
      }
    }
  }
};
export default Customize;
