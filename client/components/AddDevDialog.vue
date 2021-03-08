<template>
  <div class="dialog" v-if="productTypeList.length">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">
          添加新产品
          <button type="button" class="close" aria-label="Close" @click="hideDialog">
            <span aria-hidden="true">&times;</span>
          </button>
        </h3>
      </div>
      <div class="panel-body">
        <!-- 选择产品 -->
        <div class="table-left" v-show="currentStatus === 0">
          <div class="list-group">
            <a class="list-group-item" v-for="(item, index) in productTypeList" :key="index" @click="selectProduct(item._id)" v-text="item.name" />
          </div>
        </div>
        <!-- 选择品类 -->
        <div class="table-right" v-show="currentStatus === 0">
          <div class="row" v-if="selectProductInfo && selectProductInfo.seriesList">
            <div
              class="col-xs-6 col-md-3"
              :class="{ select: deviceInfo.seriesID === item._id }"
              v-for="(item, index) in selectProductInfo.seriesList"
              :key="index"
              @click="selectDevice(item._id)"
            >
              <p class="thumbnail">
                <img :src="require(`@public/img/product/${item.img}`)" />
                <span v-text="item.devName" />
              </p>
            </div>
          </div>
        </div>
        <!-- 预览效果 -->
        <div class="plugin-effect img-box" v-if="currentStatus === 1">
          <img :src="selectModelName" />
        </div>
        <!-- 输入信息 -->
        <horizontal-form :formList="formList" v-if="currentStatus === 1" />
      </div>
      <div class="btn-group" role="group" aria-label="..." v-show="currentStatus === 0">
        <button type="button" class="btn btn-primary" @click="goState(1)" v-show="developType === 0">下一步</button>
        <button type="button" class="btn btn-primary" @click="createTemplate()" v-show="developType === 1">创建模板</button>
      </div>
      <div class="btn-group" role="group" aria-label="..." v-show="currentStatus === 1">
        <button type="button" class="btn btn-default" @click="goState(0)">上一步</button>
        <button type="button" class="btn btn-primary" @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import horizontalForm from '@/gdp-ui/form/horizontal';
import https from '../https';

export default {
  name: 'add-dev-dialog',
  components: {
    [horizontalForm.name]: horizontalForm
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
        modelPath: ''
      },
      mouldKey: 'default'
    };
  },
  computed: {
    ...mapState({
      admin: state => state.userModule.admin,
      productTypeList: state => state.pulicModule.productTypeList,
      developType: state => state.pulicModule.developType,
      userDeviceList: state => state.devModule.userDeviceList
    }),
    // 表单内容
    formList() {
      return [
        {
          type: 'text',
          title: '品类',
          value: this.selectDeviceInfo && this.selectDeviceInfo.name
        },
        {
          type: 'text',
          title: '品牌',
          value: '格力'
        },
        {
          type: 'input',
          title: '产品名称',
          placeholder: '请输入产品名称，如：贝塔柜机',
          required: true,
          change: val => {
            if (val && val.target) {
              this.deviceInfo.deviceName = val.target.value;
            }
          }
        },
        {
          type: 'input',
          title: 'MID',
          placeholder: '请输入MID，如：11005',
          required: true,
          change: val => {
            if (val && val.target) {
              this.deviceInfo.productModel = val.target.value;
            }
          }
        },
        {
          type: 'select',
          title: '选择模板',
          options: this.selectProductInfo && this.selectProductInfo.plugin,
          default: 'default',
          change: val => {
            if (val && val.target) {
              this.mouldKey = val.target.value;
            }
          }
        }
      ];
    },
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
    // 当前模板
    selectModel() {
      if (!this.productTypeList.length) return {};
      return this.selectProductInfo.plugin[this.mouldKey];
    },
    // 当前模板图片
    selectModelName() {
      try {
        return require(`@public/img/model/${this.deviceInfo.modelPath}.png`);
      } catch (e) {
        return '';
      }
    }
  },
  watch: {
    productTypeList: {
      handler(newVal) {
        if (newVal && newVal[0]) {
          // 获取到产品品类列表时赋予初值
          this.deviceInfo.productID = newVal[0]._id;
          this.deviceInfo.seriesID = newVal[0].seriesList[0]._id;
          this.deviceInfo.modelPath = this.selectModel.path;
        }
      },
      immediate: true,
      deep: true
    },
    mouldKey() {
      this.deviceInfo.modelPath = this.selectModel.path;
    }
  },
  methods: {
    ...mapMutations({
      setTempModule: 'SET_TEMP_MODULE',
      setDevModule: 'SET_DEV_MODULE'
    }),
    ...mapActions({
      devCreate: 'DEV_CREATE'
    }),
    hideDialog() {
      this.$emit('hideDialog', false);
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
      https
        .fetchPost('/template/create', {
          productID,
          seriesID,
          admin: this.admin
        })
        .then(data => {
          if (data.status === 201) {
            this.$toast.info('创建成功');
            this.setTempModule({ templates: data.data });
            this.$emit('hideDialog', false);
          } else if (data.status === 200) {
            this.$toast.warning('已存在该模板');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 创建设备
    async submit() {
      const deviceInfo = JSON.stringify(this.deviceInfo);
      await this.devCreate({ deviceInfo });
      this.$emit('hideDialog', false);
    }
  }
};
</script>
