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
import { mapGetters } from 'vuex';
import { Row, Col } from 'gree-ui';
import BtnContent from './btn/index';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    'btn-content': BtnContent
  },
  computed: {
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
        const statusName = status.name;
        const stateName = `${defaultNameKey}_${statusName}`;
        const name = stateName === this.$language(stateName) ? this.$language(defaultNameKey) : this.$language(stateName);
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
  padding: 0 $padding calc(#{$footerHeight} + #{$padding} + env(safe-area-inset-bottom)) $padding;
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
    padding: 0 $boxPadding;
  }
}
</style>
