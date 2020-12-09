<template>
  <!-- 底部按钮 -->
  <gree-toolbar position="bottom" no-hairline class="bottom-btn">
    <gree-row>
      <div class="pow-button" :class="{ off: !Pow - 0 }" @click="switchPow">
        <span class="iconfont iconfont-kaiguan" />
        <div class="button-boder" />
        <div class="ripple" v-show="!Pow" />
      </div>
      <gree-col
        v-for="(btn, index) in btnList"
        :key="index"
        width="25"
        :class="{
          'set-gray': btn.gray,
          'set-hide': btn.hide,
          select: btn.icon.type === 'on' && !btn.gray
        }"
      >
        <div class="icon" @click="btn.func(btn.key, btn.gray)">
          <i class="iconfont" :class="`iconfont-${btn.icon.key}`" />
        </div>
        <span v-text="btn.name" />
      </gree-col>
    </gree-row>
  </gree-toolbar>
</template>

<script>
import { Row, Col, ToolBar } from 'gree-ui';
import { mapState, mapGetters } from 'vuex';
import { glyphs } from '@assets/iconfont/iconfont.json';

export default {
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [ToolBar.name]: ToolBar
  },
  computed: {
    ...mapState('control', {
      Pow: state => state.dataObject.Pow,
      SwhSlp: state => state.dataObject.SwhSlp
    }),
    ...mapGetters(['popupDefine']),
    ...mapGetters('machine', ['statusMap', 'blindModelArr']),
    btnList() {
      if (!Object.keys(this.statusMap).length) return [];
      const result = this.popupDefine.map(model => {
        const identifier = model.identifier;
        if (!this.statusMap[identifier])
          return {
            icon: {},
            func: () => {
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
        const func = (identifier, disable = false) => {
          disable || this.$stateMachine.nextStatus(identifier);
        };
        return { key: identifier, name, icon, gray, hide, func };
      });
      return result;
    }
  },
  methods: {
    switchPow() {
      this.$stateMachine.nextStatus('Pow');
    }
  }
};
</script>

<style></style>
