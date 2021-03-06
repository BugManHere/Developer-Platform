import { mapGetters, mapState } from 'vuex';
/**
 * @description 检测有没有故障，有没有掉线
 */
const updateStatus = {
  computed: {
    ...mapState('control', {
      isOffline: state => state.deviceInfo.deviceState,
      lang: state => state.deviceInfo.lang
    }),
    ...mapGetters(['errorMsgs'])
  },
  watch: {
    /**
     * @description 设备离线时跳转离线页面
     */
    isOffline: {
      handler(newV) {
        if (newV === -1) {
          this.$router.replace('Offline').catch(err => {
            console.log(err);
          });
        }
      },
      immediate: true
    },
    lang: {
      handler(newVal) {
        this.$i18n.locale = newVal;
      },
      immediate: true
    },
    // 如果故障不可控
    'errorMsgs.controlAble': {
      handler(newVal) {
        if (!newVal) {
          setTimeout(() => {
            this.$router.push('ErrorWarning');
          }, 200);
        } else if (this.$route.name === 'ErrorWarning') {
          this.$router.push('Home');
        }
      },
      immediate: true
    }
  }
};
export default updateStatus;
