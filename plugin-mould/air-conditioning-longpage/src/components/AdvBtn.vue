<template>
  <card-group>
    <!-- 按钮组 -->
    <template v-slot:content>
      <btn-group :btn-list="btnList" />
    </template>
  </card-group>
</template>

<script>
import { mapGetters } from 'vuex';
import { glyphs } from '@assets/iconfont/iconfont.json';
import BtnGroup from '@/components/BtnGroup/index';
import CardGroup from '@/components/CardGroup/index';

export default {
  name: 'adv-btn-group',
  components: {
    [BtnGroup.name]: BtnGroup,
    [CardGroup.name]: CardGroup
  },
  computed: {
    ...mapGetters(['buttonDefine']),
    ...mapGetters('machine', ['statusMap', 'blindModelArr']),
    btnList() {
      if (!Object.keys(this.statusMap).length) return [];
      const result = this.buttonDefine.map(model => {
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
