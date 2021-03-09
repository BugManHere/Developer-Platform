import { mapState, mapMutations, mapActions } from 'vuex';
import updateStatus from './updateStatus'; // 自定义初始化功能，可以修改
import { Dialog } from 'gree-ui';
import { types } from '@/store/types';
import { timerTasks } from '@/api/mock';
import { encrypt } from '@/utils/encryption';

const mixin = {
  mixins: [updateStatus],
  computed: {
    ...mapState('control', {
      dataObject: state => state.dataObject
    })
  },
  mounted() {
    this.setCheckObject(this.dataObject);
    this.machineInit();
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
      editDevice: () => {},
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
      toWebPage(url) {
        window.open(url);
      },
      callNumber(number) {
        console.log('打电话:', number);
      },
      closePage() {
        console.log('关闭webview');
      },
      getCloudTimerByMac(mac, callback) {
        const result = {
          mac,
          r: 200,
          subId: '',
          timerTasks
        };
        callback(JSON.stringify(result));
      },
      setCloudTimer(timerDic, taskDic, callback) {
        const timer = {
          ...timerDic,
          timerID: Math.floor(Math.random() * 100000)
        };
        const task = {
          ...taskDic,
          cmd: encrypt(taskDic.cmd, ':lO!2t-PD~$y2q*`'),
          status: timerDic.status,
          key: ':lO!2t-PD~$y2q*`',
          result: '',
          stateDes: '',
          subId: ''
        };
        timerTasks.push({
          timer,
          task
        });
        callback(timerTasks);
      },
      modifyCloudTimer(timerDic, taskDic, timerID, callback) {
        const timerTask = timerTasks.find(item => item.timer.timerID === timerID);

        const { key } = timerTask.task;
        const cmd = encrypt(taskDic.cmd, key);
        const timer = {
          ...timerDic,
          timerID
        };
        const task = {
          cmd,
          dat: taskDic.dat,
          key,
          remark: taskDic.remark,
          result: timerTask.task.result,
          stateDes: timerTask.task.stateDes,
          status: timerDic.status,
          subId: timerTask.task.subId
        };
        timerTask.timer = timer;
        timerTask.task = task;
        callback(timerTasks);
      },
      deleteCloudTimer(timerIDs, callback) {
        const timerTasksFilter = timerTasks.filter(timerTask => !timerIDs.includes(timerTask.timer.timerID));
        timerTasks.length = 0;
        timerTasksFilter.forEach(timerTask => timerTasks.push(timerTask));
        callback(timerTasks);
      }
    };
  },
  methods: {
    ...mapMutations({
      setCheckObject: types.SET_CHECK_OBJECT
    }),
    ...mapActions({
      machineInit: types.MACHINE_INIT
    })
  }
};

export default mixin;
