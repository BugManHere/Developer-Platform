import { mapState, mapMutations, mapActions } from 'vuex';
import LogicDefine from './define';

const LogicWatch = {
  mixins: [LogicDefine],
  computed: {
    ...mapState({
      watchLock: state => state.watchLock,
    })
  },
  watch: {
    g_outputMap: {
      handler(newVal) {
        if (newVal) {
          this.setDataObject({ ...newVal });
        }
      },
      deep: true,
      immediate: true
    },
    // 当前状态的信息
    g_statusMap: {
      handler(newVal, oldVal) {
        if (this.watchLock || !(oldVal && Object.keys(oldVal).length)) return;
        // 存储改变的状态
        const stateArr = [];
        for (const item in newVal) {
          if (item) {
            // push state
            newVal[item].status !== oldVal[item].status &&
              stateArr.push(`${item}_${newVal[item].status}`);
          }
        }
        // 输入: state
        stateArr.forEach(item => {
          this.g_checkLogic(item);
        });
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(map) {
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    /**
     * @description 检查互斥
     */
    g_checkLogic(state) {
      if (this.g_excludeMap[state] && this.g_excludeMap[state].length) {
        const itemLogicMap = this.g_excludeMap[state];
        itemLogicMap.forEach(item => {
          const id = this.g_stateToId[item];
          if (!id) return;
          const currentStatus = this.g_statusMap[id].status;
          // item为需要互斥的state currentState为当前state
          const currentState = `${id}_${currentStatus}`;
          item === currentState && this.g_defaultStatusMap[id] && this.g_runLogic(id);
        });
      }
    },
    /**
     * @description 执行互斥
     */
    g_runLogic(id) {
      const setData = this.g_defaultStatusMap[id].setData;
      this.changeData(setData);
    }
  }
};

export default LogicWatch;
