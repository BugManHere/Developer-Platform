<template>
  <div class="home">
    <div class="card-table">
      <div @click="setDialogType(true)">
        <div class="main">
          <div class="body">
            <svg
              t="1570514807789"
              class="icon plus"
              viewBox="0 0 1027 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7108"
              width="200"
              height="200"
            >
              <path
                d="M 927.878 467.618 h -377.118 v -365.861 c 0 -16.8859 -16.8859 -39.4004 -39.4004 -39.4004 c -22.5145 0 -39.4004 22.5145 -39.4004 45.029 v 365.861 H 106.097 c -22.5145 -5.62863 -45.029 16.8859 -45.029 39.4004 s 22.5145 39.4004 39.4004 39.4004 h 365.861 v 365.861 c 5.62863 22.5145 22.5145 45.029 45.029 45.029 s 39.4004 -22.5145 39.4004 -39.4004 v -371.49 h 371.49 c 22.5145 0 39.4004 -22.5145 39.4004 -39.4004 s -11.2573 -45.029 -33.7718 -45.029 Z"
                fill=""
                p-id="7109"
              ></path>
            </svg>
            <span v-show="developType === 0">添加新产品</span>
            <span v-show="developType === 1">添加模板</span>
          </div>
        </div>
      </div>
      <!-- 设备列表 -->
      <div
        v-for="(item, index) in hasDeviceList"
         v-show="developType === 0"
        :key="index"
        @click="goProductPage(index)"
      >
        <div
          class="main"
          v-if="hasDeviceList.length && productTypeList.length"
        >
          <div class="body">
            <div class="message-top">
              <img :src="require(`@public/img/product/${productTypeList[item.productID].deviceTypeList[item.deviceID].img}`)">
              <div>
                <span v-text="item.deviceName"/>
                <span>创建时间：{{item.createTime}}</span>
              </div>
              <span v-text="'删除设备'"/>
            </div>
            <div class="message-bottom">
              <div
                v-for="(val, key) in productInfo(item)"
                :key="key"
              >
                <span v-text="key"/>
                <span v-text="val"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="overlay-backdrop"
      v-show="isShowDialog"
    />
    <Dialog
      @hideDialog="setDialogType"
      v-fade:show="isShowDialog"
    />
    {{deviceInfoList}}
  </div>
</template>

<script>
import Dialog from "@components/Dialog";
import https from "@/https";
import { mapState, mapMutations } from "vuex";

export default {
  name: "home",
  components: {
    Dialog
  },
  data() {
    return {
      isShowDialog: false
    };
  },
  computed: {
    ...mapState({
      admin: state => state.userModule.admin,
      developType: state => state.pulicModule.developType,
      productTypeList: state => state.devModule.productTypeList,
      hasDeviceList: state => state.devModule.hasDeviceList,
      templates: state => state.devModule.templates,
    }),
    deviceInfoList() {
      const result = [];
      if (this.developType === 0) {
         
      } else if (this.developType === 1) {
        const keys = this.templates.map(item => {
          return {
            productKey: item.productKey,
            deviceKey: item.deviceKey,
          };
        });
        keys.forEach((keysItem, index) => {
          result.push(this.productTypeList.find(productItem => productItem._id === keysItem.productKey)
            .deviceTypeList.find(deviceItem => deviceItem._id === keysItem.deviceKey))
        })
      }
      console.log(result);
      return this.productTypeList;
    }
  },
  watch: {
    developType(newVal) {
      if (newVal === 1) {
        https.fetchGet("/template")
          .then(data => {
            this.setDevModule(["templates", data.data]);
          });
      }
    }
  },
  mounted() {
    https
      .fetchGet("/productType")
      .then(data => {
        const productTypeList = data.data;
        this.setDevModule(["productTypeList", productTypeList]);
      })
      .catch(err => {
        console.log(err);
      });
    https
      .fetchPost("/device", { admin: this.admin })
      .then(data => {
        const hasDeviceList = data.data.hasDeviceList;
        this.setDevModule(["hasDeviceList", hasDeviceList]);
        const funcDefineList = {};
        this.hasDeviceList.forEach(val => {
          funcDefineList[val._id] = val.funcDefineList;
        });
        this.setFuncModule(['funcDefineList', funcDefineList]);
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    ...mapMutations({
      setDevModule: "SET_DEV_MODULE",
      setFuncModule: "SET_FUNC_MODULE",
    }),
    setDialogType(val) {
      this.isShowDialog = val;
    },
    goProductPage(val) {
      this.$router.push({
        path: `Product/${this.hasDeviceList[val]._id}`
      });
    },
    productInfo(item) {
      return {
        产品品牌: item.brand,
        产品品类: this.productTypeList[item.productID].deviceTypeList[item.deviceID]
          .name,
        产品型号: item.productModel,
        通信协议: item.protocol
      };
    }
  }
};
</script>
