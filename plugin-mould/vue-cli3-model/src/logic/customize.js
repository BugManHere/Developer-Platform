import { timerListDevice } from "@PluginInterface";

const Customize = {
  computed: {
    customize() {
      return {
        AppTimer: () => {
          try {
            timerListDevice();
          } catch (e) {
            console.log("%c running timerListDevice()", "color: blue");
          }
        },
        Sleep: () => {
          console.log("click sleep");
        },
        cwz: () => {
          console.log("run cwz");
        }
      };
    }
  },
  methods: {
    /**
     * @description 执行自定义函数
     */
    customizeFunc(key) {
      try {
        this.customize[key]();
      } catch (e) {
        console.log(`%c 找不到${key}的自定义函数`, "color: blue");
      }
    }
  }
};
export default Customize;
