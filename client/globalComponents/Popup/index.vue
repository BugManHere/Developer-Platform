<template>
  <div class="gdp-popup">
    <!-- 蒙版 -->
    <div class="overlay-backdrop" />
    <!-- 内容 -->
    <div class="gdp-popup-box" :class="size">
      <div class="gdp-popup-panel panel panel-default">
        <!-- 顶栏 -->
        <div class="panel-heading">
          <h3 class="panel-title">
            <!-- 标题名称 -->
            <span v-text="title" />
            <!-- 右上角按钮组 -->
            <div class="gdp-btn-group">
              <button
                class="close"
                v-for="(miniBtn, index) in miniBtns"
                v-html="miniBtn.text"
                :class="miniBtn.class"
                :id="miniBtn.id"
                :key="index"
                @click="miniBtn.method"
              />
            </div>
          </h3>
        </div>
        <!-- 自定义组件 -->
        <transition name="fade">
          <div class="gdp-component" ref="gdp-component" id="gdp-component">
            <slot name="gdp-component" />
          </div>
        </transition>
        <!-- 底部按钮组 -->
        <div v-if="bottomBtns && bottomBtns.length" class="btn-group btn-group-justified col-md-12">
          <button class="btn" v-for="(btn, key) in bottomBtns" v-html="btn.text" :class="`btn-${btn.class}`" :id="btn.id" :key="key" @click="btn.method" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'gdp-popup',
  props: {
    size: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '标题'
    },
    onCancel: {
      type: Function,
      default: () => {
        myvm.$popup.hide();
      }
    },
    onConfirm: {
      type: Function,
      default: () => {
        myvm.$popup.hide();
      }
    },
    miniBtns: {
      type: Array,
      default: function() {
        return [
          {
            id: 'close',
            text: '&times;',
            method: this.onCancel
          }
        ];
      }
    },
    bottomBtns: {
      type: Array,
      default: function() {
        return [
          {
            class: 'primary',
            text: '完&emsp;成',
            method: this.onConfirm
          }
        ];
      }
    },
    componentConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    options: {
      type: Object,
      default: function() {
        return {
          class: '',
          title: '无输入值',
          // Supported options: plus/minus/close
          miniBtns: [
            {
              id: 'close',
              text: '&times;',
              method: () => {
                console.log('-------click close-------');
                this.$popup.hide();
              }
            }
          ],
          // Supported options: del/up/down/cancel/done
          bottomBtns: [
            {
              class: 'primary',
              text: '完&emsp;成',
              method: () => {
                console.log('-------click done-------');
                this.$popup.hide();
              }
            }
          ],
          componentConfig: {
            default: null,
            name: '',
            props: {}
          }
        };
      }
    }
  },
  data() {
    return {
      componentName: null,
      componentEl: null
    };
  },
  created() {
    document.onkeydown = e => {
      e.keyCode === 27 && this.onCancel();
      // e.keyCode === 13 && this.onConfirm();
    };
  },
  mounted() {
    setTimeout(() => {
      this.mountComponent();
    }, 0);
  },
  methods: {
    // 挂载组件
    mountComponent() {
      const { componentConfig } = this;
      if (!componentConfig || this.componentName === componentConfig.name) return;
      const parentEl = this.$refs['gdp-component'];
      this.componentEl && parentEl.removeChild(this.componentEl);

      const newComponent = componentConfig.default;
      Vue.component(componentConfig.name, newComponent);

      const newComponentExtent = Vue.extend({
        render(h) {
          let { props } = componentConfig;
          return h(componentConfig.name, { props });
        }
      });

      const componentEl = new newComponentExtent().$mount('').$el;

      parentEl.appendChild(componentEl);
      parentEl.style.height = `${componentEl.clientHeight}px`;

      this.componentName = componentConfig.name;
      this.componentEl = componentEl;
    }
  }
};
</script>

<style lang="scss" scoped>
.gdp-popup {
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  &-box {
    position: fixed;
    z-index: 10;
    width: 549px;
    .panel-title {
      display: flex;
      justify-content: space-between;
      div {
        display: flex;
        justify-content: flex-end;
        button {
          margin-left: 10px;
        }
      }
    }
    .btn-group {
      display: flex;
      justify-content: center;
      background-color: #fff;
      padding: 15px 0;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      button {
        width: 80px;
        margin-right: 10px;
        margin-left: 10px;
      }
    }
    &.big {
      width: 1200px;
    }
    &.medium {
      width: 900px;
    }
    &.auto {
      width: auto;
    }
  }
}

.gdp-component {
  height: 0;
  transition: all 0.5s;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
