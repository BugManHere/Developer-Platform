<template>
  <div class="panel-body">
    <div
      class="status"
      :class="{ unfold: currentStatusId === index }"
      v-for="(item, index) in allStatusList"
      :key="index"
    >
      <div class="edit-optional" :class="{ must: ['undefined', 'default'].includes(item) }">
        <div
          class="edit-header"
          :class="{selectable: !delStatusType}"
          @mouseup="unfoldStatus(index)"
        >
          <div @mouseup.stop="isUnfold(index)" :class="{'change-color': !editName && currentStatusId === index}">
            <input
              type="text"
              class="form-control"
              v-if="editName && currentStatusId === index"
              v-model="editName"
            />
            <span v-else v-text="currentFun.statusDefine[item].name"/>
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
              <option value="after">执行前</option>
              <option value="before">执行后</option>
              <option value="replace">替代</option>
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
                <td v-text="key"/>
                <td v-text="item"/>
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
      allStatusList: [], // 功能对应的状态列表
      useCustomize: false, // 是否使用自定义指令
      customizeType: 0,
      addStatusType: false, // 是否处于添加状态
      extraCmd: "", // 额外命令字段
      extraCmdVal: "", // 额外命令值
      editName: false, // 编辑功能名称
      $_selectStatusList: [], // 输出的状态列表
    };
  },
  mounted() {
   this.init();
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.funcModule.currentFuncId,
      deviceKey: state => state.funcModule.deviceKey,
      delStatusType: state => state.funcModule.delStatusType,
      selectStatusList: state => state.funcModule.selectStatusList,
      funcDefine: (state, getters) => getters.funcDefine,
    }),
    statusLen() {
      return this.allStatusList.length;
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
        return this.currentFun.statusDefine[this.allStatusList[id]];
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
          this.customizeType = this.currentStatus.customize;
        }
      });
      this.setFuncObject(["currentStatusId", newVal]);
    },
    useCustomize(newVal) {
      this.customizeType = newVal ? 'after' : false;
    },
    customizeType(newVal) {
      this.setCustomize(newVal);
    },
    delStatusType() {
      this.clearSelect();
    }
  },
  methods: {
    ...mapMutations({
      setFuncObject: "SET_FUNC_OBJECT",
      setFuncDefine: "SET_FUNC_DEFINE",
    }),
    init() {
      // 复制funcDefine
      this.$_funcDefine = deepCopy(this.funcDefine);
      // 初始化statusList
      if (isPositiveNum(this.currentFuncId)) {
        const keys = Object.keys(
          this.$_funcDefine[this.currentFuncId].statusDefine
        );
        this.allStatusList = keys;
      } else {
        this.allStatusList.length = 0;
      }
      // 初始化orderList
      this.$_selectStatusList = this.selectStatusList || this.funcDefine[this.currentFuncId].order.concat();
      this.setFuncObject(["selectStatusList", this.$_selectStatusList.concat()]);
    },
    delStatus() {
      const arr = this.checkingStatus.concat();
      let delNum = 0;
      arr.forEach((val, i) => {
        const index = i - delNum;
        if (index !== 0 && val) {
          const delKey = this.allStatusList[index];
          this.$delete(this.allStatusList, index);
          this.$delete(this.checkingStatus, index);
          this.$delete(
            this.$_funcDefine[this.currentFuncId].statusDefine,
            delKey
          );
          this.$_selectStatusList.remove(delKey);
          this.setFuncObject(["selectStatusList", this.$_selectStatusList.concat()]);
          delNum += 1;
        }
      });
    },
    addStatus() {
      let key;
      if (this.allStatusList.length === 2) {
        key = 'status_1';
      } else {
        const str = this.allStatusList.toString();
        const num = Math.max(...str.match(/\d+/g).map(Number)) + 1; // 找最大值然后+1
        key = `status_${num}`;
      }
      this.$_funcDefine[this.currentFuncId].statusDefine[key] = {
        name: `未命名${randomKey(4)}`,
        value: 1,
        status: "on",
        isCheck: true,
        customize: false
      };
      this.allStatusList.push(key);
      this.checkingStatus.push(false);
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
        ![0, 1].includes(index)
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
            this.allStatusList[this.currentStatusId]
          ].moreCommand,
          this.extraCmd,
          this.extraCmdVal
        );
      } else {
        const map = {};
        map[this.extraCmd] = this.extraCmdVal;
        this.$set(
          this.$_funcDefine[this.currentFuncId].statusDefine[
            this.allStatusList[this.currentStatusId]
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
            this.allStatusList[this.currentStatusId]
          ].moreCommand,
          key
        );
        this.$forceUpdate();
      }
    },
    // 插入自定义函数
    setCustomize(val='after') {
      this.$set(
        this.currentStatus,
        'customize',
        val
      );
    },
    nextStep() {
      const nameMap = {};
      const statusDefine = this.currentFun.statusDefine;
      for (let i = 0; i < this.allStatusList.length; i += 1) {
        const name = statusDefine[this.allStatusList[i]].name;
        if (nameMap[name]) return this.$toast.warning('不允许存在同名状态');
        nameMap[name] = true;
      }
      this.setFuncObject(['allStatusList', this.allStatusList.concat()]);
      this.setFuncDefine([this.deviceKey, deepCopy(this.$_funcDefine)]);
      this.setFuncObject(["statusSetStep", 1]);
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
