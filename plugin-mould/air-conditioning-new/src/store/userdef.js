import { timerListDevice, showToast } from '@PluginInterface';

export const customizeFunction = {
  AppTimer: ({ rootState }) => {
    const mac = rootState.control.mac;
    try {
      timerListDevice(mac);
    } catch (e) {
      console.log('%c running timerListDevice()', 'color: blue');
    }
  },
  ConstUD: ({ dispatch }, currentStatus) => {
    const goSweep = id => {
      window.myvm.$router.push({
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
      dispatch('STATE_MACHINE_INTERFACE', { SwUpDn: funcData.ConstUD }, { root: true });
    } else goSweep(2);
  },
  ConstLR: ({ dispatch }, currentStatus) => {
    const goSweep = id => {
      window.myvm.$router.push({
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
      dispatch('STATE_MACHINE_INTERFACE', { SwingLfRig: funcData.ConstLR }, { root: true });
    } else goSweep(1);
  },
  Elc: () => {
    window.myvm.$router.push('Electric');
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

/**
 * @returns {Object} identifier对应的缓存信息
 * @param {String} storageKey 在localstorage中用作存储的key
 * @param {Array} jsons 缓存的json数组
 */
export const cacheDataMap = {
  Mod: [
    {
      storageKey: 'temSetting',
      jsons: ['SetTem', 'Add0.5', 'Add0.1']
    },
    {
      storageKey: 'fanSetting',
      jsons: ['WdSpd', 'Tur', 'Quiet']
    }
  ]
};
