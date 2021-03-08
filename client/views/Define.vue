<template>
  <div class="gdp-define" ref="gdp-define">
    <div class="gdp-define-box">
      <!-- 顶部信息栏 -->
      <info-card :card-info="pageConfig.header">
        <!-- 按钮 -->
        <template v-slot:right>
          <div class="gdp-define-input">
            <div class="gdp-define-input-group" v-for="(btn, index) in pageConfig.header.right" :key="index">
              <!-- 输入框，type：button -->
              <button v-if="btn.type === 'button'" v-text="btn.text" type="button" class="btn btn-default" :class="btn.class" @click="btn.method" />
              <!-- 选择框，type：select -->
              <select v-else-if="btn.type === 'select'" v-model="btn.default" class="select-medium form-control" @change="btn.method(btn.default)">
                <option v-for="(optionVal, optionIndex) in btn.options" v-text="`${btn.title}：${optionVal}`" :key="optionIndex" :value="optionIndex" />
              </select>
            </div>
          </div>
        </template>
      </info-card>
      <!-- 中间主要内容 -->
      <gdp-panel class="gdp-define-box-content">
        <!-- 标题 -->
        <template v-slot:title>
          <span v-text="pageConfig.content.title" />
        </template>
        <!-- 按钮 -->
        <template v-slot:right>
          <div class="gdp-define-button-group">
            <button
              type="button"
              class="btn btn-default"
              v-text="btn.text"
              v-for="(btn, index) in pageConfig.content.right"
              :key="index"
              :class="btn.class"
              @click="btn.method"
            />
          </div>
        </template>
        <!-- 内容 -->
        <template v-slot:content>
          <!-- 内容 -->
          <component :is="pageConfig.content.main" />
        </template>
      </gdp-panel>
    </div>
    <!-- 底部按钮组 -->
    <div class="bottom-panel" v-show="pageConfig.bottomBtns.show">
      <button
        type="button"
        v-for="item in pageConfig.bottomBtns.options"
        class="btn"
        :class="item.class"
        :key="item.text"
        @click="item.func.parameter !== undefined ? item.func.defined(item.func.parameter) : item.func.defined()"
        v-text="item.text"
      />
    </div>
  </div>
</template>

<script>
import LogicTable from '@components/layout/Logic';
import OtherConfigTable from '@components/layout/OtherConfig';
import gdpPanel from '@/gdp-ui/panel';
import infoCard from '@components/infoCard';
import { deviceDefineConfig } from '@/mixin/Define/Device';
import { templateDefineConfig } from '@/mixin/Define/Template';

// 根据情况加载不同mixin
let mixinConfig = {};
const [, mainRouter, subRouter] = location.hash.split('/');
if (mainRouter === 'Define') {
  switch (subRouter) {
    case 'Device':
      mixinConfig = deviceDefineConfig;
      break;
    case 'Template':
      mixinConfig = templateDefineConfig;
      break;
    default:
      break;
  }
} else {
  setTimeout(() => {
    location.reload();
  }, 100);
}

export default {
  mixins: [mixinConfig],
  components: {
    [infoCard.name]: infoCard,
    [gdpPanel.name]: gdpPanel,
    LogicTable,
    OtherConfigTable
  },
  data() {
    return {
      config: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    try {
      const pageConfig = mixinConfig.computed.pageConfig();
      if (pageConfig.hash !== to.name) {
        setTimeout(() => {
          location.reload();
        }, 100);
      }
    } catch (e) {
      console.error('找不到页面配置', e);
    }
    next();
  },
  methods: {
    initScroll() {
      try {
        const dom = this.$refs['gdp-define'];
        dom.style.height = 'auto';
        setTimeout(() => {
          dom.style.height = '100%';
        }, 0);
      } catch (e) {
        e;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.gdp-define {
  position: relative;
  top: 0px;
  height: 100%;
  overflow-y: auto;
  &-box {
    width: 1084px;
    margin: 70px auto 84px auto;
    &-content {
      margin: 20px auto 0 auto;
    }
    .gdp-define-input {
      width: auto;
      justify-content: flex-end;
      align-items: center;
      display: flex;
      flex-wrap: nowrap;
      &-group {
        width: auto;
        margin: 0 5px;
      }
    }
  }
  .bottom-panel {
    position: fixed;
    width: 100%;
    z-index: 5;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background-color: #d8eafd;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    border-top: 1px LightBLue solid;
    button {
      margin-right: 35px;
    }
  }
}
</style>
