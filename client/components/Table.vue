<template>
  <div class="function-table">
    <table class="table">
      <caption>{{ options.caption }}</caption>
      <thead>
        <tr class="info">
          <th
            v-for="(item, index) in options.title"
            :key="index"
          >
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(content, index) in options.content"
          :key="index"
        >
          <td
            v-for="(item, key) in content"
            :key="key"
          >
            <p v-if="!Array.isArray(item)">
              {{ item }}
            </p>
            <span
              v-else
              class="definitions"
            >
              <span
                v-for="(val, index) in item"
                :key="index"
              >
                {{val}}
              </span>
            </span>
          </td>
          <td>
            <p>
              <span @click="editFun(index)">编辑</span>
              &nbsp;
              <span @click="delFun(index)">删除</span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="edit"
      v-if="currentFuncId !== false"
    >
      <div class="overlay-backdrop" />
      <transition name="fade">
        <div class="edit-box">
          <div class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title">编辑功能
                <button
                  type="button"
                  class="close"
                  aria-label="Close"
                  @click="editFun(false)"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </h3>
            </div>
            <div class="">

            </div>
            <div class="panel-body">
              <div
                class="status"
                :class="{unfold: currentStatusId === index}"
                v-for="(item, index) in touchOrder"
                :key="index"
              >
                <div
                  class="edit-optional"
                  :class="{must: ['undefined', 'default'].includes(item)}"
                >
                  <div
                    class="edit-header"
                    @click="unfoldStatus(index)"
                  >
                    <span>{{ currentFun.statusDefine[item].name }}</span>
                  </div>
                  <div
                    class="edit-check"
                    :class="{checking: checkingStatus[index]}"
                    @click="selectOption(item, index)"
                  />
                </div>
                <div
                  class="optional-more"
                  v-if="currentStatusId !== false"
                >
                  <div class="col-md-12">
                    <div class="col-md-6">
                      <label
                        for="inputPassword"
                        class="control-label"
                      >状态定义</label>
                      <select
                        class="form-control"
                        v-model="currentStatus.status"
                      >
                        <option value="on">开启</option>
                        <option value="off">关闭</option>
                        <option value="none">自定义</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label
                        for="inputPassword"
                        class="control-label"
                      >状态值</label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputText"
                        v-model="currentStatus.value"
                      >
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="col-md-6">
                      <label
                        for="inputPassword"
                        class="control-label"
                      >是否检查互斥</label>
                      <select
                        class="form-control"
                        v-model="currentStatus.isCheck"
                      >
                        <option :value="true">是</option>
                        <option :value="undefined">否</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label
                        for="inputPassword"
                        class="control-label"
                      >下一状态</label>
                      <input
                        type="text"
                        class="form-control"
                        :placeholder="nextStatusName"
                        id="inputText"
                        disabled
                      >
                    </div>
                  </div>
                  <div class="col-md-12">
                    <label
                      for="inputPassword"
                      class="control-label col-md-3"
                    >额外命令</label>
                    <table class="table table-bordered col-md-8">
                      <thead>
                        <tr class="active">
                          <th>字段</th>
                          <th>值</th>
                        </tr>
                      </thead>
                      <tbody v-if="currentStatus.moreCommand">
                        <tr
                          class="active"
                          v-for="(item, key) in currentStatus.moreCommand"
                          :key="key"
                        >
                          <td>{{key}}</td>
                          <td>{{item}}</td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr class="active">
                          <td>
                            <input
                              type="text"
                              class="form-control"
                              id="inputText"
                              v-model="extraCmd"
                            >
                          </td>
                          <td>
                            <input
                              type="text"
                              class="form-control"
                              id="inputText"
                              v-model="extraCmdVal"
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="table table-bordered col-md-1">
                      <thead>
                        <tr>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, key) in currentStatus.moreCommand"
                          :key="key"
                        >
                          <td>
                            <button
                              type="button"
                              class="close"
                              aria-label="Close"
                              @click="delCmd(key)"
                            >
                              <span aria-hidden="true">&minus;</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <button
                              type="button"
                              class="close"
                              aria-label="Close"
                              @click="addCmd"
                            >
                              <span aria-hidden="true">+</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="col-md-12 customize">
                    <div class="col-md-6">
                      <label
                        for="inputPassword"
                        class="control-label"
                      >使用自定义函数</label>
                      <select
                        class="form-control"
                        v-model="useCustomize"
                      >
                        <option :value="true">是</option>
                        <option :value="false">否</option>
                      </select>
                    </div>
                    <div class="col-md-5 checkbox-list">
                      <label
                        class="checkbox-inline col-md-6"
                        :class="{disabled: !useCustomize}"
                      >
                        <input
                          type="checkbox"
                          id="inlineCheckbox1"
                          v-model="currentStatus.customize.before"
                          @click="useCustomizeInsert"
                          :disabled="!useCustomize"
                        > 点击前
                      </label>
                      <label
                        class="checkbox-inline col-md-6"
                        :class="{disabled: !useCustomize}"
                      >
                        <input
                          type="checkbox"
                          id="inlineCheckbox2"
                          v-model="currentStatus.customize.after"
                          @click="useCustomizeInsert"
                          :disabled="!useCustomize"
                        > 点击后
                      </label>
                      <label
                        class="checkbox-inline col-md-8"
                        :class="{disabled: !useCustomize}"
                      >
                        <input
                          type="checkbox"
                          id="inlineCheckbox3"
                          v-model="currentStatus.customize.replace"
                          :disabled="!useCustomize"
                          @click="useCustomizeReplace"
                        > 代替原功能
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn-group btn-group-justified col-md-12" role="group" aria-label="...">
                <div class="" role="group">
                  <button type="button" class="btn btn-default btn-save">保存</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {
          caption: "属性",
          title: ["功能名称", "标识符", "控制字段", "状态定义", "操作"],
          content: [
            ["左右扫风", "SwLR", "SwingLfRig", ["默认: 0", "开启: 1"]],
            ["上下扫风", "SwUD", "SwUpDn", ["默认: 0", "开启: 1"]]
          ]
        };
      }
    },
    funcDefine: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      $_funcDefine: [],
      currentFuncId: false,
      currentFun: {},
      currentStatusId: false,
      currentStatus: {},
      checkingStatus: [],
      useCustomize: false,
      test: true,
      extraCmd: '',
      extraCmdVal: '',
    };
  },
  mounted() {
    this.$_funcDefine = JSON.parse(JSON.stringify(this.funcDefine));
  },
  computed: {
    // 状态执行顺序
    touchOrder() {
      if (!Object.keys(this.currentFun).length) return [];
      let Arr = this.currentFun.statusDefine.touchOrder.concat();
      Arr.push("undefined");
      return Arr;
    },
    // 下一状态的名称
    nextStatusName() {
      if (!Object.keys(this.currentFun).length || this.currentStatusId === false) return false;
      const map = this.currentFun.statusDefine;
      let key = '';
      switch (this.currentFun.statusDefine.touchOrder.length - this.currentStatusId) {
        case 0:
        case 1:
          key = 'default';
          break;
        default:
          key = this.currentFun.statusDefine.touchOrder[this.currentStatusId + 1];
          break;
      }
      return map[key].name;
    },
  },
  watch: {
    currentFuncId(newVal) {
      if (newVal !== false) {
        this.currentFun = JSON.parse(
          JSON.stringify(this.$_funcDefine[this.currentFuncId])
        );
      } else {
        this.currentFun = {};
      }
    },
    currentStatusId(newVal) {
      if (newVal !== false) {
        this.currentStatus = JSON.parse(
          JSON.stringify(this.currentFun.statusDefine[this.touchOrder[newVal]])
        );
        this.useCustomize = Boolean(
          Object.keys(this.currentStatus.customize).length
        );
      } else {
        this.currentStatus = {};
      }
    },
    touchOrder(newVal) {
      const len = newVal.length;
      this.checkingStatus.length = 0;
      this.checkingStatus = Array.from({length: len}, (v,k) => [0, len -1].includes(k) ? true : false);
    },
    useCustomize(newVal) {
      if (!newVal) {
        this.$set(this.currentStatus.customize, "replace", undefined);
        this.$set(this.currentStatus.customize, "after", undefined);
        this.$set(this.currentStatus.customize, "before", undefined);
      }
    }
  },
  methods: {
    editFun(index) {
      this.currentFuncId = index;
      if (!index) {
        this.currentStatusId = false;
      }
    },
    // 删除某个功能
    delFun(index) {
      this.$delete(this.funcDefine, index);
    },
    // 展开某个状态
    unfoldStatus(index) {
      this.currentStatusId = this.currentStatusId === index ? false : index;
    },
    // 使用某个状态
    selectOption(item, index) {
      if (['undefined', 'default'].includes(item)) return;
      this.$set(this.checkingStatus, index, !this.checkingStatus[index]);
    },
    // 新增额外命令
    addCmd() {
      if (this.extraCmd === '' || !this.checknumber(this.extraCmdVal) || typeof this.extraCmd !== 'string' || this.checknumber(this.extraCmd)) return;
      if (this.currentStatus.moreCommand) {
        this.$set(this.currentStatus.moreCommand, this.extraCmd, this.extraCmdVal);
      } else {
        const map = {};
        map[this.extraCmd] = this.extraCmdVal;
        this.$set(this.currentStatus, 'moreCommand', map);
      }
      this.extraCmd = '';
      this.extraCmdVal = '';
    },
    // 删除额外命令
    delCmd(key) {
      if (this.currentStatus.moreCommand[key]) {
        this.$delete(this.currentStatus.moreCommand, key);
      }
    },
    // 插入自定义函数-原功能执行前后
    useCustomizeReplace() {
      this.$set(this.currentStatus.customize, "after", undefined);
      this.$set(this.currentStatus.customize, "before", undefined);
    },
    // 插入自定义函数-代替原功能
    useCustomizeInsert() {
      this.$set(this.currentStatus.customize, "replace", undefined);
    },
    checknumber (String) {
      const reg = /^[0-9]+$/;
      if (reg.test(String)) {
        return true;
      }
      return false;
    }
  }
};
</script>
