<template>
  <gree-popup v-model="showPopup" position="bottom">
    <BtnPopup :showPopup="showPopup" :title="'高级'" :btn-list="btnList" />
  </gree-popup>
</template>

<script>
import { Popup } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import BtnPopup from './index';
import LogicDefine from '@logic/define';
import Customize from '@logic/customize';
import { glyphs } from '@assets/iconfont/iconfont.json';

export default {
  mixins: [LogicDefine, Customize],
  components: {
    BtnPopup,
    [Popup.name]: Popup
  },
  data() {
    return {
      showPopup: false
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      FuncPopup: state => state.dataObject.FuncPopup
    }),
    // 按钮列表
    btnList() {
      const result = this.g_funcDefine_btn.map(btn => {
        // 定义key
        const key = btn.identifier;
        // 当前status定义
        const statusDefind = this.g_statusMap[key].define;
        // 取名称
        const defaultNameKey = `btn.${key}`;
        const statusName = statusDefind.name;
        const stateName = `${defaultNameKey}_${statusName}`;
        const name = stateName === this.$language(stateName) ? this.$language(defaultNameKey) : this.$language(stateName);
        // 图标
        const icon = glyphs.some(item => item.font_class === statusDefind.icon.key) ? statusDefind.icon : { key: 'undefined', type: 'off' };
        // 是否置灰
        const gray = this.g_noDirectionFuncArr.includes(key);
        // 是否隐藏
        const hide = statusDefind.icon.key === 'disable';
        // 跳转页面
        const page = btn.page;
        // 执行的函数
        const func = (identifier, isGray = false) => {
          this.changeStatus(identifier, isGray);
        };
        return { key, name, icon, gray, hide, page, func };
      });
      return result;
    }
  },
  watch: {
    FuncPopup(newVal) {
      if (newVal) {
        this.showPopup = true;
      }
    },
    showPopup(newVal) {
      if (!newVal) {
        this.setDataObject({ FuncPopup: 0 });
      }
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
    changeStatus(identifier, isGray) {
      if (isGray) return;
      const customize = this.g_nextStatusMap[identifier].customize;
      const currentStatus = this.g_statusMap[identifier].status; // 当前状态
      const nextStatus = this.g_nextStatusMap[identifier].status; // 下一状态
      // 执行自定义函数 'before'
      switch (customize) {
        case 'replace':
          this.customizeFunc(identifier, currentStatus, nextStatus);
          return;
        case 'before':
          this.customizeFunc(identifier, currentStatus, nextStatus);
          break;
        case 'after':
          setTimeout(() => {
            this.customizeFunc(identifier, currentStatus, nextStatus);
          }, 0);
          break;
        default:
          break;
      }
      // 八度制热需要特殊处理
      if (identifier === 'StHt') {
        this.setState(['isStHt', true]);
      } else {
        this.setState(['isStHt', false]);
      }
      const setData = this.g_nextStatusMap[identifier].setData;
      this.changeData(setData);
    },
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    }
  }
};
</script>
