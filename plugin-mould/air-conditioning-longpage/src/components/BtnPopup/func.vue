<template>
  <gree-popup v-model="showPopup" position="bottom">
    <BtnPopup :showPopup="showPopup" :title="'高级'" :btn-list="btnList" />
  </gree-popup>
</template>

<script>
import { Popup } from 'gree-ui';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { glyphs } from '@assets/iconfont/iconfont.json';
import BtnPopup from './index';
import { types } from '@/store/types';

export default {
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
    ...mapState('control', {
      FuncPopup: state => state.dataObject.FuncPopup
    }),
    ...mapGetters(['buttonDefine']),
    ...mapGetters('machine', ['statusMap', 'blindModelArr']),
    // 按钮列表
    btnList() {
      const result = this.buttonDefine.map(model => {
        const identifier = model.identifier;
        // 当前status定义
        const status = this.statusMap[identifier].status;
        // 取名称
        const defaultNameKey = `btn.${identifier}`;
        const statusNameText = status.name;
        const stateNameText = `${defaultNameKey}_${statusNameText}`;
        const name = stateNameText === this.$language(stateNameText) ? this.$language(defaultNameKey) : this.$language(stateNameText);
        // 图标
        const icon = glyphs.some(item => item.font_class === status.icon.key) ? status.icon : { key: 'undefined', type: 'off' };
        // 是否置灰
        const gray = this.blindModelArr.includes(identifier);
        // 是否隐藏
        const hide = status.icon.key === 'disable';
        // 跳转页面
        const page = model.page;
        // 执行的函数
        const func = (identifier, disable = false) => {
          disable || this.$stateMachine.nextStatus(identifier);
        };
        return { key: identifier, name, icon, gray, hide, page, func };
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
      setDataObject: types.SET_DATA_OBJECT
    })
  },
  destroyed() {
    this.setDataObject({ FuncPopup: 0 });
  }
};
</script>
