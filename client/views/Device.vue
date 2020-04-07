<template>
  <div class="template">
    <div>
      <!-- 顶部信息栏 -->
      <div class="message">
        <!-- 头部 -->
        <div class="frame-header">
          <!-- 标题 -->
          <span v-text="'模板信息'" />
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
              <span> <i></i>文本：文本文 </span>
              <span> <i></i>文本：开发中 </span>
            </p>
            <p>
              <span class="done"> <i></i>文本：文本文 </span>
              <span class="done"> <i></i>文本：已完成 </span>
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
        :key="setDevStep * 10 + index"
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
import ActiveTable from "@components/Table/ActiveFunc";
import ImportFuncTable from "@components/Table/ImportFunc";
import OtherConfigTable from "@components/Table/OtherConfig";
import Panel from "@components/Panel/index";
import https from "@/https";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "ProductInfo",
  components: {
    ActiveTable,
    ImportFuncTable,
    OtherConfigTable,
    Panel
  },
  props: ["deviceKey"],
  data() {
    return {
      quoteShow: false,
    };
  },
  watch: {
    setDevStep(newVal) {
      if (newVal >= 2) {
        this.$router.push({ name: "Home" });
        this.$toast.info("保存成功");
      }
    }
  },
  destroyed() {
    this.setTempModule(["setDevStep", 0]);
  },
  created() {
    this.setDevModule(["deviceKey", this.deviceKey]); // 记录设备key
  },
  async mounted() {
    // 进入页面时判断是否存在数据，不存在就获取
    if (!this.hasDeviceList.length) {
      const admin = this.admin;
      const res = await https.fetchPost("/userDevice", { admin });
      this.setDevModule(['hasDeviceList', res.data]);
    }
    if (!Object.keys(this.productTypeList).length) {
      const res = await https.fetchGet("/productType");
      this.setPulicModule(["productTypeList", res.data]);
    }
    if (!this.funcDefine) {
      const res = await https.fetchGet("/template");
      this.setTempModule(["templates", res.data]);
    }
    const productID = this.currentDevice.productID;
    const seriesID = this.currentDevice.seriesID;
    this.setTempModule(['productID', productID]); // 模板id对应的productID
    this.setTempModule(['seriesID', seriesID]);  // 模板id对应的deviceID
  },
  computed: {
    ...mapState({
      admin: state => state.userModule.admin,
      developType: state => state.pulicModule.developType, // 0：产品开发 1：模板开发
      productTypeList: state => state.pulicModule.productTypeList,
      hasDeviceList: state => state.devModule.hasDeviceList,
      setDevStep: state => state.pulicModule.setDevStep,
      currentFuncId: state => state.tempModule.currentFuncId,
      currentDevice: (state, getters) => getters.currentDevice, // hasDeviceList下对应的设备
      funcImport: (state, getters) => getters.funcImport, // currentDevice里的funcImport
      funcDefine: (state, getters) => getters.funcDefine, // currentDevice里的funcImport
    }),
    // 页面内容设置
    pageOption() {
      switch (this.setDevStep) {
        case 0:
          return {
            title: "功能定义",
            rightBtnList: [
              {
                name: '引入',
                method: this.$_quote
              }
            ],
            component: "ImportFuncTable"
          };
        case 1:
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
        class: 'big',
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
            method: () => {
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              this.quoteShow = false;
            },
            selfMethod: "importDone",
            both: true
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
      const lastStep = {
        text: "上一步",
        func: {
          defined: this.setStep
        },
        class: "btn-default"
      };
      const saveAndNext = {
        text: "下一步",
        func: {
          defined: this.saveRes
        },
        class: "btn-primary"
      };
      const done = {
        text: "保存配置",
        func: {
          defined: this.settingDone
        },
        class: "btn-primary"
      };
      switch (this.setDevStep) {
        case 0:
          result.push(saveAndNext);
          return result;
        case 1:
          result.push(lastStep, done);
          return result;
        default:
          result.push(lastStep, done);
          return result;
      }
    },
    selectDevInfo() {
      if (!this.productTypeList || !this.productTypeList.length) return {};
      const productID = this.currentDevice.productID;
      const seriesID = this.currentDevice.seriesID;
      return this.productTypeList.find(item => item._id === productID).seriesList.find(item => item._id === seriesID);
    },
    imgPath() {
      if (!this.selectDevInfo || !this.selectDevInfo.img) return require('@public/img/product/Hangon.png');
      return require(`@public/img/product/${this.selectDevInfo.img}`);
    },
    deviceInfo() {
      if (!this.currentDevice) return {};
      return {
        设备品类: this.currentDevice.productName,
        创建时间: this.currentDevice.createTime,
        产品型号: this.currentDevice.productModel,
        通讯协议: this.currentDevice.protocol,
        修改时间: this.currentDevice.editTime,
        产品名称: this.currentDevice.deviceName,
      };
    }
  },
  methods: {
    ...mapMutations({
      setDevModule: "SET_DEV_MODULE",
      setTempModule: "SET_TEMP_MODULE",
      setPulicModule: "SET_PULIC_MODULE",
    }),
    ...mapActions({
      setDevDone: 'SET_DEV_DONE'
    }),
    $_quote() {
      if (this.developType === 0) {
        this.quoteShow = ['inertia', 'active'];
      } else if (this.developType === 1) {
        this.quoteShow = this.setDevStep ? 'inertia' : 'active';
      }
    },
    setStep(val = -1) {
      this.setPulicModule(["setDevStep", this.setDevStep + val]);
    },
    // 点击暂存
    saveRes() {
      this.setStep(1);
    },
    settingDone() {
      this.setDevDone();
    }
  }
};
</script>
