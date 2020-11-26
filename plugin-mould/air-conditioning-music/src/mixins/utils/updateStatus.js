import { mapState, mapMutations } from 'vuex';
import { SET_CHECK_OBJECT, SET_DATA_OBJECT } from '../../store/types';
/**
 * @description 检测有没有故障，有没有掉线
 */
const updateStatus = {
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      isOffline: state => state.deviceInfo.deviceState,
      lang: state => state.deviceInfo.lang
    })
  },
  mounted() {
    this.setCheckObject(this.dataObject);
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
  methods: {
    ...mapMutations({
      setCheckObject: SET_CHECK_OBJECT,
      setDataObject: SET_DATA_OBJECT
    })
  }
};
export default updateStatus;
