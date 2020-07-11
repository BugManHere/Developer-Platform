/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-08 09:14:43
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-08 19:14:05
 */ 
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
      FreshAirConditionState: state => state.dataObject.FreshAirConditionState,
    })
  },
  watch: {
    /**
     * @description 设备离线时跳转离线页面
     */
    isOffline(newV) {
      if (newV === -1) {
        this.$router.push({ name: 'Offline' }).catch(err => { err; });
      }
    },
    /**
     * @description 跳转设备查询页面
     */
    FreshAirConditionState(newV) {
      if (newV) {
        console.log('-------watch--------');
        this.$router.push({ name: 'Status' }).catch(err => { err; });
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
        this.$router.push({ name: 'Offline' }).catch(err => { err; });
      } else if (this.FreshAirConditionState) {
        this.$router.push({ name: 'Status' }).catch(err => { err; });
      } else {
        this.$router.push({ path: '/' }).catch(err => { err; });
      }
    }
  }
};
export default updateStatus;
