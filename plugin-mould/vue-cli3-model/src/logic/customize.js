import { timerListDevice } from '@PluginInterface';
import { mapState, mapMutations } from 'vuex';

const Customize = {
  computed: {
    ...mapState({
      mac: state => state.mac
    }),
    customize() {
      return {
        AppTimer: () => {
          console.log('1');
          try {
            console.log('2');
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
        }
      };
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
    }),
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
