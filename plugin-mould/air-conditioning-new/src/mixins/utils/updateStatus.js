import { mapState } from 'vuex';
/**
 * @description 检测有没有故障，有没有掉线
 */
const updateStatus = {
  computed: {
    ...mapState({
      isOffline: state => (process.env.VUE_APP_MID.startsWith('703') ? state.deviceInfo.deviceState : state.dataObject.OnLine)
    })
  },
  watch: {
    /**
     * @description 设备离线时跳转离线页面
     */
    isOffline(newV) {
      if (process.env.VUE_APP_MID.startsWith('702')) {
        if (newV !== 'online') {
          this.$router.push({ name: 'Offline' });
        }
      }
      if (process.env.VUE_APP_MID.startsWith('703')) {
        if (newV === -1) {
          this.$router.push({ name: 'Offline' });
        }
      }
    }
  },
  created() {
    this.initApp();
  },
  methods: {
    /**
     * @description APP初始化时检查有没有故障, 有没有预约
     */
    initApp() {
      if (process.env.VUE_APP_MID.startsWith('702')) {
        if (this.isOffline !== 'online') {
          this.$router.push({ name: 'Offline' });
        } else {
          this.$router.push({ path: '/' });
        }
      }
      if (process.env.VUE_APP_MID.startsWith('703')) {
        if (this.isOffline === -1) {
          this.$router.push({ name: 'Offline' });
        } else {
          this.$router.push({ path: '/' });
        }
      }
    }
  }
};
export default updateStatus;
