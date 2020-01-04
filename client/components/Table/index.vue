<template>
  <div class="gree-table">
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
                @click="goThatStatus(realIndex[index], statusIndex)"
                v-text="val"
              />
            </span>
          </td>
          <td v-if="funcOptions.content">
            <p>
              <span @click="insertPage(realIndex[index])" v-text="'插入页面'" v-show="tableOptions.operate.includes('insert')"/>
              <span @click="editStatus(realIndex[index])" v-text="'定义'" v-show="tableOptions.operate.includes('define')"/>
              <span @click="$_delFun(realIndex[index])" v-text="'删除'" v-show="tableOptions.operate.includes('delete')"/>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <Panel :options="insertPageShow === false ? defPanelOptions : insertPageOptions" ref="panel" />
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
  props: {
    tableOptions: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      addStatusType: false, // 是否处于添加状态
      editItem: [false, false],
      isNext: false,
      timer: null,
      realIndex: [],
      insertPageShow: false,
    };
  },
  computed: {
    ...mapState({
      hasDeviceList: state => state.devModule.hasDeviceList,
      animationSecond: state => state.pulicModule.animationSecond,
      deviceKey: state => state.funcModule.deviceKey,
      currentFuncId: state => state.funcModule.currentFuncId,
      currentStatusId: state => state.funcModule.currentStatusId,
      statusSetStep: state => state.funcModule.statusSetStep,
      devSetStep: state => state.funcModule.devSetStep,
      delStatusType: state => state.funcModule.delStatusType,
      funcDefine: (state, getters) => getters.funcDefine
    }),
    currentComponent() {
      return ["StatusDef", "OrderDef"][this.statusSetStep];
    },
    funcOptions() {
      const realIndex = [];
      let content = [];
      let funcDefine = [];
      try {
        funcDefine = this.hasDeviceList.find(item => item._id === this.deviceKey).funcDefine;
        const filterArr = funcDefine.filter((item, index) => {
          return this.tableOptions.type.includes(item.type) && realIndex.push(index);
        });
        this.setRealIndex(realIndex);
        if (filterArr.length) {
          content = filterArr.map(val => {
            const res = this.tableOptions.keyList.map(item => {
              return val[item];
            });
            res.push([]);
            ['default', ...val.order].forEach(item => {
              const target = val.statusDefine[item];
              let text = `${target.name}：${target.value}`
              text += target.moreCommand ? "+" : "";
              res[res.length - 1].push(text);
            })
            return res;
          });
        }
      } catch (err) {
        err;
      }
      return {
        caption: "",
        title: [...this.tableOptions.titleList, "状态简要", "操作"],
        content
      };
    },
    // 【插入页面】页面设置
    insertPageOptions() {
      const result = {
        show: this.insertPageShow !== false,
        class: 'big',
        title: '选择页面',
        miniBtn: {
          close: {
            method: this.insertPage
          }
        },
        bottomBtn: {
          done: {
            selfMethod: "settingDone"
          }
        },
        component: {
          name: "SelectPage",
          ref: "SelectPage"
        }
      };
      return result;
    },
    // 【定义】页面设置
    defPanelOptions() {
      let result = {};
      switch (this.statusSetStep) {
        case 0:
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
          break;
        case 1:
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
          break;
        default:
          break;
      }
      return result;
    }
  },
  created() {
    document.onkeyup = e => {
      e.keyCode === 27 && this.currentFuncId !== false && this.editStatus();
    };
  },
  destroyed() {
    this.editStatus();
  },
  methods: {
    ...mapMutations({
      setFuncObject: "SET_FUNC_OBJECT",
      setFuncDefine: "SET_FUNC_DEFINE"
    }),
    ...mapActions({
      delFunc: "DEL_FUNC"
    }),
    setRealIndex(index) {
      this.realIndex = index;
    },
    // 插入页面
    insertPage(index=false) {
      this.insertPageShow = index;
    },
    // 编辑状态
    editStatus(index = false) {
      if (!this.$_throttle()) return;
      this.setFuncObject(["currentFuncId", index]);
      this.setFuncObject(["delStatusType", false]);
      this.setFuncObject(["currentStatusId", false]);
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
      if (this.isNext || this.editItem[0] === false || evt.target.value === '') return;
      const valOrder = ["name", "identifier", "json"];
      const fromValue = valOrder[this.editItem[1]];
      const toValue = evt.target.value;
      const funcDefine = deepCopy(this.funcDefine);
      funcDefine[this.realIndex[this.editItem[0]]][fromValue] = toValue;
      this.setFuncDefine([this.deviceKey, funcDefine]);
      this.funcOptions.content[this.editItem[0]][this.editItem[1]] = toValue;
      this.initInput();
    },
    goThatStatus(index, statusIndex) {
      if (!this.$_throttle()) return;
      const statusId = statusIndex ? statusIndex + 1 : 0;
      this.setFuncObject(["currentFuncId", index]);
      this.$nextTick(() => {
        this.$refs.panel.$refs["statusDef-0"].currentStatusId = statusId;
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
    },
    // 节流函数
    $_throttle() {
      if (this.timer) return false;
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.animationSecond * 1000);
      return true;
    }
  }
};
</script>
