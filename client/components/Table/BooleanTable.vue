<template>
  <div class="boolean-table">
    <div style="">
    </div>
    <table class="table">
      <caption v-html="funcOptions.caption" />
      <thead>
        <tr class="info">
          <th v-for="(item, index) in funcOptions.title" :key="index" v-html="item" />
        </tr>
      </thead>
      <tbody>
        <tr v-if="!funcOptions.content.length">
          <td v-for="(item, key) in ['', '', '', []]" :key="key">
            <p v-if="!Array.isArray(item)" v-text="item" />
            <span v-else class="definitions">
              <span v-for="(val, index) in item" :key="index" v-text="val" />
            </span>
          </td>
          <td v-if="funcOptions.content">
            <p>
              <span />
              &nbsp;
              <span />
            </p>
          </td>
        </tr>
        <tr v-for="(content, index) in funcOptions.content" :key="index">
          <td v-for="(item, key) in content" :key="key">
            <p
              v-if="!Array.isArray(item)"
              v-show="index !== editItem[0] || key !== editItem[1]"
              @click="showInput(index, key, item)"
              v-text="item"
            />
            <p v-if="!Array.isArray(item)" v-show="index === editItem[0] && key === editItem[1]">
              <input
                @blur="setValue"
                @keydown.tab="nextInput"
                @keyup.esc="initInput"
                @keyup.enter="setValue"
                :id="`input-${index}-${key}`"
                :key="`${index}-${key}`"
                spellcheck="false"
              />
            </p>
            <span v-else class="definitions">
              <span
                v-for="(val, statusIndex) in item"
                :key="statusIndex"
                @click="goThatStatus(index, statusIndex)"
                v-text="val"
              />
            </span>
          </td>
          <td v-if="funcOptions.content">
            <p>
              <span @click="editStatus(index)" v-text="'定义'" />
              <span @click="$_delFun(index)" v-text="'删除'" />
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <Panel :options="panelOptions" ref="panel" />
  </div>
</template>

<script>
import { deepCopy } from "@/utils";
import { mapMutations, mapState, mapActions } from "vuex";
import Panel from "@components/Panel/index";

export default {
  components: {
    Panel
  },
  data() {
    return {
      addStatusType: false, // 是否处于添加状态
      editItem: [false, false],
      isNext: false,
      timer: null,
    };
  },
  computed: {
    ...mapState({
      animationSecond: state => state.pulicModule.animationSecond,
      deviceKey: state => state.funcModule.deviceKey,
      currentFuncId: state => state.funcModule.currentFuncId,
      currentStatusId: state => state.funcModule.currentStatusId,
      statusSetStep: state => state.funcModule.statusSetStep,
      delStatusType: state => state.funcModule.delStatusType,
      funcDefine: (state, getters) => getters.funcDefine
    }),
    currentComponent() {
      return ["StatusDef", "OrderDef"][this.statusSetStep];
    },
    funcOptions() {
      let content = [];
      if (this.funcDefine) {
        content = this.funcDefine.map(val => {
          const res = [val.name, val.identifier, val.json, []];
          Object.keys(val.statusDefine).forEach(item => {
            if (item === "undefined") return;
            const target = val.statusDefine[item];
            let text = `${target.name}：${target.value}`;
            text += target.moreCommand ? "+" : "";
            res[res.length - 1].push(text);
          });
          return res;
        });
      }
      return {
        caption: "",
        title: ["功能名称", "标识符", "控制字段", "状态简要", "操作"],
        content
      };
    },
    panelOptions() {
      let result;
      if (this.statusSetStep) {
        result = {
          show: this.currentFuncId !== false,
          title: "状态定义",
          miniBtn: {
            close: {
              method: this.editStatus
            }
          },
          bottomBtn: {
            up: {
              method: this.Previous
            },
            done: {
              selfMethod: "settingDone"
            }
          },
          component: {
            name: "OrderDef",
            ref: "statusDef-1"
          }
        };
      } else {
        result = {
          show: this.currentFuncId !== false,
          title: "状态定义",
          miniBtn: {
            plus: {
              selfMethod: "addStatus"
            },
            minus: {
              method: this.minusFunc
            },
            close: {
              method: this.editStatus
            }
          },
          bottomBtn: {
            down: {
              selfMethod: "nextStep"
            }
          },
          component: {
            name: "StatusDef",
            ref: "statusDef-0"
          }
        };
        if (this.delStatusType) {
          result = Object.assign(result, {
            miniBtn: {
              close: {
                method: this.editStatus
              }
            },
            bottomBtn: {
              del: {
                selfMethod: "delStatus"
              },
              cancel: {
                method: this.setDelType
              }
            }
          });
        } else if (this.currentStatusId !== false) {
          result = Object.assign(result, {
            miniBtn: {
              close: {
                method: this.editStatus
              }
            },
          });
        }
      }
      return result;
    }
  },
  created() {
    document.onkeyup = e => {
      e.keyCode === 27 && this.currentFuncId !== false && this.editStatus();
    };
  },
  methods: {
    ...mapMutations({
      setFuncObject: "SET_FUNC_OBJECT",
      setFuncDefine: "SET_FUNC_DEFINE"
    }),
    ...mapActions({
      delFunc: "DEL_FUNC"
    }),
    // 编辑状态
    editStatus(index = false) {
      if (this.timer) return;
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.animationSecond * 1000);
      this.setFuncObject(["currentFuncId", index]);
      this.setFuncObject(["delStatusType", false]);
      !index && this.setFuncObject(["statusSetStep", 0]);
    },
    // 删除功能
    $_delFun(index) {
      this.delFunc({
        key: this.deviceKey,
        index
      });
    },
    showInput(index, index2, item) {
      const id = `input-${index}-${index2}`;
      const doc = document.getElementById(id);
      this.editItem = [index, index2];
      setTimeout(() => {
        doc.value = item;
        doc.focus();
        doc.select();
        this.isNext = false;
      }, 0);
    },
    setValue(evt) {
      if (this.isNext || this.editItem[0] === false) return;
      const valOrder = ["name", "identifier", "json"];
      const fromValue = valOrder[this.editItem[1]];
      const toValue = evt.target.value;
      const funcDefine = deepCopy(this.funcDefine);
      funcDefine[this.editItem[0]][fromValue] = toValue;
      this.setFuncDefine([this.deviceKey, funcDefine]);
      this.funcOptions.content[this.editItem[0]][this.editItem[1]] = toValue;
      this.initInput();
    },
    goThatStatus(index, statusIndex) {
      const statusId = statusIndex ? statusIndex + 1 : 0;
      this.setFuncObject(["currentFuncId", index]);
      this.$nextTick(() => {
        console.log(
          (this.$refs.panel.$refs["statusDef-0"].currentStatusId = statusId)
        );
      });
    },
    initInput() {
      this.editItem = [false, false];
    },
    nextInput(evt) {
      const xMax = 2;
      const yMax = this.funcOptions.content.length - 1;
      let nextItem = this.editItem.concat();
      if (this.editItem[1] < xMax) {
        nextItem[1] += 1;
      } else if (this.editItem[0] < yMax) {
        nextItem[0] += 1;
        nextItem[1] = 0;
      } else {
        nextItem = [0, 0];
      }
      this.$nextTick(() => {
        this.showInput(
          nextItem[0],
          nextItem[1],
          this.funcOptions.content[nextItem[0]][nextItem[1]]
        );
      });
      this.setValue(evt);
      this.isNext = true;
    },
    setDelType(type = false) {
      this.setFuncObject(["delStatusType", type]);
    },
    minusFunc() {
      this.setDelType(true);
    },
    Previous() {
      this.setFuncObject(["statusSetStep", 0]);
    }
  }
};
</script>
