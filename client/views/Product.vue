<template>
  <div class="product">
    <div>
      <div class="message">
        <div class="frame-header">
          <span v-text="'产品信息'" />
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default" v-text="'修改'" />
          </div>
        </div>
        <div class="body">
          <img src="@public/img/product/aircondition.png" />
          <div>
            <p v-text="deviceInfo.deviceName" />
            <p>
              <span> <i></i>产品：开发中 </span>
              <span> <i></i>量产：未量产 </span>
            </p>
          </div>
          <div>
            <div v-for="(val, key) in deviceInfo" :key="key">
              <p v-text="key" />
              <p v-text="val" />
            </div>
          </div>
        </div>
      </div>
      <!-- 主要内容 -->
      <div class="panel-body" v-if="pageOption">
        <div class="frame-header">
          <span v-html="pageOption.title" />
          <div class="btn-group" role="group" aria-label="..." v-if="pageOption.rightBtn">
            <button
              type="button"
              class="btn btn-default"
              v-show="pageOption.rightBtn.name"
              @click="pageOption.rightBtn.method"
              v-html="pageOption.rightBtn.name"
            />
          </div>
        </div>
        <component :is="pageOption.component"></component>
      </div>
    </div>
    <div class="bottom-panel" v-show="currentFuncId === false">
      <button
        type="button"
        v-for="(item, index) in bottomBtnOptions"
        class="btn"
        :class="item.class"
        :key="devSetStep * 10 + index"
        @click="
          item.func.parameter !== undefined
            ? item.func.defined(item.func.parameter)
            : item.func.defined()
        "
        v-text="item.text"
      />
    </div>
  </div>
</template>

<script>
import { randomKey, deepCopy } from "@/utils";
import BooleanTable from "@components/Table/Boolean";
import EnumerateTable from "@components/Table/Enumerate";
import LogicTable from "@components/Table/Logic";
import https from "@/https";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "ProductInfo",
  components: {
    BooleanTable,
    EnumerateTable,
    LogicTable
  },
  props: ["deviceKey"],
  data() {
    return {
      currentDev: {},
      deviceInfo: {}
    };
  },
  watch: {
    devSetStep(newVal) {
      if (newVal === 3) {
        this.$router.push({ name: "Home" });
        this.$toast.info("保存成功");
      }
    }
  },
  destroyed() {
    this.setFuncObject(["devSetStep", 0]);
  },
  created() {
    this.setFuncObject(["deviceKey", this.deviceKey]);
  },
  mounted() {
    if (
      Object.keys(this.hasDeviceList).length &&
      this.hasDeviceList.find(item => item._id === this.deviceKey)
    ) {
      this.init();
      return;
    }
    https
      .fetchPost("/device", { admin: this.admin })
      .then(data => {
        this.setDevState(["hasDeviceList", data.data.hasDeviceList]);
        this.init();
      })
      .catch(err => {
        this.$toast.warning("设备不存在，请重新添加");
        this.$router.push({ name: "Home" });
        console.log(err);
      });
  },
  computed: {
    ...mapState({
      admin: state => state.userModule.admin,
      productTypeList: state => state.devModule.productTypeList,
      hasDeviceList: state => state.devModule.hasDeviceList,
      devSetStep: state => state.funcModule.devSetStep,
      currentFuncId: state => state.funcModule.currentFuncId,
      funcDefine: (state, getters) => getters.funcDefine,
      logicMap: (state, getters) => getters.logicMap,
      disableMap: (state, getters) => getters.disableMap,
      labelList: (state, getters) => getters.labelList
    }),
    pageOption() {
      switch (this.devSetStep) {
        case 0:
          return {
            title: "功能-参与布局",
            rightBtn: {
              name: "添加",
              method: this.$_addFunc
            },
            component: "BooleanTable"
          };
        case 1:
          return {
            title: "功能-不参与布局",
            rightBtn: {
              name: "添加",
              method: this.$_addFunc
            },
            component: "EnumerateTable"
          };
        case 2:
          return {
            title: "互斥",
            rightBtn: {
              name: "查看所有互斥",
              method: this.showAllLogic
            },
            component: "LogicTable"
          };
        default:
          return {};
      }
    },
    bottomBtnOptions() {
      const result = [];
      const save = {
        text: "暂存",
        func: {
          defined: this.saveRes,
          parameter: false
        },
        class: "btn-default"
      };
      const lastStep = {
        text: "上一步",
        func: {
          defined: this.setStep
        },
        class: "btn-default"
      };
      const saveAndNext = {
        text: "保存并进入下一步",
        func: {
          defined: this.saveRes
        },
        class: "btn-primary"
      };
      const done = {
        text: "完成配置",
        func: {
          defined: this.settingDone
        },
        class: "btn-primary"
      };
      switch (this.devSetStep) {
        case 0:
          result.push(save, saveAndNext);
          return result;
        case 1:
          result.push(save, lastStep, saveAndNext);
          return result;
        case 2:
          result.push(lastStep, done);
          // result.push(save, lastStep, saveAndNext);
          return result;
        case 3:
          result.push(lastStep, done);
          return result;
        default:
          result.push(lastStep, done);
          return result;
      }
    }
  },
  methods: {
    ...mapMutations({
      setDevState: "SET_DEV_OBJECT",
      setFuncObject: "SET_FUNC_OBJECT"
    }),
    ...mapActions({
      postFunc: "POST_FUNC",
      addFunc: "ADD_FUNC",
      setDone: "SET_DONE"
    }),
    init() {
      const hasDeviceList = this.hasDeviceList;
      const funcDefineList = {};
      const logicMap = {};
      const disableMap = {};
      hasDeviceList.forEach(val => {
        funcDefineList[val._id] = val.funcDefine;
        const logicRes = JSON.parse(val.logicMap.json);
        const disableRes = JSON.parse(val.disableMap.json);
        logicMap[val._id] = logicRes;
        disableMap[val._id] = disableRes;
      });
      this.setFuncObject(["funcDefineList", funcDefineList]);
      this.setFuncObject(["logicMap", logicMap]);
      this.setFuncObject(["disableMap", disableMap]);
      this.getInfo();
    },
    getInfo() {
      const hasDeviceList = deepCopy(this.hasDeviceList);
      this.currentDev = hasDeviceList.find(item => item._id === this.deviceKey);
      this.deviceInfo = {
        产品品牌: this.currentDev.brand,
        产品品类: this.currentDev.deviceName,
        产品型号: this.currentDev.productModel,
        通讯协议: this.currentDev.protocol,
        创建时间: this.currentDev.createTime
      };
    },
    $_addFunc() {
      const name = `未命名${randomKey(4)}`;
      const insertMap = {
        name: name,
        identifier: "-",
        json: "-",
        type: "self",
        statusDefine: {
          default: {
            name: "默认",
            value: 0,
            isCheck: false,
            customize: false
          },
          undefined: {
            name: "其他",
            value: "-",
            isCheck: false,
            customize: false
          }
        },
        order: []
      };
      if (!this.devSetStep) {
        insertMap.type = "btn";
        insertMap.statusDefine.status_1 = {
          name: "开启",
          value: 1,
          isCheck: true,
          customize: false
        };
        insertMap.order.push("status_1");
      }
      const insertStr = JSON.stringify(insertMap);
      this.addFunc({
        insertMap: insertStr,
        key: this.deviceKey
      }).then(res => {
        res;
      });
    },
    setStep(val = -1) {
      this.setFuncObject(["devSetStep", this.devSetStep + val]);
    },
    saveRes(nextStep = true) {
      const funcDefine = JSON.stringify(this.funcDefine);
      const logicMap = JSON.stringify(this.logicMap);
      const disableMap = JSON.stringify(this.disableMap);
      this.postFunc({
        funcDefine,
        logicMap,
        disableMap,
        key: this.deviceKey
      }).then(status => {
        status && (nextStep ? this.setStep(1) : this.$toast.info("保存成功"));
      });
    },
    showAllLogic() {
      const selectLabel = {};
      selectLabel.col = Array(this.labelList.length).fill(true);
      selectLabel.row = Array(this.labelList.length).fill(true);
      this.setFuncObject(["selectLabel", selectLabel]);
    },
    settingDone() {
      const funcDefine = JSON.stringify(this.funcDefine);
      const logicMap = JSON.stringify(this.logicMap);
      const disableMap = JSON.stringify(this.disableMap);
      this.setDone({
        funcDefine,
        logicMap,
        disableMap,
        key: this.deviceKey
      });
    }
  }
};
</script>
