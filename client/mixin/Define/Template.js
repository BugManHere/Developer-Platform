import { randomKey } from '@utils';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import https from '@/https';
import ActiveTable from '@/components/tables/Active';
import InertiaTable from '@/components/tables/Inertia';
import TypeDefine from '@/components/popups/TypeDefine';
import JsonDefine from '@/components/popups/JsonDefine';

export const templateDefineConfig = {
  props: ['params'],
  components: {
    [ActiveTable.name]: ActiveTable,
    [InertiaTable.name]: InertiaTable
  },
  data() {
    return {
      setTempStep: 0
    };
  },
  created() {
    console.log(this.params);
    const productID = this.params.split('&')[0];
    const seriesID = this.params.split('&')[1];
    this.setTempModule({ tempID: this.params }); // 模板id
    this.setTempModule({ productID }); // 模板id对应的productID
    this.setTempModule({ seriesID }); // 模板id对应的deviceID
  },
  async mounted() {
    // 进入页面时判断是否存在数据，不存在就获取
    if (!this.funcDefine || !this.funcDefine.length) {
      const res = await https.fetchGet('/template');
      this.setTempModule({ templates: res.data });
    }
    if (!Object.keys(this.productTypeList).length) {
      const res = await https.fetchGet('/productType');
      this.setPulicModule({ productTypeList: res.data });
    }
  },
  watch: {
    setTempStep() {
      this.initScroll();
    }
  },
  computed: {
    ...mapState({
      productTypeList: state => state.pulicModule.productTypeList,
      productID: state => state.tempModule.productID,
      seriesID: state => state.tempModule.seriesID
    }),
    ...mapGetters(['typeDefine', 'labelList', 'funcDefine', 'productInfo', 'jsonDefine']),
    // 主要内容
    contentMainOptions() {
      return [ActiveTable.name, InertiaTable.name, 'LogicTable'][this.setTempStep];
    },
    // 顶栏标题
    contentTitleOptions() {
      return ['显性功能', '隐性功能', '逻辑定义'][this.setTempStep];
    },
    // 顶栏右边按钮位置
    contentRightOptions() {
      const add = {
        text: '添加',
        method: this.$_addTempFunc
      };
      const checkAllLogic = {
        text: '查看所有逻辑',
        method: this.showAllLogic
      };
      return [[add], [add], [checkAllLogic]][this.setTempStep];
    },
    templateFuncNum() {
      if (!this.funcDefine) return 0;
      return this.funcDefine.length;
    },
    // 底部按钮设置
    bottomBtnOptions() {
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
      return [
        [save, saveAndNext],
        [save, lastStep, saveAndNext],
        [lastStep, done]
      ][this.setTempStep];
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
      return [
        {
          title: '设备品类',
          text: this.selectTempInfo.name
        },
        {
          title: '创建时间',
          text: this.productInfo.createTime
        },
        {
          title: '引用次数',
          text: this.selectTempInfo.useTime
        },
        {
          title: '修改人',
          text: this.productInfo.editUser
        },
        {
          title: '修改时间',
          text: this.productInfo.editTime
        },
        {
          title: '功能数量',
          text: this.templateFuncNum
        }
      ];
    },
    // 顶栏信息面板
    cardInfo() {
      return {
        title: '模板信息',
        img: this.imgPath,
        content: this.deviceInfo,
        right: [
          {
            type: 'button',
            text: '字段类型定义',
            method: () => {
              this.$popup.show({
                title: '字段类型定义',
                size: 'big',
                bottomBtns: [],
                componentConfig: {
                  name: JsonDefine.name,
                  default: JsonDefine,
                  props: {
                    jsonDefine: this.jsonDefine,
                    outputHandler: res => {
                      const { type } = res;
                      switch (type) {
                        case 'add':
                          return this.addJsonDefine({
                            addJson: res.addJson
                          });
                        case 'del':
                          return this.delJsonDefine({
                            json: res.json
                          });
                        default:
                          break;
                      }
                    }
                  }
                }
              });
            }
          },
          {
            type: 'button',
            text: '功能类型定义',
            method: () => {
              this.$popup.show({
                title: '功能类型定义',
                bottomBtns: [],
                componentConfig: {
                  name: TypeDefine.name,
                  default: TypeDefine,
                  props: {
                    typeDefine: this.typeDefine,
                    outputHandler: typeDefine => {
                      this.typeDefineEdit({ typeDefine });
                    }
                  }
                }
              });
            }
          }
        ]
      };
    },
    // 统一输出的页面配置
    pageConfig() {
      return {
        hash: 'Template',
        header: this.cardInfo,
        content: {
          title: this.contentTitleOptions,
          right: this.contentRightOptions,
          main: this.contentMainOptions
        },
        bottomBtns: {
          options: this.bottomBtnOptions,
          show: true
        }
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
      addTempFunc: 'ADD_TEMP_FUNC', // 添加功能,
      typeDefineEdit: 'TYPE_DEF_EDIT', // 编辑类型定义
      addJsonDefine: 'ADD_JSON_DEFINE', // 编辑类型定义
      delJsonDefine: 'DEL_JSON_DEFINE' // 编辑类型定义
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
            customize: false,
            icon: {
              key: 'undefined',
              type: 'off'
            },
            miniIcon: {
              key: 'undefined'
            }
          },
          undefined: {
            name: '其他',
            value: '-',
            isCheck: false,
            customize: false,
            icon: {
              key: 'undefined',
              type: 'off'
            },
            miniIcon: {
              key: 'undefined'
            }
          }
        },
        order: [],
        map: {
          default: 'default',
          undefined: 'default'
        }
      };
      if (!this.setTempStep) {
        insertMap.type = 'active';
        insertMap.map.status_1 = 'default';
        insertMap.map.default = 'status_1';
        insertMap.statusDefine.status_1 = {
          name: '开启',
          value: 1,
          isCheck: true,
          customize: false,
          icon: {
            key: 'undefined',
            type: 'on'
          },
          miniIcon: {
            key: 'undefined'
          }
        };
        insertMap.order.push('status_1');
      }
      this.addTempFunc(insertMap);
    },
    setStep(val = -1) {
      this.setTempStep += val;
    },
    showAllLogic() {
      const selectLabel = {};
      selectLabel.col = Array(this.labelList.length).fill(true);
      selectLabel.row = Array(this.labelList.length).fill(true);
      this.setPulicModule({ selectLabel });
    }
  }
};
