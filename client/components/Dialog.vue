<template>
  <div
    class="dialog"
    v-if="productTypeList.length"
  >
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">添加新产品
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="hideDialog"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </h3>
      </div>
      <div class="panel-body">
        <div
          class="table-left"
          v-show="currentStatus === 0"
        >
          <div class="list-group">
            <a
              class="list-group-item"
              v-for="(item, index) in productTypeList"
              :key="index"
              @click="selectProduct(item._id)"
              v-text="item.name"/>
          </div>
        </div>
        <div
          class="table-right"
          v-show="currentStatus === 0"
        >
          <div
            class="row"
            v-if="selectProductInfo && selectProductInfo.seriesList">
            <div
              class="col-xs-6 col-md-3"
              :class="{select: deviceInfo.seriesID === item._id}"
              v-for="(item, index) in selectProductInfo.seriesList"
              :key="index"
              @click="selectDevice(item._id)"
            >
              <p class="thumbnail">
                <img :src="require(`@public/img/product/${item.img}`)">
                <span v-text="item.devName"/>
              </p>
            </div>
          </div>
        </div>
        <div
          class="next-table"
          v-if="currentStatus === 1">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-2 control-label">品类</label>
              <div class="col-sm-10">
                <img :src="require(`@public/img/product/${selectDeviceInfo.img}`)">
                <span class="form-control-static" v-text="selectDeviceInfo.devName"/>
              </div>
            </div>
            <div class="form-group">
              <label
                for="inputPassword"
                class="col-sm-2 control-label"
              >品牌</label>
              <div class="col-sm-10">
                <span>格力</span>
              </div>
            </div>
            <div class="form-group">
              <label
                for="inputPassword"
                class="col-sm-2 control-label"
              >产品名称</label>
              <div class="col-sm-10">
                <input
                  type="text"
                  class="form-control"
                  id="inputText"
                  placeholder="请输入产品名称，如贝塔柜机"
                  @change="setDeviceName"
                >
              </div>
            </div>
            <div class="form-group">
              <label
                for="inputPassword"
                class="col-sm-2 control-label"
              >产品型号</label>
              <div class="col-sm-10">
                <input
                  type="text"
                  class="form-control"
                  id="inputText"
                  placeholder="请输入产品型号，如11005"
                  @change="setProductModel"
                >
              </div>
            </div>
            <div class="form-group">
              <label
                for="inputPassword"
                class="col-sm-2 control-label"
              >通信协议</label>
              <div class="col-sm-10">
                <label class="radio-inline">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio1" @click="deviceInfo.protocol = 'WiFi'" checked> WiFi
                </label>
                <label class="radio-inline">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio2" @click="deviceInfo.protocol = '蓝牙'" > 蓝牙
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        class="btn-group"
        role="group"
        aria-label="..."
        v-show="currentStatus === 0"
      >
        <button
          type="button"
          class="btn btn-primary"
          @click="goState(1)"
          v-show="developType === 0"
        >下一步</button>
        <button
          type="button"
          class="btn btn-primary"
          @click="createTemplate()"
          v-show="developType === 1"
        >创建模板</button>
      </div>
      <div
        class="btn-group"
        role="group"
        aria-label="..."
        v-show="currentStatus === 1"
      >
        <button
          type="button"
          class="btn btn-default"
          @click="goState(0)"
        >上一步</button>
        <button
          type="button"
          class="btn btn-primary"
          @click="submit"
        >提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import https from '../https';

export default {
  components: {
    // [Icon.name]: Icon
  },
  data() {
    return {
      currentStatus: 0,
      deviceInfo: {
        productID: 0,
        seriesID: 0,
        brand: '格力',
        deviceName: '',
        productModel: '',
        protocol: 'WiFi',
      }
    };
  },
  computed: {
    ...mapState({
      admin: state => state.userModule.admin,
      productTypeList: state => state.pulicModule.productTypeList,
      developType: state => state.pulicModule.developType,
      userDeviceList: state => state.devModule.userDeviceList,
    }),
    // 当前被选中的产品信息
    selectProductInfo() {
      if (!this.productTypeList.length) return {};
      return this.productTypeList.find(item => item._id === this.deviceInfo.productID);
    },
    // 当前被选中的产品信息
    selectDeviceInfo() {
      if (!this.productTypeList.length && this.selectProductInfo) return {};
      return this.selectProductInfo.seriesList.find(item => item._id === this.deviceInfo.seriesID);
    },
  },
  watch: {
    productTypeList(newVal) {
      // 获取到产品品类列表时赋予初值
      this.deviceInfo.productID = newVal[0]._id;
      this.deviceInfo.seriesID = newVal[0].seriesList[0]._id;
    }
  },
  methods: {
    ...mapMutations({
      setTempModule: "SET_TEMP_MODULE",
      setDevModule: "SET_DEV_MODULE",
    }),
    hideDialog() {
      this.$emit("hideDialog", false);
    },
    selectProduct(id) {
      this.deviceInfo.productID = id;
    },
    selectDevice(id) {
      this.deviceInfo.seriesID = id;
    },
    // 下一步
    goState(index) {
      if (!this.selectProductInfo || !this.selectProductInfo.seriesList) return; 
      this.currentStatus = index;
      const productList = this.selectDeviceInfo;
      this.deviceInfo.productName = productList.name; // 设置产品名字
      this.deviceInfo.imgPath = productList.img; // 图片地址
    },
    setDeviceName(evt) {
      this.$set(this.deviceInfo, 'deviceName', evt.target.value);
    },
    setProductModel(evt) {
      this.$set(this.deviceInfo, 'productModel', evt.target.value);
    },
    // 创建模板
    createTemplate() {
      const productID = this.deviceInfo.productID;
      const seriesID = this.deviceInfo.seriesID;
      https.fetchPost('/template/create', {
        productID, 
        seriesID,
        admin: this.admin, 
      }).then(data => {
          if (data.status === 201) {
            this.$toast.info("创建成功");
            this.setTempModule(['templates', data.data]);
            this.$emit("hideDialog", false);
          } else if (data.status === 200) {
            this.$toast.warning("已存在该模板");
          }
        })
        .catch(err => {
          console.log(err); 
        })
    },
    // 创建设备
    submit() {
      const deviceInfo = JSON.stringify(this.deviceInfo);
      https.fetchPost('/userDevice/create', {deviceInfo, admin: this.admin})
        .then((data) => {
          const userDeviceList = data.data;
          this.setDevModule(['userDeviceList', userDeviceList]);
        })
        .catch((err) => {
          console.log(err);
        })
      this.$emit("hideDialog", false);
    }
  }
};
</script>
