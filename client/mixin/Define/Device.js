import { mapState, mapMutations, mapActions } from 'vuex';
import QuoteFunc from '@/components/popups/QuoteFunc';
import DeviceTable from '@/components/tables/Device';

export const deviceDefineConfig = {
  props: ['params'],
  components: {
    [DeviceTable.name]: DeviceTable
  },
  data() {
    return {
      setDevStep: 0, // 当前设置步骤
      addMidType: {
        index: '',
        from: '',
        to: ''
      },
      selectIndex: 0
    };
  },
  created() {
    this.setDevModule({ deviceKey: this.params, midType: 0 }); // 记录设备key
  },
  async mounted() {
    // 进入页面时判断是否存在数据，不存在就获取
    if (!this.userDeviceList.length) {
      await this.getDev();
      this.setDevModule({ moreOption: this.currentDevice.moreOption });
    }
    if (!Object.keys(this.productTypeList).length) {
      await this.getProductType();
    }
    if (!this.funcDefine || !this.funcDefine.length) {
      await this.getTemplate();
    }
    const productID = this.currentDevice.productID;
    const seriesID = this.currentDevice.seriesID;
    this.setTempModule({ productID }); // 模板id对应的productID
    this.setTempModule({ seriesID }); // 模板id对应的deviceID
  },
  computed: {
    ...mapState({
      admin: state => state.userModule.admin,
      productTypeList: state => state.pulicModule.productTypeList,
      deviceKey: state => state.devModule.deviceKey,
      midType: state => state.devModule.midType,
      userDeviceList: state => state.devModule.userDeviceList,
      currentDevice: (state, getters) => getters.currentDevice, // hasDeviceList下对应的设备
      funcDefine: (state, getters) => getters.funcDefine,
      funcImport: (state, getters) => getters.funcImport, // currentDevice里的funcImport
      midTypeFunc: (state, getters) => getters.midTypeFunc
    }),
    //
    midTypeOptions() {
      return ['默认', ...Object.keys(this.midTypeFunc)];
    },
    // 主要内容
    contentMainOptions() {
      return [DeviceTable.name, 'OtherConfigTable'][this.setDevStep];
    },
    // 顶栏标题
    contentTitleOptions() {
      return ['引入功能', '其他配置'][this.setDevStep];
    },
    // 顶栏右边按钮位置
    contentRightOptions() {
      const quote = {
        text: '引入',
        type: 'button',
        method: this.$_quote
      };
      return [[quote]][this.setDevStep];
    },
    // 【引入功能】页面设置
    QuoteFuncOptions() {
      return {
        size: 'big',
        title: '引入功能',
        bottomBtns: [],
        componentConfig: {
          name: QuoteFunc.name,
          default: QuoteFunc,
          props: {
            funcDefine: this.funcDefine,
            funcImport: this.funcImport,
            outputHandler: idList => {
              this.devSave({
                idList
              });
              this.$popup.hide();
            }
          }
        }
      };
    },
    // 底部按钮设置
    bottomBtnOptions() {
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
          defined: this.saveRes
        },
        class: 'btn-primary'
      };
      const download = {
        text: '下载配置',
        func: {
          defined: this.downloadConfig
        },
        class: 'btn-default'
      };
      const done = {
        text: '预览效果',
        func: {
          defined: this.setDevDone
        },
        class: 'btn-primary'
      };
      return [[saveAndNext], [lastStep, download, done]][this.setDevStep];
    },
    selectDevInfo() {
      if (!this.productTypeList || !this.productTypeList.length) return {};
      const productID = this.currentDevice.productID;
      const seriesID = this.currentDevice.seriesID;
      return this.productTypeList.find(item => item._id === productID).seriesList.find(item => item._id === seriesID);
    },
    imgPath() {
      if (!this.selectDevInfo || !this.selectDevInfo.img) return require('@public/img/product/Hangon.png');
      return require(`@public/img/product/${this.selectDevInfo.img}`);
    },
    deviceInfo() {
      if (!this.currentDevice) return [];
      return [
        {
          title: '设备品类',
          text: this.currentDevice.productName
        },
        {
          title: '创建时间',
          text: this.currentDevice.createTime
        },
        {
          title: 'MID',
          text: this.currentDevice.productModel
        },
        {
          title: '产品名称',
          text: this.currentDevice.deviceName
        },
        {
          title: '修改时间',
          text: this.currentDevice.editTime
        },
        {
          title: '细分码',
          text: this.midType || '默认',
          icon: {
            text: '+',
            method: () => {
              // 定位到当前选择的细分码/
              const index = this.midTypeOptions.indexOf(this.midType);
              this.addMidType.index = index === -1 ? 0 : index;
              // 弹出输入框
              this.$input.show({
                title: '',
                inputFormConfig: [
                  {
                    type: 'select',
                    title: '从该细分码派生',
                    options: this.midTypeOptions,
                    default: this.addMidType.index,
                    required: true,
                    method: index => {
                      this.addMidType.index = index;
                    }
                  },
                  {
                    type: 'input',
                    title: '细分码',
                    placeholder: '请输入细分码，如：7e000002',
                    required: true,
                    method: e => {
                      this.addMidType.to = e.target.value;
                    }
                  }
                ],
                onConfirm: () => {
                  if (this.midTypeFunc[this.addMidType.to]) {
                    this.$toast.error('已存在此细分码');
                    return;
                  } else if (!this.addMidType.to) {
                    this.$toast.error('细分码无效');
                    return;
                  }
                  const midType = this.addMidType.index ? this.midTypeOptions[this.addMidType.index] : 0;
                  this.devAddMidType({
                    addMidType: this.addMidType.to,
                    midType
                  });
                }
              });
            }
          }
        }
      ];
    },
    // 顶栏信息面板
    cardInfo() {
      const options = this.midTypeOptions;
      return {
        title: '设备信息',
        img: this.imgPath,
        content: this.deviceInfo,
        right: [
          {
            type: 'select',
            title: '细分码',
            default: this.selectIndex,
            options,
            method: index => {
              if (index) {
                const midType = options[index];
                this.setDevModule({ midType });
              } else {
                this.setDevModule({ midType: 0 });
              }
              this.initScroll();
            }
          },
          {
            type: 'button',
            text: '修改',
            method: () => {
              this.$input.show({
                title: '修改设备信息',
                inputFormConfig: [
                  {
                    type: 'input',
                    title: '产品名称',
                    placeholder: '请输入产品名称，如：贝塔柜机',
                    method: val => {
                      if (val && val.target) {
                        this.inheritDevName = val.target.value;
                      }
                    }
                  },
                  {
                    type: 'input',
                    title: 'MID',
                    placeholder: '请输入MID，如：11005',
                    method: val => {
                      if (val && val.target) {
                        this.inheritMID = val.target.value;
                      }
                    }
                  }
                ]
              });
            }
          }
        ]
      };
    },
    // 统一输出的页面配置
    pageConfig() {
      return {
        hash: 'Device',
        header: this.cardInfo,
        content: {
          title: this.contentTitleOptions,
          right: this.contentRightOptions,
          main: this.contentMainOptions
        },
        bottomBtns: {
          show: true,
          options: this.bottomBtnOptions
        }
      };
    }
  },
  watch: {
    midType: {
      handler(newVal) {
        const index = this.midTypeOptions.indexOf(newVal);
        this.selectIndex = index === -1 ? 0 : index;
      },
      immediate: true
    },
    setDevStep() {
      this.initScroll();
    }
  },
  methods: {
    ...mapMutations({
      setDevModule: 'SET_DEV_MODULE',
      setTempModule: 'SET_TEMP_MODULE',
      setPulicModule: 'SET_PULIC_MODULE'
    }),
    ...mapActions({
      getProductType: 'GET_PRODUCT_TYPE_LIST',
      getTemplate: 'GET_TEMPLATES',
      getDev: 'GET_DEV',
      devSave: 'DEV_SAVE',
      devAddMidType: 'DEV_ADD_MIDTYPE',
      setDevDone: 'SET_DEV_DONE',
      downloadConfig: 'DOWNLOAD_CONFIG'
    }),
    $_quote() {
      this.$popup.show(this.QuoteFuncOptions);
    },
    setStep(val = -1) {
      this.setDevStep += val;
    },
    // 点击暂存
    saveRes() {
      this.setStep(1);
    }
  }
};
