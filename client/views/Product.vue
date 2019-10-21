<template>
  <div class="product">
      <div class="message">
        <div class="header">
          <span>产品信息</span>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default">修改</button>
          </div>
        </div>
        <div class="body">
          <img src="@public/img/product/aircondition.png">
          <div
            v-for="(val, key) in deviceInfo"
            :key="key">
            <p>{{val}}</p>
            <p>{{key}}</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import https from '../https';
import { mapState } from "vuex";

export default {
  name: 'ProductInfo',
  props: ['deviceKey'],
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      admin: state => state.admin,
      productList: state => state.productList,
      hasDeviceList: state => state.hasDeviceList,
    }),
    deviceInfo() {
      return {
        // '产品品牌': this.hasDeviceList[0].brand,
        // '产品品类': this.hasDeviceList[0].deviceName,
        // '产品型号': this.hasDeviceList[0].productModel,
        // '通讯协议': this.hasDeviceList[0].protocol,
        // '创建时间': this.hasDeviceList[0].createTime,
      }
    }
  },
  mounted() {
    https.fetchPost('/admin/device', {productKey: this.deviceKey})
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
  },
}
</script>
