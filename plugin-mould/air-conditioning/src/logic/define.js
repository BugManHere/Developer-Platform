import { mapMutations } from 'vuex';
import LogicPort from './port';

const LogicDefine = {
  mixins: [LogicPort],
  data() {
    return {
      g_moreOption: {},
      g_outputMap: {},
      g_funcDefine: [],
      g_excludeMap: {},
      g_hideMap: {},
      g_hideState: '[]',
      g_deviceName: undefined,
      g_mid: ''
    };
  },
  mounted() {
    const { key } = require('@/../plugin.id.json'); // 配置key
    const isLocalConfig = process.env.VUE_APP_MODE === 'local'; // localconfig模式下强制启用本地配置
    const isServeConfig = process.env.NODE_ENV === 'development'; // 如果是development环境，获取线上配置
    const getLocalConfig = () => {
      return isLocalConfig && require(`@/../../../output/${key}.json`);
    };
    const getServeConfig = () => {
      return isServeConfig ? window.storage.get('config') : require(`@/../../../output/${key}.json`);
    };

    const { funcDefine, excludeMap, hideMap, moreOption, productModel, deviceName } = getLocalConfig() || getServeConfig();

    this.g_deviceName = deviceName; // 设备名称
    this.g_moreOption = moreOption;
    this.g_funcDefine = funcDefine;
    this.g_excludeMap = excludeMap;
    this.g_hideMap = hideMap;
    this.g_mid = productModel;

    this.$store.state.devOptions.statueJson2 === '[]' &&
      this.setState([
        'devOptions',
        {
          pluginVer: moreOption.pluginVer,
          mid: productModel,
          statueJson: JSON.stringify(moreOption.statueJson),
          statueJson2: JSON.stringify(moreOption.statueJson2),
          identifierArr: this.$store.state.devOptions.identifierArr
        }
      ]);
    this.g_outputMap = this.g_init();
  },
  computed: {
    g_funcDefine_btn() {
      return this.g_funcDefine.filter(module => module.type.includes('active'));
    },
    /**
     * @description g_funcDefine的identifier
     * @return Array [identifier]
     */
    g_identifierArr() {
      const result = this.g_funcDefine.map(item => item.identifier);
      return result;
    },
    /**
     * @description g_funcDefine的对象版本
     * @return Object {identifier: func}
     */
    g_funcDefineMap() {
      const result = {};
      this.g_funcDefine.forEach(item => {
        const id = item.identifier;
        result[id] = item;
      });
      return result;
    },
    /**
     * @description 根据identifier与value获取当前伪状态
     * @return Object {identifier: {value: status}}
     */
    g_valToStatus() {
      const result = {};
      this.g_funcDefine.forEach(funcItem => {
        const key = funcItem.identifier;
        result[key] = this.g_getStatus(funcItem, true);
      });
      return result;
    },
    /**
     * @description 根据identifier与value获取当前伪状态（没经过隐藏处理）
     * @return Object {identifier: {value: status}}
     */
    g_valToRealStatus() {
      const result = {};
      this.g_funcDefine.forEach(funcItem => {
        const key = funcItem.identifier;
        result[key] = this.g_getStatus(funcItem, false);
      });
      return result;
    },
    /**
     * @description 根据identifier获取当前状态的更多信息
     * @return Object: {identifier: {status, state, define}}
     */
    g_statusMap() {
      const result = {};
      this.g_funcDefine.forEach(item => {
        const id = item.identifier;
        const json = item.json;
        const currentVal = this.g_inputMap[json];
        const status = this.g_valToStatus[id][currentVal];
        const state = `${id}_${status}`;
        const define = item.statusDefine[status];
        const realStatus = this.g_valToRealStatus[id][currentVal];
        const realState = `${id}_${realStatus}`;
        const realDefine = item.statusDefine[realStatus];
        result[id] = {
          status,
          state,
          define,
          realStatus,
          realState,
          realDefine
        };
      });
      return result;
    },
    /**
     * @description identifier_status对应的identifier
     * @return Object: {state: identifier}
     */

    g_stateToId() {
      const result = {};
      this.g_funcDefine.forEach(funcItem => {
        Object.keys(funcItem.statusDefine).forEach(statusItem => {
          const state = `${funcItem.identifier}_${statusItem}`;
          result[state] = funcItem.identifier;
        });
      });
      return result;
    },
    /**
     * @description 功能的默认状态（被互斥后执行的状态）
     * @return Object: {identifier: {status, json, define}}
     */
    g_defaultStatusMap() {
      const result = {};
      this.g_funcDefine.forEach(item => {
        const id = item.identifier;
        const json = item.json;
        const defaultStatus = item.statusDefine.default;
        let setData = {};
        const moreCommand = defaultStatus.moreCommand;
        moreCommand && (setData = moreCommand);
        setData[json] = Number(defaultStatus.value);
        result[id] = {
          setData,
          json,
          define: defaultStatus
        };
      });
      return result;
    },
    /**
     * @description 隐藏的state列表
     * @return Array: [state]
     */
    g_hideStateArr() {
      const result = [];
      this.g_identifierArr.forEach(id => {
        const status = this.g_statusMap[id].status;
        const state = `${id}_${status}`;
        if (this.g_hideMap[state]) {
          result.push(...this.g_hideMap[state]);
        }
      });
      return result;
    },
    /**
     * @description 隐藏的function列表
     * @return Array: [identifier]
     */
    g_hideFuncArr() {
      const result = [];
      this.g_funcDefine.forEach(item => {
        const identifier = item.identifier;
        const stateOrder = item.order.map(item => `${identifier}_${item}`);
        if (this.g_checkHide(stateOrder, this.g_hideStateArr)) {
          result.push(identifier);
        }
      });
      return result;
    },
    /**
     * @description 当前状态的下一状态列表
     * @return Object: {identifier: {status, define, json, setData, customize}}
     */
    g_NextStatusMap() {
      const result = {};
      this.g_funcDefine.forEach(item => {
        const id = item.identifier;
        const json = item.json;
        const order = ['default', ...item.order];
        const len = order.length;
        const currentStatus = this.g_statusMap[id].status;
        const currentIndex = order.indexOf(currentStatus);
        let status = 'default';
        let index = 1;
        while (![len - 1, -1].includes(currentIndex) && order[currentIndex + index] && status === 'default') {
          const statusName = order[currentIndex + index];
          const state = `${item.identifier}_${statusName}`;
          !this.g_hideStateArr.includes(state) && (status = order[currentIndex + index]);
          index += 1;
        }
        // if (![len - 1, -1].includes(currentIndex)) {
        //   status = order[currentIndex + 1];
        // }
        const define = item.statusDefine[status];
        let setData = {};
        const moreCommand = define.moreCommand;
        const customize = define.customize;
        moreCommand && (setData = moreCommand);
        setData[json] = define.value;
        result[id] = {
          status,
          define,
          json,
          setData,
          customize
        };
      });
      return result;
    },
    // 登记的所有功能的JSON字段
    jsonArr() {
      const arr = [];
      this.g_funcDefine.forEach(item => {
        Object.keys(item.statusDefine).forEach(statusItem => {
          statusItem === 'undefined' || item.statusDefine[statusItem].customize === 'replace' || arr.includes(item.json) || arr.push(item.json);
          if (item.statusDefine[statusItem].moreCommand) {
            Object.keys(item.statusDefine[statusItem].moreCommand).forEach(moreJson => {
              arr.includes(moreJson) || arr.push(moreJson);
            });
          }
        });
      });
      return arr;
    },
    /**
     * @description 开关机下隐藏的图标
     * @return Array
     */
    powHideArr() {
      const result = [];
      const checkIdArr = []; // 需要检查的id
      const identifier = this.g_Pow; // 获取在define.js里面定义的g_Pow
      const powState = this.g_statusMap[identifier].state; // pow的当前状态
      const hideStateArr = this.g_hideMap[powState]; // 被pow隐藏的State
      if (!hideStateArr) return [];
      hideStateArr.forEach(stateItem => {
        // 挑选出需要检查的id
        const checkId = this.g_stateToId[stateItem];
        checkId && (checkIdArr.includes(checkId) || checkIdArr.push(checkId));
      });
      checkIdArr.forEach(idItem => {
        let pass = true; // 是否满足条件
        const checkOrder = this.g_funcDefineMap[idItem].order; // id对应激活的status
        checkOrder.forEach(statusItem => {
          // order下的所有status是否都被隐藏
          const checkState = `${idItem}_${statusItem}`;
          !hideStateArr.includes(checkState) && (pass = false);
        });
        pass && result.push(idItem); // 如满足条件，记下
      });
      return result;
    }
  },
  methods: {
    ...mapMutations({
      setState: 'SET_STATE'
    }),
    g_init() {
      const result = {};
      this.g_funcDefine.forEach(item => {
        const key = item.json;
        const keyToVal = {};
        if (!(key in { ...this.g_inputMap, ...keyToVal })) {
          const defaultVal = item.statusDefine.default.value;
          result[key] = defaultVal - 0;
          keyToVal[key] = defaultVal;
        }
      });
      return result;
    },
    /**
     * @description 获取对象之间的关系
     * @return Number 0.相离 1.相交 2.被包含 3.包含 4.相等
     */
    g_mapRelation(fromMap, toMap) {
      const fromMapKey = Object.keys(fromMap);
      const fromLen = fromMapKey.length;
      const toMapKey = Object.keys(toMap);
      const toLen = toMapKey.length;
      let num = 0;
      fromMapKey.forEach(item => {
        if (fromMap[item] === toMap[item]) {
          num += 1;
        }
      });
      if (!num) {
        return 0;
      } else if (fromLen - num) {
        if (num === toLen) return 3;
        return 1;
      } else if (fromLen < toLen) {
        return 2;
      }
      return 4;
    },
    /**
     * @description 获取对象之间的关系
     * @return Number 0.相离 1.相交 2.被包含 3.包含 4.相等
     */
    g_checkHide(stateArr, hideArr) {
      let result = true;
      if (stateArr && hideArr && stateArr.length && hideArr.length) {
        stateArr.forEach(item => {
          !hideArr.includes(item) && (result = false);
        });
      } else {
        return false;
      }
      return result;
    },
    g_getStatus(funcItem, isHide = false) {
      const result = {};
      const hideState = JSON.parse(this.g_hideState); // 获取被隐藏的state
      const key = funcItem.identifier;
      const order = Object.keys(funcItem.statusDefine);
      // result[key] = {};
      order.forEach(statusName => {
        if (statusName === 'undefined') return;
        const state = `${key}_${statusName}`;
        if (isHide && hideState.includes(state)) {
          // 被隐藏的state不参与计算
          return;
        }
        const val = funcItem.statusDefine[statusName].value;
        const beforeStatus = result[val];
        // 是否存在同源状态（JSON取值相等）
        if (beforeStatus) {
          const commandBefore = funcItem.statusDefine[beforeStatus].moreCommand;
          const commandCurrent = funcItem.statusDefine[statusName].moreCommand;
          const currentType = this.g_mapRelation(commandCurrent, this.g_inputMap);
          // 同源状态是否有moreCommand
          if (commandBefore) {
            const beforeType = this.g_mapRelation(commandBefore, this.g_inputMap); // 状态是否满足
            let isCurrent = false;
            // 判断两个同源状态之间的关系
            switch (this.g_mapRelation(commandCurrent, commandBefore)) {
              // 难点重点，看悟性了
              case 0:
              case 1:
                switch (currentType) {
                  case 0:
                    isCurrent = beforeType === 0;
                    break;
                  case 1:
                    isCurrent = beforeType !== 2;
                    break;
                  default:
                    isCurrent = true;
                    break;
                }
                break;
              case 2:
                switch (currentType) {
                  case 0:
                    isCurrent = beforeType === 0;
                    break;
                  case 2:
                    isCurrent = beforeType !== 2;
                    break;
                  default:
                    isCurrent = true;
                    break;
                }
                break;
              case 3:
                switch (currentType) {
                  case 1:
                    isCurrent = beforeType !== 2;
                    break;
                  default:
                    isCurrent = true;
                    break;
                }
                break;
              default:
                isCurrent = true;
                break;
            }
            isCurrent && (result[val] = statusName);
          } else {
            currentType === 2 && (result[val] = statusName);
          }
        } else {
          result[val] = statusName;
        }
      });
      return result;
    }
  }
};

export default LogicDefine;
