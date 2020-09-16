import { mapMutations } from 'vuex';
import LogicPort from './port';

const LogicDefine = {
  mixins: [LogicPort],
  data() {
    return {
      g_moreOption: {}, // 更多配置项
      g_outputMap: {}, // 更多配置项
      g_funcDefine: [], // 功能定义
      g_excludeMap: {}, // 排斥关系
      g_hideMap: {}, // 隐藏关系
      g_hideState: '[]', // 被隐藏的state，在watch.js里面有赋值
      g_deviceName: undefined, // 设备名称
      g_mid: '' // mid
    };
  },
  mounted() {
    const { key } = require('@/../plugin.id.json'); // 配置key
    const { funcDefine, excludeMap, hideMap, moreOption, productModel, deviceName } =
      process.env.NODE_ENV === 'development' ? window.storage.get('config') : require(`@/../../../output/${key}.json`); // 获取配置
    this.g_deviceName = deviceName; // 设备名称
    this.g_moreOption = moreOption; // 更多配置项
    this.g_funcDefine = funcDefine; // 功能定义
    // String转为Number
    funcDefine.forEach((module, index) => {
      const statusDefine = {};
      Object.keys(module.statusDefine).forEach(statusName => {
        statusDefine[statusName] = module.statusDefine[statusName];
        statusDefine[statusName].value = Number(statusDefine[statusName].value);
        if (module.statusDefine[statusName].moreCommand) {
          Object.keys(module.statusDefine[statusName].moreCommand).forEach(json => {
            statusDefine[statusName].moreCommand[json] = Number(statusDefine[statusName].moreCommand[json]);
          });
        }
      });
      this.g_funcDefine[index].statusDefine = statusDefine;
    });
    this.g_excludeMap = excludeMap; // 排斥关系
    this.g_hideMap = hideMap; // 隐藏关系
    this.g_mid = productModel; // mid

    this.$store.state.devOptions.statueJson2 === '[]' &&
      this.setState({
        devOptions: {
          pluginVer: moreOption.pluginVer,
          mid: productModel,
          statueJson: JSON.stringify(moreOption.statueJson),
          statueJson2: JSON.stringify(moreOption.statueJson2),
          identifierArr: this.$store.state.devOptions.identifierArr
        }
      });
    this.g_outputMap = this.g_init();
  },
  computed: {
    g_funcDefine_btn() {
      return this.g_funcDefine.filter(module => {
        return module.type === 'active';
      });
    },
    /**
     * @description g_funcDefine的identifier
     * @return Array [identifier]
     */
    g_identifierArr() {
      const result = this.g_funcDefine.map(module => module.identifier);
      return result;
    },
    /**
     * @description g_funcDefine的对象版本
     * @return Object {identifier: module}
     */
    g_funcDefineMap() {
      const result = {};
      this.g_funcDefine.forEach(module => {
        const id = module.identifier;
        result[id] = module;
      });
      return result;
    },
    /**
     * @description g_hideMap的反义，根据被隐藏的state获取state
     * @return Object {state: [state]}
     */
    g_hideMapReverse() {
      const result = {};
      Object.keys(this.g_hideMap).forEach(state => {
        // 提取被隐藏的state
        this.g_hideMap[state].forEach(hideState => {
          result[hideState] ? result[hideState].push(state) : (result[hideState] = [state]);
        });
      });
      return result;
    },
    /**
     * @description 根据identifier与value获取当前status
     * @return Object {identifier: {value: status}}
     */
    g_valToStatusMap() {
      const result = {};
      this.g_funcDefine.forEach(module => {
        const id = module.identifier;
        result[id] = this.g_getStatusName(module, true);
      });
      return result;
    },
    /**
     * @description 根据identifier与value获取当前status（没经过隐藏处理）
     * @return Object {identifier: {value: status}}
     */
    g_valToRealStatus() {
      const result = {};
      this.g_funcDefine.forEach(module => {
        const id = module.identifier;
        result[id] = this.g_getStatusName(module, false);
      });
      return result;
    },
    /**
     * @description 根据identifier获取当前状态的更多信息
     * @return Object: {identifier: {status, state, define}}
     */
    g_statusMap() {
      const result = {};
      this.g_funcDefine.forEach(module => {
        const id = module.identifier;
        const json = module.json;
        const currentVal = this.g_inputMap[json];
        let status = this.g_valToStatusMap[id][currentVal];
        let define = module.statusDefine[status];
        if (!define) {
          status = 'default';
          define = module.statusDefine[status];
        }
        const state = `${id}_${status}`;
        const realStatus = this.g_valToRealStatus[id][currentVal];
        const realState = `${id}_${realStatus}`;
        const realDefine = module.statusDefine[realStatus];
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
      this.g_funcDefine.forEach(module => {
        Object.keys(module.statusDefine).forEach(statusItem => {
          const state = `${module.identifier}_${statusItem}`;
          result[state] = module.identifier;
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
      this.g_funcDefine.forEach(module => {
        const id = module.identifier;
        const json = module.json;
        const defaultStatus = module.statusDefine.default;
        const moreCommand = define.moreCommand;
        let setData = moreCommand || {};
        setData[json] = defaultStatus.value;
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
     * @description status循环
     * @return Object: {identifier: [status]}
     */
    g_statusLoop() {
      const result = {};
      // 设定规则，undefined不能被指向，会被重新指向为default
      const rule = status => {
        let result = status || 'default';
        result === 'undefined' && (result = 'default');
        return result;
      };
      // 遍历功能，提取status关系
      this.g_funcDefine.forEach(module => {
        const id = module.identifier;
        const map = module.map; // 指向关系
        let status = this.g_statusMap[id].status; // function的当前status
        const statusArr = []; // status顺序数组形式
        const checkStatusArr = []; // 已检查的状态
        if (map) {
          let directionStatus = rule(map[status]); // status指向
          // 再次指向原点时推出，形成闭环
          while (!checkStatusArr.includes(directionStatus)) {
            status = directionStatus; // 下一个status
            const state = `${id}_${status}`;
            this.g_hideStateArr.includes(state) || statusArr.push(directionStatus); // 按顺序存入数组
            checkStatusArr.push(directionStatus); // 按顺序存入数组
            directionStatus = rule(map[status]) || 'default'; // 更新status指向
          }
        } else {
          statusArr.push(status);
        }
        result[id] = statusArr;
      });
      return result;
    },
    /**
     * @description function的当前指向status
     * @return Object: {identifier: status}
     */
    g_statusDirectionMap() {
      const result = {};
      // 遍历功能，提取function当前指向status
      this.g_identifierArr.forEach(id => {
        const directionStatus = this.g_statusLoop[id].find(status => {
          const state = `${id}_${status}`; // 获取指向state
          return !this.g_hideStateArr.includes(state); // 如果没被隐藏，则返回
        });
        result[id] = directionStatus || this.g_statusMap[id].status; // 如果都被隐藏， 则返回当前status
      });
      return result;
    },
    /**
     * @description 没有指向的function
     * @return Array: [identifier]
     */
    g_noDirectionFuncArr() {
      const result = this.g_identifierArr.filter(id => {
        const currentStatus = this.g_statusMap[id].status; // function的当前status
        const directionStatus = this.g_statusDirectionMap[id]; // function的指向status
        return currentStatus === directionStatus;
      });
      return result;
    },
    /**
     * @description 输入被隐藏的function的identifier，返回参与隐藏的function的identifier
     * @return Object: {identifier: {state: state}}
     */
    g_hideByStateMap() {
      const result = {};
      this.g_noDirectionFuncArr.forEach(id => {
        const statusArr = this.g_statusLoop[id]; // 获取status指向数组
        result[id] = {};
        if (statusArr.length >= 1) {
          // 轮询每个states指向
          statusArr.forEach(status => {
            const state = `${id}_${status}`;
            const stateArr = this.g_hideMapReverse[state];
            stateArr && (result[id] = { ...result[id], [state]: stateArr });
          });
        }
      });
      return result;
    },
    /**
     * @description 当前状态的下一状态列表
     * @return Object: {identifier: {status, define, json, setData, customize}}
     */
    g_nextStatusMap() {
      const result = {};
      this.g_funcDefine.forEach(module => {
        const id = module.identifier;
        const json = module.json;
        let status = this.g_statusDirectionMap[id]; // function的指向status
        let define = module.statusDefine[status];
        if (!define) {
          status = 'default';
          define = module.statusDefine[status];
        }
        const customize = define.customize;
        const moreCommand = define.moreCommand;
        let setData = moreCommand || {};
        setData[json] = define.value;
        result[id] = {
          status,
          json,
          define,
          setData,
          customize
        };
      });
      return result;
    },
    // 所有功能的JSON字段
    g_jsonArr() {
      const arr = [];
      this.g_funcDefine.forEach(module => {
        Object.keys(module.statusDefine).forEach(statusItem => {
          statusItem === 'undefined' || module.statusDefine[statusItem].customize === 'replace' || arr.includes(module.json) || arr.push(module.json);
          if (module.statusDefine[statusItem].moreCommand) {
            Object.keys(module.statusDefine[statusItem].moreCommand).forEach(moreJson => {
              arr.includes(moreJson) || arr.push(moreJson);
            });
          }
        });
      });
      return arr;
    }
  },
  methods: {
    ...mapMutations({
      setState: 'SET_STATE'
    }),
    g_init() {
      const result = {};
      this.g_funcDefine.forEach(module => {
        const key = module.json;
        const keyToVal = {};
        if (!(key in { ...this.g_inputMap, ...keyToVal })) {
          const defaultVal = module.statusDefine.default.value;
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
     * @description 获取function的status
     * @input module: 功能， isHide： 是否考虑被隐藏的state
     * @return Object {value: status}
     */
    g_getStatusName(module, isHide = false) {
      const result = {};
      const hideState = JSON.parse(this.g_hideState); // 获取被隐藏的state
      const key = module.identifier;
      const statusKeys = Object.keys(module.statusDefine);
      // result[key] = {};
      statusKeys.forEach(statusName => {
        if (statusName === 'undefined') return;
        const state = `${key}_${statusName}`;
        if (isHide && hideState.includes(state)) {
          // 被隐藏的state不参与计算
          return;
        }
        const val = module.statusDefine[statusName].value;
        const beforeStatus = result[val];
        // 是否存在同源状态（JSON取值相等）
        if (beforeStatus) {
          const commandBefore = module.statusDefine[beforeStatus].moreCommand;
          const commandCurrent = module.statusDefine[statusName].moreCommand;
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
