<template>
  <gree-popup v-model="showPopup" position="bottom">
    <BtnPopup :showPopup="showPopup" :title="'模式'" :btn-list="btnList" />
  </gree-popup>
</template>

<script>
import { Popup } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import BtnPopup from './index';
import LogicDefine from '@logic/define';
import Customize from '@logic/customize';

export default {
  mixins: [LogicDefine, Customize],
  components: {
    BtnPopup,
    [Popup.name]: Popup
  },
  data() {
    return {
      showPopup: false,
      modStatusList: [], // 模式的顺序
      currentStatus: '', // 当前状态
      lastStatus: '' // 上一个状态
    };
  },
  computed: {
    ...mapState({
      modKey: state => state.modKey,
      dataObject: state => state.dataObject,
      value: state => state.dataObject.Mod,
      ModPopup: state => state.dataObject.ModPopup
    }),
    // 模式的定义
    modDefine() {
      return this.g_funcDefine_inertia.find(module => module.type === `inertia-${this.modKey}`);
    },
    // 模式的定义
    modId() {
      if (this.modDefine) return this.modDefine.identifier;
      return 'Mod';
    },
    // 按钮列表
    btnList() {
      const modKey = this.modId;
      const result = this.modStatusList.map(modStatus => {
        // status定义
        const statusDefine = this.modDefine.statusDefine[modStatus];
        // 定义key
        const key = modStatus;
        // 名称
        const statusName = statusDefine.name;
        const stateName = `${modKey}_${statusName}`;
        const name = this.$language(`mod.${stateName}`);
        // 图标
        const icon = {
          key: statusDefine.icon.key,
          type: this.currentStatus === modStatus ? 'on' : 'off'
        };
        // 是否置灰
        const gray = false;
        // 是否隐藏
        const hide = false;
        // 跳转页面
        const page = false;
        // 执行的函数
        const func = (modStatus, disable = false) => {
          this.changeStatus(modStatus, disable || this.currentStatus === modStatus);
        };
        return { key, name, icon, gray, hide, page, func };
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
    g_statusLoop: {
      handler(newVal) {
        const startStatus = 'default';
        if (!this.modDefine) return;
        const id = this.modId;
        const modLoop = newVal[id];
        if (modLoop) {
          const result = JSON.parse(JSON.stringify(newVal[id]));
          const length = result.length;
          let i = 0;
          while (result[0] !== startStatus && i < length) {
            result.push(result.shift());
            i += 1;
          }
          this.modStatusList = result;
        }
      },
      deep: true,
      immediate: true
    },
    g_statusMap: {
      handler(newVal) {
        const statusMap = newVal[this.modId];
        if (statusMap && this.currentStatus !== statusMap.status) {
          this.lastStatus = this.currentStatus;
          this.currentStatus = statusMap.status;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    // 发送指令
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    changeStatus(status, isGray) {
      if (isGray) return;
      const funcDefine = this.modDefine;
      const statusDefine = funcDefine.statusDefine[status];
      const identifier = funcDefine.identifier;
      const currentStatus = this.currentStatus;
      const customize = statusDefine.customize;
      // 执行自定义函数 'before'
      switch (customize) {
        case 'replace':
          this.customizeFunc(identifier, currentStatus, status);
          return;
        case 'before':
          this.customizeFunc(identifier, currentStatus, status);
          break;
        case 'after':
          setTimeout(() => {
            this.customizeFunc(identifier, currentStatus, status);
          }, 0);
          break;
        default:
          break;
      }
      const moreCommand = statusDefine.moreCommand;
      const json = funcDefine.json;
      const value = statusDefine.value;
      let setData = moreCommand || {};
      setData[json] = value;
      // 发送指令前缓存数据
      const dataObject = JSON.parse(JSON.stringify(this.dataObject));
      // 发送指令
      this.changeData(setData);
      this.cacheData(dataObject);
    },
    cacheData(dataObject) {
      const isCacheTem = this.g_moreOption.temCache;
      const isCacheFan = this.g_moreOption.fanCache;
      const storage = window.storage;
      const cache = (able, storageKey, jsons) => {
        if (able) {
          const data = storage.get(storageKey) || {};
          const sendData = data[this.currentStatus] || {};
          const lastData = {};
          jsons.forEach(json => {
            lastData[json] = dataObject[json] || 0;
          });
          data[this.lastStatus] = lastData;
          storage.set(storageKey, data);
          this.changeData(sendData);
        }
      };
      setTimeout(() => {
        this.$nextTick(() => {
          cache(isCacheTem, 'temSetting', ['SetTem', 'Add0.5', 'Add0.1']);
          cache(isCacheFan, 'fanSetting', ['WdSpd', 'Tur', 'Quiet']);
        });
      }, 0);
    }
  }
};
</script>
