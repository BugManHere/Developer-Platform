import { timerListDevice } from '@PluginInterface';
import { mapMutations } from 'vuex';

const Customize = {
  computed: {
    customize() {
      return {
        AppTimer: () => {
          try {
            timerListDevice();
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
              console.log(5);
              this.setDataObject({has01: 0, has05: 1});
              break;
            default:
              console.log(1);
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
