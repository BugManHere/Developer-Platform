<template>
  <div class="gr-panel">
    <div class="overlay-backdrop" v-if="options.show"/>
    <div class="edit-box" v-fade:show="panelShow">
      <div class="panel panel-default" v-if="options.show">
        <div class="panel-heading">
          <h3 class="panel-title">
            {{ options.title }}
            <div>
              <button
                class="close"
                @click="plusMethod(key)"
                v-for="(text, key) in buttonList"
                v-show="options[key]"
                :key="key"
              >
                <span v-html="text"/>
              </button>
            </div>
          </h3>
        </div>
        <component v-bind:is="options.component.name" :ref="options.component.ref"/>
      </div>
    </div>
  </div>
</template>

<script>
import StatusDef from "./StatusDef";
import OrderDef from "./OrderDef";

export default {
  components: {
    StatusDef,
    OrderDef,
  },
  props: {
    options: {
      type: Object,
      default: function() {
        return {
          show: true,
          title: "无输入值",
          plus: {
            method: () => {
              console.log("No plus function!");
            },
            selfMethod: () => {
              console.log("No plus function!");
            }
          },
          minus: {
            method: () => {
              console.log("No minus function!");
            },
            selfMethod: () => {
              console.log("No minus function!");
            }
          },
          close: {
            method: () => {
              console.log("No close function!");
            },
            selfMethod: () => {
              console.log("No close function!");
            }
          },
          component: {
            name: '',
            ref: '',
          },
        };
      }
    },
  },
  data() {
    return {
      panelShow: false,
      buttonList: {
        plus: '+',
        minus: '&minus;',
        close: '&times;',
      }
    }
  },
  watch: {
    options: {
      handler(newVal) {
        if (!newVal.show) {
          setTimeout(() => {
            this.panelShow = false;
          }, 500);
        } else {
          this.panelShow = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    plusMethod(key) {
      const selfMethod = this.options[key].selfMethod;
      if (selfMethod) {
        this[selfMethod]();
      } else {
        this.options[key].method();
      }
    },
    addStatus() {
      this.$refs["statusDef-0"].addStatus();
    },
    delStatusMod() {
      this.$refs["statusDef-0"].delStatusMod(true);
    },
  }
};
</script>

<style>
</style>