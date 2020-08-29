<template>
  <div class="gr-panel">
    <!-- 蒙版 -->
    <div class="overlay-backdrop" v-if="options.show" />
    <!-- 内容 -->
    <div
      class="edit-box"
      :class="options.class"
      v-fade:show="options.show"
      :style="{ top: `${documentHeight - { big: 100, medium: 75, undefined: 0 }[options.class]}px` }"
    >
      <div class="panel panel-default" v-if="panelShow">
        <!-- 顶栏 -->
        <div class="panel-heading">
          <h3 class="panel-title">
            {{ options.title }}
            <!-- 右上角按钮组 -->
            <div>
              <button class="close" @click="btnFunc(key, 'miniBtn')" v-for="(text, key) in miniBtnList" v-show="options.miniBtn[key]" :key="key">
                <span v-html="text" />
              </button>
            </div>
          </h3>
        </div>
        <!-- 自定义组件 -->
        <component v-if="options.component" :is="options.component.name" :ref="options.component.ref" />
        <!-- 底部按钮组 -->
        <div class="btn-group btn-group-justified col-md-12" role="group" aria-label="...">
          <div role="group">
            <button
              class="btn"
              :class="{ 'btn-danger': key === 'del', 'btn-default': ['up', 'cancel'].includes(key), 'btn-primary': ['down', 'done'].includes(key) }"
              @click="btnFunc(key, 'bottomBtn')"
              v-for="(item, key) in options.bottomBtn"
              v-html="bottomBtnList[key]"
              :key="key"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatusDef from './StatusDef';
import OrderDef from './OrderDef';
import SelectLabel from './SelectLabel';
import SelectPage from './SelectPage';
import QuoteFunc from './QuoteFunc';

export default {
  components: {
    StatusDef,
    OrderDef,
    SelectLabel,
    SelectPage,
    QuoteFunc
  },
  props: {
    options: {
      type: Object,
      default: function() {
        return {
          show: true,
          class: '',
          title: '无输入值',
          // Supported options: plus/minus/close
          miniBtn: {
            plus: {
              method: () => {
                console.log('No plus function!');
              },
              selfMethod: () => {
                console.log('No plus function!');
              }
            }
          },
          // Supported options: del/up/down/cancel/done
          bottomBtn: {
            del: {
              method: () => {
                console.log('No close function!');
              },
              selfMethod: () => {
                console.log('No close function!');
              }
            }
          },
          component: {
            name: '',
            ref: ''
          }
        };
      }
    }
  },
  data() {
    return {
      panelShow: false,
      miniBtnList: {
        plus: '+',
        minus: '&minus;',
        close: '&times;'
      },
      bottomBtnList: {
        del: '删&emsp;除',
        up: '上一步',
        down: '下一步',
        cancel: '取消',
        done: '完&emsp;成'
      },
      documentHeight: 0
    };
  },
  watch: {
    options: {
      handler(newVal) {
        if (!newVal.show) {
          this.options.component = false;
          setTimeout(() => {
            if (!this.options.show) {
              this.panelShow = false;
            }
          }, 500);
        } else {
          this.documentHeight = document.getElementById('app').scrollTop + 170;
          this.panelShow = true;
        }
      },
      deep: true
    }
  },
  methods: {
    // 函数分发
    btnFunc(key, type) {
      const methodKey = this.options[type][key].selfMethod;
      const both = this.options[type][key].both;
      if (methodKey) {
        const ref = this.options.component.ref;
        this.selfMethod(ref, methodKey);
        both && this.options[type][key].method();
      } else {
        this.options[type][key].method();
      }
    },
    selfMethod(ref, key) {
      this.$refs[ref][key]();
    },
    addStatus() {
      this.$refs['statusDef-0'].addStatus();
    },
    delStatusMod() {
      this.$refs['statusDef-0'].delStatusMod(true);
    },
    nextStep() {
      this.$refs['statusDef-0'].nextStep();
    }
  }
};
</script>

<style></style>
