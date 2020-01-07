import LogicPort from './port';

const LogicDefine = {
  mixins: [LogicPort],
  data() {
    return {
      g_outputMap: {},
      g_funcDefine: [],
      g_logicMap: {},
      g_disableMap: {}
    };
  },
  mounted() {
    const { key } = require('@/../plugin.id.json');
    const { funcDefine, logicMap, disableMap } = require(`@/../../../output/${key}.json`);
    this.g_funcDefine = funcDefine;
    this.g_logicMap = JSON.parse(logicMap.json);
    this.g_disableMap = JSON.parse(disableMap.json);
    this.g_outputMap = this.g_init();
  },
  computed: {
    g_funcDefine_btn() {
      return this.g_funcDefine.filter(item => {
        return item.type === 'btn';
      });
    },
    /**
     * @description g_funcDefine的map版本
     * @return Object {identifier: func}
     */
    g_identifierArr() {
      const result = this.g_funcDefine.map(item => item.identifier);
      return result;
    },
    /**
     * @description g_funcDefine的map版本
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
        const order = Object.keys(funcItem.statusDefine);
        result[key] = {};
        order.forEach(statusName => {
          if (statusName === 'undefined') return;
          const val = funcItem.statusDefine[statusName].value;
          const beforeStatus = result[key][val];
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
              isCurrent && (result[key][val] = statusName);
            } else {
              currentType === 2 && (result[key][val] = statusName);
            }
          } else {
            result[key][val] = statusName;
          }
        });
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
        result[id] = {
          status,
          state,
          define
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
        const order = funcItem.order;
        ['undefined', 'default', ...order].forEach(item => {
          const state = `${funcItem.identifier}_${item}`;
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
     * @description 禁用的state列表
     * @return Array: [state]
     */
    g_disaleStateArr() {
      const result = [];
      this.g_identifierArr.forEach(id => {
        const status = this.g_statusMap[id].status;
        const state = `${id}_${status}`;
        if (this.g_disableMap[state]) {
          result.push(...this.g_disableMap[state]);
        }
      });
      return result;
    },
    /**
     * @description 禁用的function列表
     * @return Array: [identifier]
     */
    g_disableFuncArr() {
      const result = [];
      this.g_funcDefine.forEach(item => {
        const identifier = item.identifier;
        const stateOrder = item.order.map(item => `${identifier}_${item}`);
        if (this.g_checkDisable(stateOrder, this.g_disaleStateArr)) {
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
        while (
          ![len - 1, -1].includes(currentIndex) &&
          order[currentIndex + index] &&
          status === 'default'
        ) {
          const statusName = order[currentIndex + index];
          const state = `${item.identifier}_${statusName}`;
          !this.g_disaleStateArr.includes(state) && (status = order[currentIndex + index]);
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
    }
  },
  methods: {
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
    g_checkDisable(stateArr, disableArr) {
      let result = true;
      if (stateArr && disableArr) {
        stateArr.forEach(item => {
          !disableArr.includes(item) && (result = false);
        });
      }
      return result;
    }
  }
};

export default LogicDefine;
