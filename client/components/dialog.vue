<template>
  <div
    class="dialog"
    v-if="productList.length"
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
              v-for="(item, index) in productList"
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
          <div class="row">
            <div
              class="col-xs-6 col-md-3"
              :class="{select: deviceInfo.deviceID === index}"
              v-for="(item, index) in productList[deviceInfo.productID].deviceList"
              :key="index"
              @click="selectDevice(index)"
            >
              <p class="thumbnail">
                <img :src="require(`@public/img/${item.img}`)">
                {{item.devName}}
              </p>
            </div>
          </div>
        </div>
        <div
          class="next-table"
          v-show="currentStatus === 1">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-2 control-label">品类</label>
              <div class="col-sm-10">
                <img :src="require(`@public/img/${productList[deviceInfo.productID].deviceList[deviceInfo.deviceID].img}`)">
                <span class="form-control-static">{{ productList[deviceInfo.productID].deviceList[deviceInfo.deviceID].devName }}</span>
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
                  placeholder="请输入产品名称"
                  @change="setDeviceName"
                >
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
        deviceName: ''
      }
    };
  },
  computed: {
    ...mapState({
      productList: state => state.productList
    }),
  },
  methods: {
    ...mapMutations({
      setState: "SET_STATE"
    }),
    hideDialog() {
      this.$emit("hideDialog", false);
    },
    selectProduct(index) {
      this.deviceInfo.productID = index;
    },
    selectDevice(index) {
      this.deviceInfo.deviceID = index;
    },
    goState(index) {
      this.currentStatus = index;
    },
    setDeviceName(evt) {
      console.log(evt.target.value);
      this.$set(this.deviceInfo, 'deviceName', evt.target.value);
    },
    submit() {
      https.fetchPost('/product', this.deviceInfo)
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
};
</script>
