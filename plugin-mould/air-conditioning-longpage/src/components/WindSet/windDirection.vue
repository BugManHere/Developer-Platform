<template>
  <!-- 风向设置 -->
  <div class="wind-direction-set wind-box">
    <!-- 标题 -->
    <div class="wind-box-header">
      <!-- 标题图标 -->
      <div class="wind-box-header-icon iconfont iconfont-shangxiasaofeng-01" />
      <!-- 标题文本 -->
      <span class="wind-box-header-text" v-text="'风向'" />
    </div>
    <!-- 按钮组 -->
    <btn-group :btn-list="swingData" />
  </div>
</template>

<script>
import { Row, Col } from 'gree-ui';
import { mapGetters } from 'vuex';
import { glyphs } from '@assets/iconfont/iconfont.json';
import BtnGroup from '@/components/BtnGroup/index';

export default {
  name: 'wind-direction',
  components: {
    [BtnGroup.name]: BtnGroup,
    [Row.name]: Row,
    [Col.name]: Col
  },
  computed: {
    ...mapGetters(['swingDefine']),
    ...mapGetters('machine', ['statusMap', 'blindModelArr']),
    swingData() {
      if (!Object.keys(this.statusMap).length) return [];
      const result = this.swingDefine.map(model => {
        const identifier = model.identifier;
        if (!this.statusMap[identifier])
          return {
            icon: {},
            handler: () => {
              console.log('Undefined function');
            }
          };
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
        // 执行的方法
        const handler = (identifier, disable = false) => {
          disable || this.$stateMachine.nextStatus(identifier);
        };
        return { key: identifier, name, icon, gray, hide, handler };
      });
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.wind-direction-set {
  height: auto;
  .wind-box-header {
    padding: 0 52px;
    margin-bottom: 16px;
  }
}
</style>
