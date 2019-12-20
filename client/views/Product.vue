<template>
  <div class="product">
    <div>
      <div class="message">
        <div class="frame-header">
          <span v-text="'产品信息'"/>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default" v-text="'修改'"/>
          </div>
        </div>
        <div class="body">
          <img src="@public/img/product/aircondition.png" />
          <div>
            <p v-text="deviceInfo.deviceName"/>
            <p>
              <span>
                <i></i>产品：开发中
              </span>
              <span>
                <i></i>量产：未量产
              </span>
            </p>
          </div>
          <div>
            <div v-for="(val, key) in deviceInfo" :key="key">
              <p v-text="key"/>
              <p v-text="val"/>
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
              @click="pageOption.rightBtn.method"
              v-html="pageOption.rightBtn.name"
            />
          </div>
        </div>
        <component :is="pageOption.component"></component>
      </div>
    </div>
    <div class="bottom-panel" v-show="currentFuncId === false">
      <button type="button" class="btn btn-default" @click="saveRes(false)" v-show="!devSetStep" v-text="'保存'"/>
      <button type="button" class="btn btn-primary" @click="saveRes" v-show="!devSetStep" v-text="'保存并进入下一步'"/>
      <button type="button" class="btn btn-default" @click="setStep(-1)" v-show="devSetStep" v-text="'上一步'"/>
      <button type="button" class="btn btn-primary" @click="saveRes" v-show="devSetStep" v-text="'完成配置'"/>
    </div>
  </div>
</template>

<script>
import { randomKey } from "@/utils";
import BooleanTable from "@components/Table/BooleanTable";
import EnumerateTable from "@components/Table/EnumerateTable";
import LogicTable from "@components/Table/LogicTable";
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
      if (newVal === 2) {
        this.$router.push({name: 'Home'});
        this.$toast.info('保存成功');
      }
    }
  },
  created() {
    this.setFuncObject(["deviceKey", this.deviceKey]);
  },
  mounted() {
    https
      .fetchPost("/device", { admin: this.admin })
      .then(data => {
        const hasDeviceList = data.data.hasDeviceList;
        this.setDevState(["hasDeviceList", hasDeviceList]);
        const funcDefineList = {};
        const logicMap = {};
        hasDeviceList.forEach(val => {
          funcDefineList[val._id] = val.funcDefine;
          const res = JSON.parse(val.logicMap.json);
          logicMap[val._id] = res;
        });
        this.setFuncObject(["funcDefineList", funcDefineList]);
        this.setFuncObject(["logicMap", logicMap]);
        this.getInfo();
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
      logicMap: (state, getters) => getters.logicMap
    }),
    pageOption() {
      if (this.devSetStep === 0) {
        return {
          title: "功能-布尔值",
          rightBtn: {
            name: "添加",
            method: this.$_addFunc
          },
          component: "BooleanTable"
        };
      } else if (this.devSetStep === 99999) {
        return {
          title: "功能-枚举值",
          rightBtn: {
            name: "添加",
            method: this.$_addFunc
          },
          component: "EnumerateTable"
        };
      } else if (this.devSetStep === 1) {
        return {
          title: "互斥",
          rightBtn: {
            name: "查看所有互斥",
            method: this.showAllLogic
          },
          component: "LogicTable"
        };
      }
      return {};
    }
  },
  methods: {
    ...mapMutations({
      setDevState: "SET_DEV_OBJECT",
      setFuncObject: "SET_FUNC_OBJECT"
    }),
    ...mapActions({
      postFunc: "POST_FUNC",
      addFunc: "ADD_FUNC"
    }),
    getInfo() {
      this.currentDev = this.hasDeviceList.find(
        item => item._id === this.deviceKey
      );
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
      const insertMap = JSON.stringify({
        name: name,
        identifier: "-",
        json: "-",
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
          },
          status_1: {
            name: "开启",
            value: 1,
            isCheck: true,
            customize: false
          }
        },
        order: ["status_1"]
      });
      this.addFunc({
        insertMap,
        key: this.deviceKey
      }).then(res => {
        res;
      });
    },
    setStep(val) {
      this.setFuncObject(["devSetStep", this.devSetStep + val]);
    },
    saveRes(nextStep=true) {
      const funcDefine = JSON.stringify(this.funcDefine);
      const logicMap = JSON.stringify(this.logicMap);
      this.postFunc({
        funcDefine,
        logicMap,
        key: this.deviceKey
      }).then(() => {
        !nextStep && this.$toast.info('保存成功');
        nextStep && this.setStep(1);
      });
    },
    showAllLogic() {
      const selectLabel = {};
      selectLabel.col = Array(this.funcDefine.length).fill(true);
      selectLabel.row = Array(this.funcDefine.length).fill(true);
      this.setFuncObject(["selectLabel", selectLabel]);
    }
  }
};
</script>
