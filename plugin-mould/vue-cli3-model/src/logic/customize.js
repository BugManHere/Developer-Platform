import { timerListDevice } from '@PluginInterface';
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
        Sleep: () => {
          console.log('click sleep');
        },
        TemUn: status => {
          switch (status) {
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
        Avoid: status => {
          switch (status) {
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
        Follow: status => {
          console.log(status);
          switch (status) {
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
    customizeFunc(key, status) {
      try {
        this.customize[key](status);
      } catch (e) {
        console.log(`%c 找不到${key}的自定义函数`, 'color: blue');
      }
    }
  }
};
export default Customize;
