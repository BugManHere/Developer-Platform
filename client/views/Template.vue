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
          <div class="btn-group" role="group" aria-label="..." v-for="(item, index) in pageOption.rightBtnList" :key="index">
            <button type="button" class="btn btn-default" @click="item.method" v-html="item.name" />
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
        :key="setTempStep * 10 + index"
        @click="item.func.parameter !== undefined ? item.func.defined(item.func.parameter) : item.func.defined()"
        v-text="item.text"
      />
    </div>
    <Panel :options="QuoteFuncOptions" />
  </div>
</template>

<script>
import { randomKey } from '@/utils';
import ActiveTable from '@components/layout/Table/ActiveFunc';
import InertiaTable from '@components/layout/Table/InertiaFunc';
import LogicTable from '@components/layout/Table/Logic';
import OtherConfigTable from '@components/layout/Table/OtherConfig';
import Panel from '@components/layout/Panel/index';
import https from '@/https';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'ProductInfo',
  components: {
    ActiveTable,
    InertiaTable,
    LogicTable,
    OtherConfigTable,
    Panel
  },
  props: ['tempID'],
  data() {
    return {
      quoteShow: false
    };
  },
  destroyed() {
    this.setPulicModule({ setTempStep: 0 });
  },
  created() {
    const productID = this.tempID.split('&')[0];
    const seriesID = this.tempID.split('&')[1];
    this.setTempModule({ tempID: this.tempID }); // 模板id
    this.setTempModule({ productID }); // 模板id对应的productID
    this.setTempModule({ seriesID }); // 模板id对应的deviceID
  },
  async mounted() {
    // 进入页面时判断是否存在数据，不存在就获取
    if (!this.funcDefine) {
      const res = await https.fetchGet('/template');
      this.setTempModule({ templates: res.data });
    }
    if (!Object.keys(this.productTypeList).length) {
      const res = await https.fetchGet('/productType');
      this.setPulicModule({ productTypeList: res.data });
    }
  },
  computed: {
    ...mapState({
      productTypeList: state => state.pulicModule.productTypeList,
      productID: state => state.tempModule.productID,
      seriesID: state => state.tempModule.seriesID,
      setTempStep: state => state.pulicModule.setTempStep,
      currentFuncId: state => state.tempModule.currentFuncId,
      productInfo: (state, getters) => getters.productInfo,
      funcDefine: (state, getters) => getters.funcDefine,
      labelList: (state, getters) => getters.labelList
    }),
    templateFuncNum() {
      if (!this.funcDefine) return 0;
      return this.funcDefine.length;
    },
    // 页面内容设置
    pageOption() {
      switch (this.setTempStep) {
        case 0:
          return {
            title: '显性功能-按钮',
            rightBtnList: [
              {
                name: '添加',
                method: this.$_addTempFunc
              },
              {
                name: '引入',
                method: this.$_quote
              }
            ],
            component: 'ActiveTable'
          };
        case 1:
          return {
            title: '隐性功能',
            rightBtnList: [
              {
                name: '添加',
                method: this.$_addTempFunc
              },
              {
                name: '引入',
                method: this.$_addTempFunc
              }
            ],
            component: 'InertiaTable'
          };
        case 2:
          return {
            title: '逻辑',
            rightBtnList: [
              {
                name: '查看所有逻辑',
                method: this.showAllLogic
              }
            ],
            component: 'LogicTable'
          };
        // case 3:
        //   return {
        //     title: "其他配置",
        //     component: "OtherConfigTable"
        //   };
        default:
          return {};
      }
    },
    // 【引入功能】页面设置
    QuoteFuncOptions() {
      let options = {
        show: this.quoteShow,
        class: 'medium',
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
            selfMethod: ''
          }
        },
        component: {
          name: 'QuoteFunc',
          ref: 'QuoteFunc'
        }
      };
      return options;
    },
    // 底部按钮设置
    bottomBtnOptions() {
      const result = [];
      const save = {
        text: '暂存',
        func: {
          defined: this.saveTempFunc,
          parameter: false
        },
        class: 'btn-default'
      };
      const lastStep = {
        text: '上一步',
        func: {
          defined: this.setStep
        },
        class: 'btn-default'
      };
      const saveAndNext = {
        text: '下一步',
        func: {
          defined: () => {
            this.setStep(1);
          }
        },
        class: 'btn-primary'
      };
      const done = {
        text: '保存配置',
        func: {
          defined: this.setTempDone
        },
        class: 'btn-primary'
      };
      switch (this.setTempStep) {
        case 0:
          result.push(save, saveAndNext);
          return result;
        case 1:
          result.push(save, lastStep, saveAndNext);
          return result;
        case 2:
          result.push(lastStep, done);
          // result.push(save, lastStep, saveAndNext);
          return result;
        case 3:
          result.push(lastStep, done);
          return result;
        default:
          result.push(lastStep, done);
          return result;
      }
    },
    selectTempInfo() {
      if (!this.productTypeList || !this.productTypeList.length || !this.productID || !this.seriesID) return {};
      return this.productTypeList.find(item => item._id === this.productID).seriesList.find(item => item._id === this.seriesID);
    },
    imgPath() {
      if (!this.selectTempInfo || !this.selectTempInfo.img) return require('@public/img/product/Hangon.png');
      return require(`@public/img/product/${this.selectTempInfo.img}`);
    },
    deviceInfo() {
      const deviceName = this.selectTempInfo.name;
      return {
        设备品类: deviceName,
        创建时间: this.productInfo.createTime,
        引用次数: this.productInfo.useTime,
        修改人: this.productInfo.editUser,
        修改时间: this.productInfo.editTime,
        功能数量: this.templateFuncNum
      };
    }
  },
  methods: {
    ...mapMutations({
      setTempModule: 'SET_TEMP_MODULE',
      setPulicModule: 'SET_PULIC_MODULE'
    }),
    ...mapActions({
      saveTempFunc: 'SAVE_TEMP_FUNC', // 暂存功能
      setTempDone: 'SET_TEMP_DONE', // 保存某一功能
      addTempFunc: 'ADD_TEMP_FUNC' // 添加功能
    }),
    // 点击添加
    $_addTempFunc() {
      const name = `未命名${randomKey(4)}`;
      const insertMap = {
        name: name,
        identifier: '-',
        json: '-',
        type: 'inertia',
        statusDefine: {
          default: {
            name: '默认',
            value: 0,
            isCheck: false,
            customize: false
          },
          undefined: {
            name: '其他',
            value: '-',
            isCheck: false,
            customize: false
          }
        },
        order: [],
        map: {
          default: 'status_1',
          undefined: 'default'
        }
      };
      if (!this.setTempStep) {
        insertMap.type = 'active';
        insertMap.map.status_1 = 'default';
        insertMap.statusDefine.status_1 = {
          name: '开启',
          value: 1,
          isCheck: true,
          customize: false
        };
        insertMap.order.push('status_1');
      }
      console.log(insertMap);
      this.addTempFunc(insertMap);
    },
    $_quote() {
      this.quoteShow = this.setTempStep ? 'inertia' : 'active';
    },
    setStep(val = -1) {
      this.setPulicModule({ setTempStep: this.setTempStep + val });
    },
    showAllLogic() {
      const selectLabel = {};
      selectLabel.col = Array(this.labelList.length).fill(true);
      selectLabel.row = Array(this.labelList.length).fill(true);
      this.setPulicModule({ selectLabel });
    }
  }
};
</script>
