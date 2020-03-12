<template>
  <div class="product">
    <div>
      <!-- 顶部信息栏 -->
      <div class="message">
        <!-- 头部 -->
        <div class="frame-header">
          <!-- 标题 -->
          <span v-text="'产品信息'" />
          <!-- 按钮 -->
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default" v-text="'修改'" />
          </div>
        </div>
        <!-- 内容 -->
        <div class="body">
          <!-- 设备图片 -->
          <img :src="imgPath" />
          <!-- 设备目前状态 -->
          <div>
            <p v-text="deviceInfo.deviceName" />
            <p>
              <span> <i></i>产品：开发中 </span>
              <span> <i></i>量产：未量产 </span>
            </p>
          </div>
          <!-- 设备信息 -->
          <div>
            <div v-for="(val, key) in deviceInfo" :key="key">
              <p v-text="key" />
              <p v-text="val" />
            </div>
          </div>
        </div>
      </div>
      <!-- 中间主要内容 -->
      <div class="panel-body" v-if="pageOption">
        <!-- 头部 -->
        <div class="frame-header">
          <!-- 标题 -->
          <span v-html="pageOption.title" />
          <!-- 按钮组 -->
          <div 
            class="btn-group"
            role="group"
            aria-label="..."
            v-for="(item, index) in pageOption.rightBtnList"
            :key="index">
            <button
              type="button"
              class="btn btn-default"
              @click="item.method"
              v-html="item.name"
            />
          </div>
        </div>
        <!-- 内容 -->
        <component :is="pageOption.component"></component>
      </div>
    </div>
    <!-- 底部按钮组 -->
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
    <Panel :options="QuoteFuncOptions"/>
  </div>
</template>

<script>
import { randomKey, deepCopy } from "@/utils";
import ActiveTable from "@components/Table/ActiveFunc";
import InertiaTable from "@components/Table/InertiaFunc";
import LogicTable from "@components/Table/Logic";
import OtherConfigTable from "@components/Table/OtherConfig";
import Panel from "@components/Panel/index";
import https from "@/https";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "ProductInfo",
  components: {
    ActiveTable,
    InertiaTable,
    LogicTable,
    OtherConfigTable,
    Panel
  },
  props: ["deviceKey"],
  data() {
    return {
      currentDev: {},
      deviceInfo: {},
      quoteShow: false,
      imgPath: require('@public/img/product/Hangon.png')
    };
  },
  watch: {
    devSetStep(newVal) {
      if (newVal === 3) {
        this.$toast.info("保存成功");
      } else if (newVal === 4) {
        this.$router.push({ name: "Home" });
      }
    }
  },
  destroyed() {
    this.setFuncModule(["devSetStep", 0]);
  },
  created() {
    this.setFuncModule(["deviceKey", this.deviceKey]);
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
        this.setDevModule(["hasDeviceList", data.data.hasDeviceList]);
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
      productFunc: state => state.devModule.productFunc,
      hasDeviceList: state => state.devModule.hasDeviceList,
      devSetStep: state => state.funcModule.devSetStep,
      currentFuncId: state => state.funcModule.currentFuncId,
      excludeMap: state => state.funcModule.excludeMap,
      hideMap: state => state.funcModule.hideMap,
      disableMap: state => state.funcModule.disableMap,
      funcDefine: (state, getters) => getters.funcDefine,
      // excludeMap: (state, getters) => getters.excludeMap,
      // hideMap: (state, getters) => getters.hideMap,
      // disableMap: (state, getters) => getters.disableMap,
      labelList: (state, getters) => getters.labelList,
    }),
    // 页面内容设置
    pageOption() {
      switch (this.devSetStep) {
        case 0:
          return {
            title: "活跃功能-按钮",
            rightBtnList: [
              {
                name: "添加",
                method: this.$_addFunc
              },
              {
                name: '引入',
                method: this.$_quote
              }
            ],
            component: "ActiveTable"
          };
        case 1:
          return {
            title: "惰性功能",
            rightBtnList: [
              {
                name: "添加",
                method: this.$_addFunc
              },
              {
                name: '引入',
                method: this.$_addFunc
              }
            ],
            component: "InertiaTable"
          };
        case 2:
          return {
            title: "逻辑",
            rightBtnList: [
              {
                name: "查看所有逻辑",
                method: this.showAllLogic
              }
            ],
            component: "LogicTable"
          };
        case 3:
          return {
            title: "其他配置",
            component: "OtherConfigTable"
          };
        default:
          return {};
      }
    },
    // 【引入功能】页面设置
    QuoteFuncOptions() {
      let options = {
        show: this.quoteShow,
        class: 'medium',
        title: '引入功能',
        miniBtn: {
          close: {
            method: () => {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.quoteShow = false;
            }
          }
        },
        bottomBtn: {
          done: {
            selfMethod: ""
          }
        },
        component: {
          name: "QuoteFunc",
          ref: "QuoteFunc"
        }
      };
      return options;
    },
    // 底部按钮设置
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
      setDevModule: "SET_DEV_MODULE",
      setFuncModule: "SET_FUNC_MODULE"
    }),
    ...mapActions({
      postFunc: "POST_FUNC",
      addFunc: "ADD_FUNC",
      setDone: "SET_DONE"
    }),
    init() {
      const hasDeviceList = this.hasDeviceList;
      const funcDefineList = {};
      // const excludeMap = {};
      // const hideMap = {};
      // const disableMap = {};
      hasDeviceList.forEach(val => {
        funcDefineList[val._id] = val.funcDefine;
        // const logicRes = JSON.parse(val.excludeMap.json);
        // const hideRes = JSON.parse(val.disableMap.json);
        // const disableRes = JSON.parse(val.disableMap.json);
        // excludeMap[val._id] = logicRes;
        // hideMap[val._id] = hideRes;
        // disableMap[val._id] = disableRes;
      });
      this.setFuncModule(["funcDefineList", funcDefineList]);
      // this.setFuncModule(["excludeMap", excludeMap]);
      // this.setFuncModule(["hideMap", hideMap]);
      // this.setFuncModule(["disableMap", disableMap]);
      this.getInfo();
      this.getProductFunc(); // 获取这个产品在其他地方定义过的功能
    },
    getInfo() {
      const hasDeviceList = deepCopy(this.hasDeviceList);
      this.currentDev = hasDeviceList.find(item => item._id === this.deviceKey);
      this.deviceInfo = {
        产品品牌: this.currentDev.brand,
        产品类别: this.currentDev.productName,
        产品名称: this.currentDev.deviceName,
        产品型号: this.currentDev.productModel,
        通讯协议: this.currentDev.protocol,
        创建时间: this.currentDev.createTime
      };
      // @public/img/product/Hangon.png
      this.imgPath = require(`@public/img/product/${this.currentDev.imgPath}`)
      this.setFuncModule(['productID', this.currentDev.productID]);
    },
    getProductFunc() {
      https.fetchGet("/productFunc", {productID: this.currentDev.productID})
        .then(res => {
          this.setDevModule(['productFunc', res.data]);
        })
    },
    // 点击添加
    $_addFunc() {
      const name = `未命名${randomKey(4)}`;
      const insertMap = {
        name: name,
        identifier: "-",
        json: "-",
        type: "inertia",
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
        insertMap.type = "active";
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
    $_quote() {
      this.quoteShow = this.devSetStep ? 'inertia' : 'active';
    },
    setStep(val = -1) {
      this.setFuncModule(["devSetStep", this.devSetStep + val]);
    },
    // 点击暂存
    saveRes(nextStep = true) {
      const funcDefine = JSON.stringify(this.funcDefine);
      this.postFunc({
        funcDefine,
        key: this.deviceKey
      }).then(status => {
        status && (nextStep ? this.setStep(1) : this.$toast.info("保存成功"));
      });
    },
    showAllLogic() {
      const selectLabel = {};
      selectLabel.col = Array(this.labelList.length).fill(true);
      selectLabel.row = Array(this.labelList.length).fill(true);
      this.setFuncModule(["selectLabel", selectLabel]);
    },
    settingDone() {
      const funcDefine = JSON.stringify(this.funcDefine);
      const excludeMap = JSON.stringify(this.excludeMap);
      const hideMap = JSON.stringify(this.hideMap);
      this.setStep(1);
      this.setDone({
        funcDefine,
        excludeMap,
        hideMap,
        key: this.deviceKey
      });
    }
  }
};
</script>
