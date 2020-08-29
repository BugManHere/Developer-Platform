import { mapState } from 'vuex';
/**
 * @description 检测有没有故障，有没有掉线
 */
const updateStatus = {
  computed: {
    ...mapState({
      isOffline: state => state.deviceInfo.deviceState,
      lang: state => state.deviceInfo.lang
    })
  },
  watch: {
    /**
     * @description 设备离线时跳转离线页面
     */
    isOffline: {
      handler(newV, oldV) {
        if (newV === -1) {
          this.$router.push({ name: 'Offline' }).catch(err => {
            err;
          });
        } else if (oldV === -1) {
          this.$router.push({ path: '/Home' }).catch(err => {
            err;
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
    }
  },
  methods: {}
};
export default updateStatus;
