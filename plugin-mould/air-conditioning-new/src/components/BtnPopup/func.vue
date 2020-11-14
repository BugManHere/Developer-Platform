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
      Pow: state => state.dataObject.Pow,
      FuncPopup: state => state.dataObject.FuncPopup
    }),
    ...mapGetters(['buttonDefine']),
    ...mapGetters('machine', ['statusMap', 'noDirectionModelArr']),
    // 按钮列表
    btnList() {
      const result = this.buttonDefine.map(btn => {
        const identifier = btn.identifier;
        // 当前status定义
        const status = this.statusMap[identifier].status;
        // 取名称
        const defaultNameKey = `btn.${identifier}`;
        const statusName = status.name;
        const stateName = `${defaultNameKey}_${statusName}`;
        const name = stateName === this.$language(stateName) ? this.$language(defaultNameKey) : this.$language(stateName);
        // 图标
        const icon = glyphs.some(item => item.font_class === status.icon.key) ? status.icon : { key: 'undefined', type: 'off' };
        // 是否置灰
        const gray = this.noDirectionModelArr.includes(identifier);
        // 是否隐藏
        const hide = status.icon.key === 'disable';
        // 跳转页面
        const page = btn.page;
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
    ...mapMutations('control', {
      setDataObject: 'SET_DATA_OBJECT'
    })
  },
  destroyed() {
    this.setDataObject({ FuncPopup: 0 });
  }
};
</script>
