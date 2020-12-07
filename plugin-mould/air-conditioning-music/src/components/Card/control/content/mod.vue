<template>
  <div class="mod-content">
    <div class="mod-content-box" ref="content" :style="isMounted && { height: modUnfold ? `${contentHeight}px` : 0 }">
      <btn-content :btn-list="btnList" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import BtnContent from './btn/index';
import { types } from '@/store/types';

export default {
  components: {
    'btn-content': BtnContent
  },
  props: {
    modUnfold: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      contentHeight: 0,
      isMounted: false,
      modStatusNameList: [], // 模式的顺序
      currentStatusName: '', // 当前状态
      lastStatusName: '' // 上一个状态
    };
  },
  mounted() {
    const mountedTimer = setInterval(() => {
      this.contentHeight = this.$refs && this.$refs.content.clientHeight;
      if (this.contentHeight) {
        clearInterval(mountedTimer);
        this.isMounted = true;
      }
    }, 20);
    this.updateStatusNameList();
  },
  computed: {
    ...mapState('control', {
      Pow: state => state.dataObject.Pow
    }),
    ...mapGetters(['modDefine', 'modIdentifier', 'modCurrentStatusName']),
    ...mapGetters('machine', ['fakeStatusLoop', 'hideStateNameArr']),
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
        const gray = this.hideStateNameArr.includes(`${this.modIdentifier}_${modStatusName}`);
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
    updateStatusNameList() {
      const startStatusName = 'default';
      if (!this.modDefine) return;
      const identifier = this.modIdentifier;
      const modLoop = this.fakeStatusLoop[identifier];
      if (modLoop) {
        const result = JSON.parse(JSON.stringify(this.fakeStatusLoop[identifier]));
        const length = result.length;
        let i = 0;
        while (result[0] !== startStatusName && i < length) {
          result.push(result.shift());
          i += 1;
        }
        this.modStatusNameList = result;
      }
    }
  }
};
</script>

<style lang="scss">
$fontSize: 44px;
.mod-content {
  position: relative;
  transition: all 0.5s;
  &-box {
    position: relative;
    transition: all 0.5s;
    bottom: 0;
    background-color: #fff;
    font-size: $fontSize;
    padding: 0 32px;
    .col,
    .col-25 {
      padding: 20px 0 56px 0 !important;
    }
  }
}
</style>
