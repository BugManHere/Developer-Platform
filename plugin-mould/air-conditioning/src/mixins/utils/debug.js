import { mapState, mapMutations } from 'vuex';
import { SET_CHECK_OBJECT, SET_DATA_OBJECT, SET_STATE } from '../../store/types';
import updateStatus from './updateStatus'; // 自定义初始化功能，可以修改

const mixin = {
  mixins: [updateStatus],
  computed: {
    ...mapState({
      dataObject: state => state.dataObject
    })
  },
  mounted() {
    this.setCheckObject(this.dataObject);
    this.setState(['ableSend', true]);
    this.setState(['loading', false]);
    navigator.PluginInterface = {
      ...navigator.PluginInterface,
      // 弹出确认对话框
      showConfirm: (title, content, callback) => {
        const onConfirm = () => {
          callback(1);
        };
        const onCancel = () => {
          callback(0);
        };
        const onHide = onCancel;
        Dialog.confirm({ title, content, onConfirm, onCancel, onHide });
      },
      // 语音技能页面
      startVoiceMainActivity: mac => {
        console.log('跳转主体语音技能页面', { mac });
      },
      // 更新H5页面中的状态信息给主体
      updateStates: () => {
        // console.log('调用主体更新小卡片方法', { mac, states });
      },
      // 发送json数据给设备
      sendDataToDevice: () => {
        // console.log('发送json数据给设备', { mac, json, isFollowSysVibration });
      },
      // 跳转到设备预约页
      timerListDevice: mac => {
        console.log('跳转到设备预约页', { mac });
      },
      // 获取设备查询字段以及查看设备是否在线
      getInfo: () => {
        // console.log('获取设备查询字段以及查看设备是否在线', { mac });
      },
      showLoading() {
        console.log('showLoading......');
      },
      hideLoading() {
        console.log('hideLoading......');
      },
      // Toast提示
      showToast(msg) {
        let toast = document.createElement('span');
        toast.innerText = msg;
        const toastStyle = {
          position: 'fixed',
          'background-color': 'rgba(0, 0, 0, 0.6)',
          color: '#fff',
          'font-size': '16px',
          'text-align': 'center',
          padding: '8px 16px',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          'border-radius': '5px',
          'z-index': 999
        };
        toast.style.cssText = Object.keys(toastStyle).reduce((acc, cur) => {
          acc = acc + `${cur}: ${toastStyle[cur]};`;
          return acc;
        }, '');
        document.body.appendChild(toast);
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 1000);
      },
      // 调用主体场景功能
      getCCcmd: (mac, cmd, remarks, dat) => {
        console.log('调用主体场景接口', { mac, cmd, remarks, dat });
      },
      closePage: () => {
        console.log('关闭插件页');
      },
      toVoicePage: () => {
        console.log('跳转语音相关页面');
      },
      editDevice: () => {
        console.log('设备编辑页');
      },
      getCurrentMode: () => {},
      getCloudTimerByMac: () => {}
    };
  },
  methods: {
    ...mapMutations({
      setCheckObject: SET_CHECK_OBJECT,
      setDataObject: SET_DATA_OBJECT,
      setState: SET_STATE
    })
  }
};

export default mixin;
