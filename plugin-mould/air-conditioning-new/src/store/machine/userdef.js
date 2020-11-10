import { getCloudTimerByMac, showToast } from '@PluginInterface';

export const customizeFunction = {
  AppTimer: () => {
    try {
      getCloudTimerByMac(this.state_mac);
    } catch (e) {
      console.log('%c running getCloudTimerByMac()', 'color: blue');
    }
  },
  ConstUD: (_, currentStatus) => {
    const goSweep = id => {
      this.$router.push({
        name: 'SweepConst',
        params: { id }
      });
    };
    if (!['undefined', undefined].includes(currentStatus)) {
      goSweep(2);
      return;
    }
    const storage = window.storage;
    const funcData = storage.get('funcData') || {};
    if (funcData.ConstUD) {
      this.changeData({ SwUpDn: funcData.ConstUD });
    } else goSweep(2);
  },
  ConstLR: (_, currentStatus) => {
    const goSweep = id => {
      this.$router.push({
        name: 'SweepConst',
        params: { id }
      });
    };
    if (!['undefined', undefined].includes(currentStatus)) {
      goSweep(1);
      return;
    }
    const storage = window.storage;
    const funcData = storage.get('funcData') || {};
    if (funcData.ConstLR) {
      this.changeData({ SwingLfRig: funcData.ConstLR });
    } else goSweep(1);
  },
  Elc: () => {
    this.$router.push('Electric');
  },
  ModPopup: ({ commit }) => {
    commit('control/SET_DATA_OBJECT', { ModPopup: 1 }, { root: true });
  },
  FanPopup: ({ commit }) => {
    commit('control/SET_DATA_OBJECT', { FanPopup: 1 }, { root: true });
  },
  FuncPopup: ({ commit }) => {
    commit('control/SET_DATA_OBJECT', { FuncPopup: 1 }, { root: true });
  },
  BottomSleep: (_, currentStatus) => {
    switch (currentStatus) {
      case 'status_1':
        showToast('睡眠已关闭', 0);
        break;
      case 'default':
        showToast('睡眠已开启', 0);
        break;
      default:
        break;
    }
  },
  'BottomSleep(ordinary)': (_, currentStatus) => {
    switch (currentStatus) {
      case 'status_1':
        showToast('睡眠已关闭', 0);
        break;
      case 'default':
        showToast('睡眠已开启', 0);
        break;
      default:
        break;
    }
  },
  NoiseSet: async () => {
    // 加载对应页面
    this.setState({ hiddenComponent: 'Noise' });
    // 获取对应组件内容
    const hiddenComponent = window.myvm.$children[0].$refs.hiddenComponent;
    // 获取需要执行的方法
    const defaultFunction = await hiddenComponent.getFunc();
    // 执行二级页面内部方法
    defaultFunction();
  },
  EnvAreaSt: async () => {
    // 加载对应页面
    this.setState({ hiddenComponent: 'AreaFan' });
    // 获取对应组件内容
    const hiddenComponent = window.myvm.$children[0].$refs.hiddenComponent;
    // 获取需要执行的方法
    const defaultFunction = await hiddenComponent.getFunc();
    // 执行二级页面内部方法
    defaultFunction();
  }
};

export const customizeInit = {
  Demo: () => {
    console.log('run Demo init');
  },
  // 如果是场景模式，删除预约图标
  AppTimer: () => {
    // if (this.state_dataObject.functype === 1) {
    //   this.state_funcDefineMap.AppTimer.type = 'inertia';
    // }
  },
  // 噪声二级页面方法
  NoiseSet: () => {}
};
