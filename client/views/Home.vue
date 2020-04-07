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
        v-for="(item, index) in deviceInfoList"
        :key="index"
        @click="goProductPage(item.id1, item.id2)"
      >
        <div class="main">
          <div class="body">
            <div class="message-top">
              <img :src="require(`@public/img/product/${item.imgPath}`)">
              <div>
                <span v-text="item.deviceName"/>
                <span>创建时间：{{item.createTime}}</span>
              </div>
              <span v-text="'删除设备'" v-show="developType === 0" @click.stop="delDevice(item.id1)"/>
            </div>
            <div class="message-bottom">
              <div
                v-for="(val, key) in item.productImshow"
                :key="key"
              >
                <span v-text="key"/>
                <span contenteditable v-text="val"/>
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
  </div>
</template>

<script>
import Dialog from "@components/Dialog";
import https from "@/https";
import { mapState, mapMutations, mapActions } from "vuex";

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
      developType: state => state.pulicModule.developType, // 0：产品开发 1：模板开发
      productTypeList: state => state.pulicModule.productTypeList,
      hasDeviceList: state => state.devModule.hasDeviceList,
      templates: state => state.tempModule.templates,
      funcDefine: (state, getters) => getters.funcDefine,
    }),
    deviceInfoList() {
      let result = [];
      if (this.developType === 0) {
         result = this.hasDeviceList.map(item => {
           return {
             imgPath: item.imgPath,
             deviceName: item.deviceName,
             createTime: item.createTime,
             id1: item._id,
             productImshow: this.productImshow(item)
            };
         });
      } else if (this.developType === 1) {
        result = this.templates.map(item => {
          if (!this.productTypeList.length) return {};
          const info = this.productTypeList.find(productItem => productItem._id === item.productID)
          .seriesList.find(deviceItem => deviceItem._id === item.seriesID);
          return {
            imgPath: info.img,
            deviceName: info.name,
            createTime: item.createTime,
            id1: item.productID,
            id2: item.seriesID,
            productImshow: this.productImshow(item)
          }
        })
      }
      return result;
    }
  },
  watch: {
    developType: {
      async handler(newVal) {
        if (newVal === 1) {
          // 进入页面时判断是否存在数据，不存在就获取
          if (!this.funcDefine) {
            const res = await https.fetchGet("/template");
            this.setTempModule(["templates", res.data]);
          }
          if (!Object.keys(this.productTypeList).length) {
            const res = await https.fetchGet("/productType");
            this.setPulicModule(["productTypeList", res.data]);
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    https
      .fetchGet("/productType")
        .then(data => {
          const productTypeList = data.data;
          this.setPulicModule(["productTypeList", productTypeList]);
        })
        .catch(err => {
          console.log(err);
        });
    https
      .fetchPost("/userDevice", { admin: this.admin })
        .then(data => {
          const hasDeviceList = data.data;
          this.setDevModule(["hasDeviceList", hasDeviceList]);
        })
        .catch(err => {
          console.log(err);
        });
  },
  methods: {
    ...mapMutations({
      setDevModule: "SET_DEV_MODULE",
      setFuncModule: "SET_TEMP_MODULE",
      setTempModule: "SET_TEMP_MODULE",
      setPulicModule: "SET_PULIC_MODULE",
    }),
    ...mapActions({
      delDev: "DEL_DEV",
    }),
    setDialogType(val) {
      this.isShowDialog = val;
    },
    // 跳转到设备定义页面
    goProductPage(id1, id2) {
      if (this.developType === 0) {
        this.$router.push({
          path: `Device/${id1}`
        });
      } else if (this.developType === 1) {
        this.$router.push({
          path: `Template/${id1}&${id2}`
        });
      }
    },
    // 根据id获取产品信息
    getProductInfo(productID) {
      if (!this.productTypeList.length) return {};
      return this.productTypeList.find(item => item._id === productID);
    },
    // 根据id获取产品信息
    getDeviceInfo(productID, seriesID) {
      if (!this.productTypeList.length) return {};
      return this.getProductInfo(productID).seriesList.find(item => item._id === seriesID);
    },
    // 显示用产品信息
    productImshow(item) {
      let result = {};
      if (this.developType === 0) {
        result = {
          产品品牌: item.brand,
          产品品类: item.productName,
          产品型号: item.productModel,
          通信协议: item.protocol
        }
      } else if (this.developType === 1) {
        result = {
          修改时间: item.editTime.split(' ').reduce((a ,b) => `${b} ${a}`), // 日期倒过来显示比较好看
          // 修改人: item.editUser,
          修改人: item.editUser,
          引用次数: item.useTime,
          功能数量: item.funcDefine.length
        }
      }
      return result;
    },
    // 删除设备
    delDevice(id) {
      this.$confirm.show({
        contnet: '确认删除',
        onConfirm: () => {
          this.delDev(id);
        },
      });

    }
  }
};
</script>
