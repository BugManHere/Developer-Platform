<template>
  <gree-popup v-model="showPopup" position="bottom">
    <BtnPopup :showPopup="showPopup" :title="'模式'" :btn-list="btnList" />
  </gree-popup>
</template>

<script>
import { Popup } from 'gree-ui';
import { mapState, mapMutations, mapGetters } from 'vuex';
import BtnPopup from './index';
import { types } from '@/store/types';

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
    this.getLoop();
  },
  computed: {
    ...mapState('control', {
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
        const statusNameText = status.name;
        const stateNameText = this.$language(`mod.${this.modIdentifier}_${statusNameText}`);
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
        return { key: modStatusName, name: stateNameText, icon, gray, hide, page, func };
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
    ...mapMutations({
      setDataObject: types.SET_DATA_OBJECT
    }),
    getLoop() {
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
    }
  }
};
</script>
