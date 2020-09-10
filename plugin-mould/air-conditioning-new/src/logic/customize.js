import { timerListDevice, showLoading } from '@PluginInterface';
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
            timerListDevice(this.mac);
          } catch (e) {
            console.log('%c running timerListDevice()', 'color: blue');
          }
        },
        BabySleep: () => {
          showLoading();
          this.$router
            .push({
              name: 'Sleep',
              params: {
                id: 1
              }
            })
            .catch(e => {
              console.log(e);
            });
        },
        SmartSleep: () => {
          showLoading();
          this.$router
            .push({
              name: 'Sleep',
              params: {
                id: 2
              }
            })
            .catch(e => {
              console.log(e);
            });
        },
        TemStep: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'default':
              this.setDataObject({ has01: 1, has05: 0 });
              break;
            case 'status_1':
              this.setDataObject({ has01: 0, has05: 1 });
              break;
            default:
              this.setDataObject({ has01: 1, has05: 0 });
              break;
          }
        },
        Avoid: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'default':
              if (this.dataObject.SmartWind === 3) {
                this.changeData({ SmartWind: 0 });
              } else if (this.dataObject.SmartWind === 2) {
                this.changeData({ SmartWind: 3 });
              }
              break;
            default:
              break;
          }
        },
        Follow: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'default':
              if (this.dataObject.SmartWind === 2) {
                this.changeData({ SmartWind: 0 });
              } else if (this.dataObject.SmartWind === 3) {
                this.changeData({ SmartWind: 2 });
              }
              break;
            default:
              break;
          }
        },
        'UDFanPort(Auto)': (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'status_1':
              this.changeData({ UDFanPort: 2 });
              break;
            case 'status_2':
              this.changeData({ UDFanPort: 1 });
              break;
            case 'default':
              this.changeData({ UDFanPort: 2 });
              break;
            default:
              this.changeData({ UDFanPort: 0 });
              break;
          }
        },
        FanLR: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'status_1':
              this.changeData({ UDFanPort: 3 });
              break;
            case 'status_2':
              this.changeData({ UDFanPort: 1 });
              break;
            case 'default':
              if (this.dataObject.UDFanPort === 3) {
                this.changeData({ UDFanPort: 2 });
              } else {
                this.changeData({ UDFanPort: 1 });
              }
              break;
            default:
              this.changeData({ UDFanPort: 2 });
              break;
          }
        },
        Humi: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'status_1':
              this.$router.push({ name: 'Humi' }).catch(e => {
                console.log(e);
              });
              break;
            default:
              break;
          }
        },
        RFan: () => {
          this.changeData({ UDFanPort: 3 });
        },
        LFan: () => {
          this.changeData({ UDFanPort: 1 });
        },
        LRFan: () => {
          this.changeData({ UDFanPort: 2 });
        },
        ConstUD: () => {
          this.$router.push({
            name: 'Sweep',
            params: { id: 2 }
          });
        },
        ConstLR: () => {
          this.$router.push({
            name: 'Sweep',
            params: { id: 1 }
          });
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
        }
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
        console.log(`%c 找不到${key}的自定义函数`, 'color: blue');
      }
    }
  }
};
export default Customize;
