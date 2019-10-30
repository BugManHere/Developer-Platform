<template>
  <div class="product">
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
            <p>{{ hasDeviceList[deviceKey].deviceName }}</p>
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
      <div class="function">
        <div class="frame-header">
          <span>功能</span>
          <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default">添加</button>
          </div>
        </div>
        <Table
          :options="basicDefine"
          :func-define="funcDefine"/>
      </div>
  </div>
</template>

<script>
// import https from '../https';
import Table from '@components/Table';
import { mapState } from "vuex";

export default {
  name: 'ProductInfo',
  components: {
    Table
  },
  props: ['deviceKey'],
  data () {
    return {
      funcDefine: [
        {
          name: '左右扫风',
          identifier: 'SwLR',
          json: 'SwingLfRig',
          statusDefine: {
            // 默认状态
            default: {
              name: '默认状态',
              value: 0,
              status: 'off',
            },
            // 开启状态
            open: {
              name: '开启状态',
              value: 1,
              status: 'on',
              isCheck: true,
              moreCommand: {
                SlpMod: 1,
                SlpMod2: 1,
                SlpMod3: 1,
                SlpMo4d: 1,
                SlpMo5d: 1,
                SlpMo6d: 1,
              },
            },
            // 其他状态
            undefined: {
              name: '其他状态',
              status: 'on',
              nextState: 'default',
            },
            // 点击执行顺序
            touchOrder: ['default', 'open'],
          }
        },
      ]
    }
  },
  computed: {
    ...mapState({
      admin: state => state.admin,
      productTypeList: state => state.productTypeList,
      hasDeviceList: state => state.hasDeviceList,
    }),
    deviceInfo() {
      return {
        '产品品牌': this.hasDeviceList[this.deviceKey].brand,
        '产品品类': this.hasDeviceList[this.deviceKey].deviceName,
        '产品型号': this.hasDeviceList[this.deviceKey].productModel,
        '通讯协议': this.hasDeviceList[this.deviceKey].protocol,
        '创建时间': this.hasDeviceList[this.deviceKey].createTime,
      }
    },
    basicDefine() {
      const result = {
        caption: '属性',
        title: ['功能名称', '标识符', '控制字段', '状态定义', '操作'],
        content: [],
      };
      this.funcDefine.forEach((val, index) => {
        result.content[index] = [
          val.name,
          val.identifier,
          val.json,
        ];
        const statusJson = [];
        val.statusDefine.touchOrder.forEach(json => {
          statusJson.push(`${val.statusDefine[json].name}：${val.statusDefine[json].value}`)
        });
        result.content[index].push(statusJson);
      });
      console.log(result);
      return result;
    }
  },
}
</script>
