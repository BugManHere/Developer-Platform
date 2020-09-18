<template>
  <!-- 底部按钮 -->
  <gree-toolbar position="bottom" no-hairline class="bottom-btn">
    <gree-row>
      <div class="pow-button" :class="{ off: !Pow - 0 }" @click="changeData({ Pow: !Pow - 0 })">
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
import { mapState } from 'vuex';
import { glyphs } from '@assets/iconfont/iconfont.json';
import LogicDefine from '@logic/define';
import Customize from '@logic/customize';

export default {
  mixins: [LogicDefine, Customize],
  data() {
    return {
      popupsKey: 'homeButton'
    };
  },
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [ToolBar.name]: ToolBar
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      SwhSlp: state => state.dataObject.SwhSlp
    }),
    popupModules() {
      return this.g_funcDefine_active.filter(module => module.type === `active-${this.popupsKey}`);
    },
    btnList() {
      if (!Object.keys(this.g_statusMap).length) return [];
      const result = this.popupModules.map(module => {
        // 定义key
        const key = module.identifier;
        if (!this.g_statusMap[key])
          return {
            icon: {},
            func: () => {
              console.log('Undefined function');
            }
          };
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
        // 执行的函数
        const func = (identifier, isGray = false) => {
          this.changeStatus(identifier, isGray);
        };
        return { key, name, icon, gray, hide, func };
      });
      return result;
    }
  },
  methods: {
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
      const setData = this.g_nextStatusMap[identifier].setData;
      this.changeData(setData);
    }
  }
};
</script>

<style></style>
