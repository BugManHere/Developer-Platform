<template>
  <div class="panel-body">
    <div
      class="status"
      :class="{ unfold: currentStatusId === index }"
      v-for="(item, index) in statusList"
      :key="index"
    >
      <div class="edit-optional" :class="{ must: ['undefined', 'default'].includes(item) }">
        <div
          class="edit-header"
          :class="{selectable: !delStatusType}"
          @mouseup="unfoldStatus(index)"
        >
          <div @mouseup.stop="isUnfold(index)">
            <input
              type="text"
              class="form-control"
              v-if="editName && currentStatusId === index"
              v-model="editName"
            />
            <span v-else>
              {{
              currentFun.statusDefine[item].name
              }}
            </span>
            <div
              v-show="!['undefined', 'default'].includes(item) && currentStatusId === index"
              class="icon"
            >
              <span v-show="!editName" class="icon" />
              <span
                v-show="editName"
                :class="{ 'edit-ok': editName }"
                @click="changeStatusName(item)"
              />
              <span
                v-show="editName"
                :class="{ 'edit-remove': editName }"
                @click="editName = false"
              />
            </div>
          </div>
        </div>
        <div
          class="edit-check"
          v-show="delStatusType"
          :class="{ checking: checkingStatus[index], ban: ['default', 'undefined'].includes(item) }"
          @click="selectStatus(item, index)"
        />
      </div>
      <div class="optional-more" v-if="currentStatusId !== false">
        <div class="col-md-12">
          <div class="col-md-6">
            <label for="inputPassword" class="control-label">状态值</label>
            <input type="text" class="form-control" id="inputText" v-model="currentStatus.value" :disabled="item === 'undefined'"/>
          </div>
          <div class="col-md-6">
            <label for="inputPassword" class="control-label">是否检查互斥</label>
            <select class="form-control" v-model="currentStatus.isCheck">
              <option :value="true">是</option>
              <option :value="false">否</option>
            </select>
          </div>
        </div>
        <div class="col-md-12 customize">
          <div class="col-md-6">
            <label for="inputPassword" class="control-label">使用自定义函数</label>
            <select class="form-control" v-model="useCustomize">
              <option :value="true">是</option>
              <option :value="false">否</option>
            </select>
          </div>
          <div class="col-md-6" v-show="useCustomize">
            <label for="inputPassword" class="control-label">函数接入方式</label>
            <select class="form-control" v-model="customizeType">
              <option :value="0">执行前</option>
              <option :value="1">执行后</option>
              <option :value="2">替代</option>
            </select>
          </div>
        </div>
        <div class="col-md-12">
          <label for="inputPassword" class="control-label col-md-4">额外命令</label>
          <table class="table table-bordered col-md-8">
            <thead>
              <tr class="active">
                <th>字段</th>
                <th>值</th>
              </tr>
            </thead>
            <tbody v-if="currentStatus.moreCommand">
              <tr class="active" v-for="(item, key) in currentStatus.moreCommand" :key="key">
                <td>{{ key }}</td>
                <td>{{ item }}</td>
              </tr>
            </tbody>
            <tbody>
              <tr class="active">
                <td>
                  <input type="text" class="form-control" id="inputText" v-model="extraCmd" />
                </td>
                <td>
                  <input type="text" class="form-control" id="inputText" v-model="extraCmdVal" />
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
              <tr v-for="(item, key) in currentStatus.moreCommand" :key="key">
                <td>
                  <button type="button" class="close" aria-label="Close" @click="delCmd(key)">
                    <span aria-hidden="true">&minus;</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <button type="button" class="close" aria-label="Close" @click="addCmd">
                    <span aria-hidden="true">+</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div
      v-show="currentStatusId === false"
      class="btn-group btn-group-justified col-md-12"
      role="group"
      aria-label="..."
    >
      <div class role="group" v-if="delStatusType">
        <button type="button" class="btn btn-danger btn-del" @click="delStatus()">删除</button>
        <button type="button" class="btn btn-default btn-cancel" @click="delStatusMod(false)">取消</button>
      </div>
      <div class role="group" v-else>
        <button type="button" class="btn btn-primary btn-save" @click="jumpStep()">下一步</button>
      </div>
    </div>
  </div>
</template>

<script>
import { isPositiveNum, deepCopy, randomKey } from "@/utils";
import { mapMutations, mapState } from "vuex";

export default {
  data() {
    return {
      $_funcDefine: [], // 所有功能定义
      currentStatusId: false, // 当前状态ID
      checkingStatus: [], // 状态对应的布尔值（是否被选中）
      statusList: [], // 功能对应的状态列表
      useCustomize: false, // 是否使用自定义指令
      customizeType: 0,
      delStatusType: false, // 是否处于删除状态
      addStatusType: false, // 是否处于添加状态
      extraCmd: "", // 额外命令字段
      extraCmdVal: "", // 额外命令值
      editName: false, // 编辑功能名称
    };
  },
  mounted() {
    this.$_funcDefine = JSON.parse(JSON.stringify(this.funcDefine));
    if (isPositiveNum(this.currentFuncId)) {
      const keys = Object.keys(
        this.$_funcDefine[this.currentFuncId].statusDefine
      );
      this.statusList = keys;
    } else {
      this.statusList.length = 0;
    }
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.funcModule.currentFuncId,
      deviceKey: state => state.funcModule.deviceKey,
      funcDefine: function getFuncDefine(state) {
        return state.funcModule.funcDefineList[state.funcModule.deviceKey];
      }
    }),
    statusLen() {
      return this.statusList.length;
    },
    currentFun() {
      const id = this.currentFuncId;
      if (isPositiveNum(id)) {
        return this.$_funcDefine[id];
      }
      return {};
    },
    currentStatus() {
      const id = this.currentStatusId;
      if (isPositiveNum(id)) {
        return this.currentFun.statusDefine[this.statusList[id]];
      }
      return {};
    }
  },
  watch: {
    currentStatusId(newVal) {
      this.editName = false;
      this.$emit("changeStatus", newVal);
      this.$nextTick(() => {
        if (isPositiveNum(newVal)) {
          this.useCustomize = Boolean(this.currentStatus.customize);
        }
      });
    },
    useCustomize(newVal) {
      if (!newVal) {
        this.$set(this.currentStatus, "customize", false);
      }
    },
    customizeType(newVal) {
      this.setCustomize(newVal);
    }
  },
  methods: {
    ...mapMutations({
      setFuncObject: "SET_FUNC_OBJECT",
      setFuncDefine: "SET_FUNC_DEFINE",
    }),
    delStatus() {
      const len = this.statusLen - 1;
      const arr = this.checkingStatus.concat();
      console.log(arr);
      let delNum = 0;
      arr.forEach((val, i) => {
        const index = i - delNum;
        if (index !== 0 && index !== len && val) {
          const delKey = this.statusList[index];
          this.$delete(this.statusList, index);
          this.$delete(this.checkingStatus, index);
          // this.$nextTick(() => {
          this.$delete(
            this.$_funcDefine[this.currentFuncId].statusDefine,
            delKey
          );
          delNum += 1;
          // });
        }
      });
    },
    addStatus() {
      let key;
      const index = this.statusLen - 1;
      if (this.statusList.length === 2) {
        key = 'status_0';
      } else {
        const str = this.statusList.toString();
        const num = Math.max(...str.match(/\d+/g).map(Number)) + 1; // 找最大值然后+1
        key = `status_${num}`;
      }
      this.$_funcDefine[this.currentFuncId].statusDefine[key] = {
        name: `未命名${randomKey(4)}`,
        value: 1,
        status: "on",
        isCheck: true,
        customize: {}
      };
      this.statusList.push(key);
      this.checkingStatus.push(false);
    },
    delStatusMod(type) {
      if (type === this.delStatusType) return;
      this.delStatusType = type;
      if (type) {
        this.clearSelect();
      }
    },
    changeStatusName(key) {
      this.$set(
        this.$_funcDefine[this.currentFuncId].statusDefine[key],
        "name",
        this.editName
      );
      this.editName = false;
    },
    // 展开某个状态
    unfoldStatus(index) {
      if (this.delStatusType) return;
      this.currentStatusId = this.currentStatusId === index ? false : index;
    },
    isUnfold(index) {
      if (this.currentStatusId !== index) {
        this.unfoldStatus(index);
      } else if (
        !this.editName &&
        index !== 0 &&
        index !== this.statusLen - 1
      ) {
        this.editName = this.currentStatus.name;
      }
    },
    // 使用某个状态
    selectStatus(item, index) {
      if (["undefined", "default"].includes(item)) return;
      this.$set(this.checkingStatus, index, !this.checkingStatus[index]);
    },
    // 清空状态选择
    clearSelect(len = this.statusLen) {
      this.checkingStatus.length = 0;
      this.checkingStatus = Array(len).fill(false);
    },
    // 新增额外命令
    addCmd() {
      if (
        this.extraCmd === "" ||
        !this.checknumber(this.extraCmdVal) ||
        typeof this.extraCmd !== "string" ||
        this.checknumber(this.extraCmd)
      )
        return;
      if (this.currentStatus.moreCommand) {
        this.$set(
          this.$_funcDefine[this.currentFuncId].statusDefine[
            this.statusList[this.currentStatusId]
          ].moreCommand,
          this.extraCmd,
          this.extraCmdVal
        );
      } else {
        const map = {};
        map[this.extraCmd] = this.extraCmdVal;
        this.$set(
          this.$_funcDefine[this.currentFuncId].statusDefine[
            this.statusList[this.currentStatusId]
          ],
          "moreCommand",
          map
        );
      }
      this.extraCmd = "";
      this.extraCmdVal = "";
    },
    // 删除额外命令
    delCmd(key) {
      if (this.currentStatus.moreCommand[key]) {
        this.$delete(
          this.$_funcDefine[this.currentFuncId].statusDefine[
            this.statusList[this.currentStatusId]
          ].moreCommand,
          key
        );
        this.$forceUpdate();
      }
    },
    // 插入自定义函数
    setCustomize(index) {
      const key = ['after', 'before', 'replace'][index];
      this.$set(
        this.$_funcDefine[this.currentFuncId].statusDefine[
          this.statusList[this.currentStatusId]
        ],
        'customize',
        key
      );
    },
    jumpStep() {
      const nameMap = {};
      const statusDefine = this.currentFun.statusDefine;
      for (let i = 0; i < this.statusList.length; i += 1) {
        const name = statusDefine[this.statusList[i]].name;
        if (nameMap[name]) return this.$toast.warning('不允许存在同名状态');
        nameMap[name] = true;
      }
      this.setFuncObject(['statusList', this.statusList.concat()]);
      this.setFuncDefine([this.deviceKey, deepCopy(this.$_funcDefine)]);
      this.setFuncObject(["settingStep", 1]);
    },
    checknumber(String) {
      const reg = /^[0-9]+$/;
      if (reg.test(String)) {
        return true;
      }
      return false;
    },
  }
};
</script>
