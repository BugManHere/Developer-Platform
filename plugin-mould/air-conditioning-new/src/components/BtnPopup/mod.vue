<template>
  <gree-popup v-model="showPopup" position="bottom">
    <BtnPopup :showPopup="showPopup" :title="'模式'" :btn-list="btnList" />
  </gree-popup>
</template>

<script>
import { Popup } from 'gree-ui';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import BtnPopup from './index';

export default {
  components: {
    BtnPopup,
    [Popup.name]: Popup
  },
  data() {
    return {
      showPopup: false,
      modStatusNameList: [], // 模式的顺序
      currentStatusName: '', // 当前状态
      lastStatusName: '' // 上一个状态
    };
  },
  mounted() {
    const startStatusName = 'default';
    if (!this.modDefine) return;
    const identifier = this.modIdentifier;
    const modLoop = this.statusLoop[identifier];
    if (modLoop) {
      const modStatusNameList = JSON.parse(JSON.stringify(this.statusLoop[identifier]));
      const length = modStatusNameList.length;
      let i = 0;
      while (modStatusNameList[0] !== startStatusName && i < length) {
        modStatusNameList.push(modStatusNameList.shift());
        i += 1;
      }
      this.modStatusNameList = modStatusNameList;
    }
  },
  computed: {
    ...mapState('control', {
      dataObject: state => state.dataObject,
      value: state => state.dataObject.Mod,
      ModPopup: state => state.dataObject.ModPopup
    }),
    ...mapGetters(['modDefine', 'modIdentifier', 'modCurrentStatusName']),
    ...mapGetters('machine', ['statusLoop']),
    // 按钮列表
    btnList() {
      const result = this.modStatusNameList.map(modStatusName => {
        // status定义
        const status = this.modDefine.statusDefine[modStatusName];
        // 名称
        const statusName = status.name;
        const stateName = `${this.modIdentifier}_${statusName}`;
        const name = this.$language(`mod.${stateName}`);
        // 图标
        const icon = {
          key: status.icon.key,
          type: this.currentStatusName === modStatusName ? 'on' : 'off'
        };
        // 是否置灰
        const gray = false;
        // 是否隐藏
        const hide = false;
        // 跳转页面
        const page = false;
        // 执行的函数
        const func = (modStatusName, disable = false) => {
          disable || this.$stateMachine.toStatus(this.modIdentifier, modStatusName);
        };
        return { key: modStatusName, name, icon, gray, hide, page, func };
      });
      return result;
    }
  },
  watch: {
    ModPopup(newVal) {
      if (newVal) {
        this.showPopup = true;
      } else {
        this.showPopup = false;
      }
    },
    showPopup(newVal) {
      if (!newVal) {
        this.setDataObject({ ModPopup: 0 });
      }
    },
    modCurrentStatusName: {
      handler(newVal) {
        if (newVal && this.currentStatusName !== newVal) {
          this.lastStatusName = this.currentStatusName;
          this.currentStatusName = newVal;
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('control', {
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions('control', {
      sendCtrl: 'SEND_CTRL'
    }),
    // 发送指令
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    cacheData(dataObject) {
      const isCacheTem = this.state_moreOption.temCache;
      const isCacheFan = this.state_moreOption.fanCache;
      const storage = window.storage;
      const cache = (able, storageKey, jsons) => {
        if (able) {
          const data = storage.get(storageKey) || {};
          const sendData = data[this.currentStatusName] || {};
          const lastData = {};
          jsons.forEach(json => {
            lastData[json] = dataObject[json] || 0;
          });
          data[this.lastStatusName] = lastData;
          storage.set(storageKey, data);
          this.changeData(sendData);
        }
      };
      setTimeout(() => {
        this.$nextTick(() => {
          // 此处作了特殊处理，应该去掉感叹号
          cache(!isCacheTem, 'temSetting', ['SetTem', 'Add0.5', 'Add0.1']);
          cache(!isCacheFan, 'fanSetting', ['WdSpd', 'Tur', 'Quiet']);
        });
      }, 0);
    }
  }
};
</script>
