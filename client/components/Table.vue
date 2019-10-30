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
            <div class="panel-body">
              <!-- <div
                class="status"
                :class="{unfold: currentStatusId === 0}"
              >
                <div class="edit-optional">
                  <div
                    class="edit-header arrow-down"
                    @click="unfoldStatus(0)"
                  >
                    <span>默认状态</span>
                  </div>
                  <div
                    class="edit-check checking"
                    style="opacity: .5"
                  />
                </div>
              </div>
              <div
                class="status"
                :class="{unfold: currentStatusId === 1}"
              >

                <div class="edit-optional">
                  <div
                    class="edit-header"
                    @click="unfoldStatus(1)"
                  >
                    <span>其他状态</span>
                  </div>
                  <div
                    class="edit-check checking"
                    style="opacity: .5"
                  />
                </div>
              </div> -->
              <div
                class="status"
                :class="{unfold: currentStatusId === index}"
                v-for="(item, index) in statusList"
                :key="index"
              >
                <div class="edit-optional">
                  <div
                    class="edit-header"
                    @click="unfoldStatus(index)"
                  >
                    <span>{{ currentFun.statusDefine[item].name }}</span>
                  </div>
                  <div
                    class="edit-check"
                    :class="{checking: checkingStatus[index]}" 
                    @click="selectOption(index)"
                  />
                </div>
                <div class="optional-more" v-if="currentStatusId !== false">
                    {{funcDefine_[currentFuncId].statusDefine[statusList[currentStatusId]].isCheck}}
                  <div class="col-md-12">
                    <div class="col-md-6">
                      <label
                        for="inputPassword"
                        class="control-label"
                      >状态定义</label>
                      <select class="form-control" v-model="funcDefine_[currentFuncId].statusDefine[statusList[currentStatusId]].status">
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
                        v-model="funcDefine_[currentFuncId].statusDefine[statusList[currentStatusId]].value"
                      >
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="col-md-6">
                      <label
                        for="inputPassword"
                        class="control-label"
                      >是否检查互斥</label>
                      <select class="form-control" v-model="funcDefine_[currentFuncId].statusDefine[statusList[currentStatusId]].isCheck">
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
                        placeholder="开启状态"
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
                      <tbody v-else>
                        <tr class="active">
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="table table-bordered col-md-1">
                      <thead>
                        <tr>
                          <th> <button
                              type="button"
                              class="close"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">+</span>
                            </button></th>
                        </tr>
                      </thead>
                      <tbody v-if="currentStatus.moreCommand">
                        <tr
                          v-for="(item, key) in currentStatus.moreCommand"
                          :key="key"
                        >
                          <td> <button
                              type="button"
                              class="close"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&ndash;</span>
                            </button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
      funcDefine_: [],
      currentFuncId: false,
      currentStatusId: false,
      checkingStatus: [true, true, false],
      text: 'none'
    };
  },
  mounted() {
    this.funcDefine_ = this.funcDefine;
  },
  computed: {
    currentFun() {
      return this.funcDefine_[this.currentFuncId];
    },
    currentStatus() {
      if (!(this.currentFun && this.currentStatusId !== false)) return [];
      return this.currentFun.statusDefine[
        this.statusList[this.currentStatusId]
      ];
    },
    statusList() {
      if (!this.currentFun) return [];
      // const Arr = this.currentFun.statusDefine.touchOrder.slice(1);
      let Arr = this.currentFun.statusDefine.touchOrder;
      Arr.push("undefined");
      return Arr;
    }
  },
  methods: {
    editFun(index) {
      this.currentFuncId = index;
    },
    delFun() {},
    unfoldStatus(index) {
      this.currentStatusId = this.currentStatusId === index ? false : index;
    },
    selectOption(index) {
      this.$set(this.checkingStatus, index, !this.checkingStatus[index]);
    }
  }
};
</script>
