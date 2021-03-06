import { mapState } from 'vuex';
/**
 * @description 检测有没有故障，有没有掉线
 */
const updateStatus = {
  created() {
    this.initApp();
  },
  computed: {
    ...mapState({
      isOffline: state => state.deviceInfo.deviceState,
      lang: state => state.deviceInfo.lang,
      FreshAirConditionState: state => state.dataObject.FreshAirConditionState
    })
  },
  watch: {
    /**
     * @description 设备离线时跳转离线页面 特殊的 状态查询页 不跳Status
     */
    isOffline(newV) {
      if (newV === -1 && this.$route.name !== 'Status') {
        this.$router.push({ name: 'Offline' }).catch(err => {
          err;
        });
      }
    },
    /**
     * @description 跳转设备查询页面
     */
    FreshAirConditionState(newV) {
      if (newV) {
        this.$router.push({ name: 'Status' }).catch(err => {
          err;
        });
      }
    },
    lang: {
      handler(newVal) {
        this.$i18n.locale = newVal;
      },
      immediate: true
    }
  },
  methods: {
    /**
     * @description APP初始化时检查有没有故障, 有没有预约
     */
    initApp() {
      if (this.isOffline === -1) {
        this.$router.push({ name: 'Offline' }).catch(err => {
          err;
        });
      } else if (this.FreshAirConditionState) {
        this.$router.push({ name: 'Status' }).catch(err => {
          err;
        });
      } else {
        this.$router.push({ path: '/' }).catch(err => {
          err;
        });
      }
    }
  }
};
export default updateStatus;
