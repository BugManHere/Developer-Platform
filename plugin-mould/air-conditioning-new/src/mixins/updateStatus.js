import { mapState } from 'vuex';
/**
 * @description 检测有没有故障，有没有掉线
 */
const updateStatus = {
  computed: {
    ...mapState('control', {
      isOffline: state => state.deviceInfo.deviceState,
      lang: state => state.deviceInfo.lang
    })
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
        } else if (!this.errorMsgs.controlAble) {
          this.$router.replace('ErrorWarning').catch(err => {
            console.log(err);
          });
        } else {
          this.$router.push('/');
        }
      },
      immediate: true
    },
    lang: {
      handler(newVal) {
        this.$i18n.locale = newVal;
      },
      immediate: true
    }
  }
};
export default updateStatus;
