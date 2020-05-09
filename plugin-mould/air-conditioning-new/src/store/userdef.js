import { timerListDevice, showToast, showConfirm } from '@PluginInterface';

/**
 * @description 自定义函数，根据status.customize的取值选择插入方式
 * @returns {Object} identifier对应的自定义函数
 */
export const customizeFunction = {
  AppTimer: ({ rootState }) => {
    const mac = rootState.control.mac;
    try {
      timerListDevice(mac);
    } catch (e) {
      console.log('%c running timerListDevice()', 'color: blue');
    }
  },
  ConstUD: ({ dispatch }, currentStatusName) => {
    const goSweep = id => {
      window.myvm.$router.push({
        name: 'SweepConst',
        params: { id }
      });
    };
    if (!['undefined', undefined].includes(currentStatusName)) {
      goSweep(2);
      return;
    }
    const storage = window.storage;
    const funcData = storage.get('funcData') || {};
    if (funcData.ConstUD) {
      dispatch('STATE_MACHINE_INTERFACE', { SwUpDn: funcData.ConstUD }, { root: true });
    } else goSweep(2);
  },
  ConstLR: ({ dispatch }, currentStatusName) => {
    const goSweep = id => {
      window.myvm.$router.push({
        name: 'SweepConst',
        params: { id }
      });
    };
    if (!['undefined', undefined].includes(currentStatusName)) {
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
  BottomSleep: (_, currentStatusName) => {
    switch (currentStatusName) {
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
  'BottomSleep(ordinary)': (_, currentStatusName) => {
    switch (currentStatusName) {
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
  NoiseSet: ({ commit }) => {
    runPageMethod({ commit }, 'Noise');
  },
  EnvAreaSt: ({ commit }) => {
    runPageMethod({ commit }, 'AreaFan');
  },
  CleanState: async ({ commit, dispatch }, currentStatusName, nextStatusName) => {
    const switchClean = value => {
      dispatch('SEND_DATA', { AutoClean: value }, { root: true });
      commit('control/SET_DATA_OBJECT', { CleanState: value }, { root: true });
    };
    let value = 0;
    let res = true;
    nextStatusName === 'status_1' && (value = 1);
    value || (res = await showConfirm('提示', '是否退出自清洁功能？'));
    res && switchClean(value);
  },
  SwingUD: () => {
    const storage = window.storage;
    const sweepSetting = storage.get('sweepSetting') || {};
    if (!sweepSetting.SwingUD) {
      showToast('部分内机可能不支持此功能', 0);
      sweepSetting.SwingUD = 1;
      storage.set('sweepSetting', sweepSetting);
    }
  },
  SwingLR: () => {
    const storage = window.storage;
    const sweepSetting = storage.get('sweepSetting') || {};
    if (!sweepSetting.SwingLR) {
      showToast('部分内机可能不支持此功能', 0);
      sweepSetting.SwingLR = 1;
      storage.set('sweepSetting', sweepSetting);
    }
  }
};

/**
 * @description 自定义初始化函数，如果存在此identifier，里面的内容会在初始化的时候执行
 * @returns {Object} identifier对应的自定义初始化函数
 */
export const customizeInit = {
  Demo: () => {
    console.log('run Demo init');
  },
  AppTimer: () => {
    // console.log('放开注释，执行自定义初始化函数，打印这句话');
  }
};

/**
 * @description 缓存信息
 * @returns {Object} identifier对应的缓存信息，当对应的状态切换时会执行缓存
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

/**
 * @description 执行二级页面内方法
 * @param {Object} { commit } Vuex的commit方法
 * @param {String} routerName 路由名称
 */
async function runPageMethod({ commit }, routerName) {
  // 加载对应页面
  commit('control/SET_STATE', { hiddenComponent: routerName }, { root: true });
  // 获取对应组件内容
  const hiddenComponent = window.myvm.$children[0].$refs.hiddenComponent;
  // 获取需要执行的方法
  const defaultFunction = await hiddenComponent.getFunc();
  // 执行二级页面内部方法
  defaultFunction();
}
