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
              @click="selectProduct(index)"
            >
              {{item.name}}
            </a>
          </div>
        </div>
        <div
          class="table-right"
          v-show="currentStatus === 0"
        >
          <div
            class="row"
            v-if="productTypeList[deviceInfo.productID].deviceTypeList">
            <div
              class="col-xs-6 col-md-3"
              :class="{select: deviceInfo.deviceID === index}"
              v-for="(item, index) in productTypeList[deviceInfo.productID].deviceTypeList"
              :key="index"
              @click="selectDevice(index)"
            >
              <p class="thumbnail">
                <img :src="require(`@public/img/${item.img}`)">
                <span>{{item.devName}}</span>
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
                <img :src="require(`@public/img/${productTypeList[deviceInfo.productID].deviceTypeList[deviceInfo.deviceID].img}`)">
                <span class="form-control-static">{{ productTypeList[deviceInfo.productID].deviceTypeList[deviceInfo.deviceID].devName }}</span>
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
                  placeholder="请输入产品型号，如s2"
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
        >下一步</button>
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
        deviceID: 0,
        brand: '格力',
        deviceName: '',
        productModel: '',
        protocol: 'WiFi',
      }
    };
  },
  computed: {
    ...mapState({
      productTypeList: state => state.devModule.productTypeList,
      hasDeviceList: state => state.devModule.hasDeviceList,
      funcDefineList: state => state.funcModule.funcDefineList
    }),
  },
  methods: {
    ...mapMutations({
      setDevState: "SET_DEV_OBJECT",
      setFuncObject: "SET_FUNC_OBJECT",
    }),
    hideDialog() {
      this.$emit("hideDialog", false);
    },
    selectProduct(index) {
      this.$set(this.deviceInfo, 'productID', index);
      // this.deviceInfo.productID = index;
      console.log(this.deviceInfo.productID);
    },
    selectDevice(index) {
      this.deviceInfo.deviceID = index;
    },
    goState(index) {
      if (!this.productTypeList[this.deviceInfo.productID].deviceTypeList) return;
      this.currentStatus = index;
    },
    setDeviceName(evt) {
      console.log(evt.target.value);
      this.$set(this.deviceInfo, 'deviceName', evt.target.value);
    },
    setProductModel(evt) {
      console.log(evt.target.value);
      this.$set(this.deviceInfo, 'productModel', evt.target.value);
    },
    submit() {
      https.fetchPost('/productType', this.deviceInfo)
        .then((data) => {
          const hasDeviceList = data.data.hasDeviceList;
          this.setDevState(['hasDeviceList', hasDeviceList]);
        })
        .catch((err) => {
          console.log(err);
        })
      this.$emit("hideDialog", false);
    }
  }
};
</script>
