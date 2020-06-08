import { timerListDevice, showLoading } from '@PluginInterface';
import { mapState, mapMutations, mapActions } from 'vuex';

const Customize = {
  computed: {
    ...mapState({
      mac: state => state.mac,
      dataObject: state => state.dataObject,
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
        SmartSleep: () => {
          showLoading();
          this.$router.push({name: 'Sleep'}).catch(e => { console.log(e); });
        },
        TemStep: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'default':
              this.setDataObject({has01: 1, has05: 0});
              break;
            case 'status_1':
              this.setDataObject({has01: 0, has05: 1});
              break;
            default:
              this.setDataObject({has01: 1, has05: 0});
              break;
          }
        },
        Avoid: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'default':
              if (this.dataObject.SmartWind === 3) {
                this.changeData({SmartWind: 0});
              } else if (this.dataObject.SmartWind === 2) {
                this.changeData({SmartWind: 3});
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
                this.changeData({SmartWind: 0});
              } else if (this.dataObject.SmartWind === 3) {
                this.changeData({SmartWind: 2});
              }
              break;
            default:
              break;
          }
        },
        'UDFanPort(Auto)': (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'status_1':
              this.changeData({UDFanPort: 2});
              break;
            case 'status_2':
              this.changeData({UDFanPort: 1});
              break;
            case 'default':
              this.changeData({UDFanPort: 2});
              break;
            default:
              this.changeData({UDFanPort: 0});
              break;
          }
        },
        FanLR: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'status_1':
              this.changeData({UDFanPort: 3});
              break;
            case 'status_2':
              this.changeData({UDFanPort: 1});
              break;
            case 'default':
              if (this.dataObject.UDFanPort === 3) {
                this.changeData({UDFanPort: 2});
              } else {
                this.changeData({UDFanPort: 1});
              }
              break;
            default:
              this.changeData({UDFanPort: 2});
              break;
          }
        },
        Humi: (currentStatus, afterStatus) => {
          switch (afterStatus) {
            case 'status_1':
              this.$router.push({name: 'Humi'}).catch(e => { console.log(e); });
              break;
            default:
              break;
          }
        },
        RFan: currentStatus => {
          switch (currentStatus) {
            case 'default':
            case undefined:
              this.changeData({UDFanPort: 3});
              break;
            default:
              this.changeData({UDFanPort: 2});
              break;
          }
        },
        LFan: currentStatus => {
          switch (currentStatus) {
            case 'default':
            case undefined:
              this.changeData({UDFanPort: 1});
              break;
            default:
              this.changeData({UDFanPort: 2});
              break;
          }
        },
        LRFan: currentStatus => {
          switch (currentStatus) {
            case 'default':
            case undefined:
              this.changeData({UDFanPort: 2});
              break;
            default:
              this.changeData({UDFanPort: 2});
              break;
          }
        },
      };
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE',
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(map) {
      this.setState(['watchLock', false]);
      this.setState(['ableSend', true]);
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
