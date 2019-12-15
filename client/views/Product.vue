<template>
  <div class="product">
    <div>
      <div class="message">
        <div class="frame-header">
          <span>产品信息</span>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default">修改</button>
          </div>
        </div>
        <div class="body">
          <img src="@public/img/product/aircondition.png">
          <div>
            <p>{{ deviceInfo.deviceName }}</p>
            <p>
              <span><i></i>产品：开发中</span>
              <span><i></i>量产：未量产</span>
            </p>
          </div>
          <div>
            <div
              v-for="(val, key) in deviceInfo"
              :key="key">
              <p>{{key}}</p>
              <p>{{val}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-body">
        <div class="frame-header">
          <span>功能</span>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default" @click="$_addFunc">添加</button>
          </div>
        </div>
        <FuncTable/>
      </div>
      <div class="panel-body">
        <div class="frame-header">
          <span>互斥</span>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default" @click="$_addFunc">预览所有</button>
          </div>
        </div>
        <LogicTable/>
      </div>
    </div>
      <div class="bottom-panel" v-show="currentFuncId === false">
        <div class="button-save">
          <button type="button" class="btn btn-primary btn-save" @click="postRes">保&emsp;存</button>
        </div>
      </div>
  </div>
</template>

<script>
import { randomKey } from "@/utils";
import FuncTable from '@components/FuncTable';
import LogicTable from '@components/LogicTable';
import https from "@/https";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: 'ProductInfo',
  components: {
    FuncTable,
    LogicTable
  },
  props: ['deviceKey'],
  data () {
    return {
      currentDev: {},
      deviceInfo: {},
    }
  },
  created() {
    this.setFuncObject(['deviceKey', this.deviceKey]);
  },
  mounted() {
    https
      .fetchPost("/device", { admin: this.admin })
      .then(data => {
        const hasDeviceList = data.data.hasDeviceList;
        this.setDevState(["hasDeviceList", hasDeviceList]);
        const funcDefineList = {};
        hasDeviceList.forEach(val => {
          funcDefineList[val._id] = val.funcDefine;
        });
        this.setFuncObject(['funcDefineList', funcDefineList]);
        this.getInfo()
        this.updatedList();
      })
      .catch(err => {
        this.$toast.warning('设备不存在，请重新添加');
        this.$router.push({name: 'Home'});
        console.log(err);
      });
  },
  computed: {
    ...mapState({
      admin: state => state.userModule.admin,
      productTypeList: state => state.devModule.productTypeList,
      hasDeviceList: state => state.devModule.hasDeviceList,
      currentFuncId: state => state.funcModule.currentFuncId,
      funcDefine: function getFuncDefine(state) {
        return state.funcModule.funcDefineList[this.deviceKey];
      },
    }),
  },
  methods: {
    ...mapMutations({
      setDevState: "SET_DEV_OBJECT",
      setFuncObject: "SET_FUNC_OBJECT",
      setFuncDefine: "SET_FUNC_DEFINE",
    }),
    ...mapActions({
      postFunc: "POST_FUNC",
      addFunc: "ADD_FUNC",
    }),
    updatedList() {
      // this.funcDefine = this.funcDefineList[this.deviceKey];
    },
    getInfo() {
      this.currentDev = this.hasDeviceList.find(item => item._id === this.deviceKey);
      this.deviceInfo = {
        '产品品牌': this.currentDev.brand,
        '产品品类': this.currentDev.deviceName,
        '产品型号': this.currentDev.productModel,
        '通讯协议': this.currentDev.protocol,
        '创建时间': this.currentDev.createTime,
      }
    },
    $_addFunc() {
      const name = `未命名${randomKey(4)}`;
      const insertMap = JSON.stringify({
        name: name,
        identifier: '-',
        json: '-',
        statusDefine: {
          default: {
            name: '默认',
            value: 0,
            isCheck: false,
            customize: false,
          },
          undefined: {
            name: '其他',
            value: '-',
            isCheck: false,
            customize: false,
          },
          status_1: {
            name: '开启',
            value: 1,
            isCheck: true,
            customize: false,
          },
        },
        order: ['default', 'status_1']
      });
      this.addFunc({
        insertMap,
        key: this.deviceKey,
      }).then(res => {
        res && this.updatedList();
      })
    },
    postRes() {
      const funcDefine = JSON.stringify(this.funcDefine);
      this.postFunc({
        funcDefine, 
        key: this.deviceKey
      });
    },
  },
}
</script>
