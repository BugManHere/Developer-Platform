<template>
  <div class="function-table">
    <table class="table">
      <caption>
        {{
        funcOptions.caption
        }}
      </caption>
      <thead>
        <tr class="info">
          <th v-for="(item, index) in funcOptions.title" :key="index">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!funcOptions.content.length">
          <td v-for="(item, key) in ['', '', '', []]" :key="key">
            <p v-if="!Array.isArray(item)">{{ item }}</p>
            <span v-else class="definitions">
              <span v-for="(val, index) in item" :key="index">{{ val }}</span>
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
            >{{ item }}</p>
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
              <span v-for="(val, index) in item" :key="index">{{ val }}</span>
            </span>
          </td>
          <td v-if="funcOptions.content">
            <p>
              <span @click="editStatus(index)">定义</span>
              &nbsp;
              <span @click="$_delFun(index)">删除</span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <Panel :options="panelOptions"/>
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
      currentStatusId: false, // 当前状态ID
      delStatusType: false, // 是否处于删除状态
      addStatusType: false, // 是否处于添加状态
      editItem: [false, false],
      isNext: false,
    };
  },
  mounted() {},
  computed: {
    ...mapState({
      deviceKey: state => state.funcModule.deviceKey,
      currentFuncId: state => state.funcModule.currentFuncId,
      settingStep: state => state.funcModule.settingStep,
      animationSecond: state => state.pulicModule.animationSecond,
      funcDefine: function getFuncDefine(state) {
        return state.funcModule.funcDefineList[state.funcModule.deviceKey];
      }
    }),
    currentComponent() {
      return ["StatusDef", "OrderDef"][this.settingStep];
    },
    funcOptions() {
      let content = [];
      if (this.funcDefine) {
        content = this.funcDefine.map(val => {
          const res = [val.name, val.identifier, val.json, []];
          Object.keys(val.statusDefine).forEach(item => {
            if (item === 'undefined') return;
            const target = val.statusDefine[item];
            let text = `${target.name}：${target.value}`;
            if (target.moreCommand) {
              text += '+';
            }
            res[res.length - 1].push(text);
          });
          return res;
        });
      }
      return {
        caption: "属性",
        title: ["功能名称", "标识符", "控制字段", "状态简要", "操作"],
        content
      }
    },
    panelOptions() {
      let result = {
        show: this.currentFuncId !== false,
        title: '状态定义',
        close: {
          method: this.editStatus,
        },
      };
      if (this.settingStep) {
        result.component = {
          name: 'OrderDef',
          ref: 'statusDef-1'
        }
      } else {
        result = Object.assign(result, {
          plus: {
            selfMethod: 'addStatus',
          },
          minus: {
            selfMethod: 'delStatusMod',
          },
          component: {
            name: "StatusDef",
            ref: 'statusDef-0'
          },
        })
      }
      return result;
    }
  },
  methods: {
    ...mapMutations({
      setFuncObject: "SET_FUNC_OBJECT",
      setFuncDefine: "SET_FUNC_DEFINE"
    }),
    ...mapActions({
      delFunc: "DEL_FUNC",
    }),
    // 编辑状态
    editStatus(index=false) {
      if (index === false) {
        this.setFuncObject(["currentFuncId", index]);
        this.setFuncObject(["settingStep", 0]);
      } else {
        this.setFuncObject(["currentFuncId", index]);
      }
    },
    // 删除功能
    $_delFun(index) {
      this.delFunc({
        key: this.deviceKey,
        index
      })
    },
    setStatusId(val) {
      this.currentStatusId = val;
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
      const valOrder = ['name', 'identifier', 'json'];
      const fromValue = valOrder[this.editItem[1]];
      const toValue = evt.target.value;
      const funcDefine = deepCopy(this.funcDefine);
      funcDefine[this.editItem[0]][fromValue] = toValue;
      this.setFuncDefine([this.deviceKey, funcDefine]);
      this.funcOptions.content[this.editItem[0]][this.editItem[1]] = toValue;
      this.initInput();
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
        this.showInput(nextItem[0], nextItem[1], this.funcOptions.content[nextItem[0]][nextItem[1]]);
      });
      this.setValue(evt);
      this.isNext = true;
    }
  }
};
</script>
