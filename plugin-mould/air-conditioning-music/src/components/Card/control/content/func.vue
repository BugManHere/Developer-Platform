<template>
  <div class="func-content">
    <div class="func-content-header" v-text="'高级功能'" />
    <div class="func-content-box">
      <btn-content :btn-list="btnList" />
    </div>
  </div>
</template>

<script>
import { glyphs } from '@assets/iconfont/iconfont.json';
import { mapMutations, mapActions } from 'vuex';
import { Row, Col } from 'gree-ui';
import BtnContent from './btn/index';
import WorkLogic from '@logic/work';
import Customize from '@logic/customize';

export default {
  mixins: [WorkLogic, Customize],
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    'btn-content': BtnContent
  },
  computed: {
    // 按钮列表
    btnList() {
      const result = this.work_buttonDefine.map(btn => {
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

<style lang="scss">
$fontSize: 44px;
$padding: 66px;
.func-content {
  position: relative;
  height: auto;
  background-color: #fff;
  font-size: $fontSize;
  padding: 0 $padding;
  &-header {
    padding: 52px 0px 0 8px;
    border-top: 1px solid rgba(238, 238, 238, 1);
    color: rgba(64, 70, 87, 1);
    font-size: 48px;
  }
  &-box {
    $boxPadding: 32px;
    width: calc(100vw - #{$boxPadding * 2});
    position: relative;
    left: -$padding;
    padding: 0 32px;
  }
}
</style>
