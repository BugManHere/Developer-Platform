const state = {
  devSetStep: 0,
  deviceKey: false,
  currentFuncId: false,
  currentStatusId: false,
  delStatusType: false,
  statusSetStep: 0,
  allStatusList: [],
  selectStatusList: null,
  orderList: [],
  selectPanel: false,
  selectLabel: {
    col: [],
    row: []
  },
  funcDefineList: {},
  logicMap: {},
  // funcDefineList: [
  //   {
  //     name: '左右扫风',
  //     identifier: 'SwLR',
  //     json: 'SwingLfRig',
  //     statusDefine: {
  //       // 默认状态
  //       default: {
  //         name: '默认状态',
  //         value: 0,
  //         status: 'off',
  //         customize: {}
  //       },
  //       // 开启状态
  //       status_1: {
  //         name: '智能风',
  //         value: 1,
  //         status: 'on',
  //         isCheck: true,
  //         customize: {}
  //       },
  //       // 开启状态
  //       status_2: {
  //         name: '风随人',
  //         value: 2,
  //         status: 'on',
  //         isCheck: true,
  //         customize: {}
  //       },
  //       // 开启状态
  //       status_3: {
  //         name: '风避人',
  //         value: 3,
  //         status: 'on',
  //         isCheck: true,
  //         customize: {}
  //       },
  //       // 开启状态
  //       status_4: {
  //         name: '环绕风',
  //         value: 4,
  //         status: 'on',
  //         isCheck: true,
  //         customize: {}
  //       },
  //       // 其他状态
  //       undefined: {
  //         name: '其他状态',
  //         status: 'on',
  //         nextState: 'default',
  //         customize: {}
  //       },
  //     },
  //     // 点击执行顺序
  //     order: ['default', 'status_1', 'status_2', 'status_3','status_4'],
  //   },
  //   {
  //     name: '上下扫风',
  //     identifier: 'SwUD',
  //     json: 'SwUpDn',
  //     statusDefine: {
  //       // 默认状态
  //       default: {
  //         name: '默认状态',
  //         value: 0,
  //         status: 'off',
  //         customize: {}
  //       },
  //       // 开启状态
  //       status_1: {
  //         name: '开启状态',
  //         value: 1,
  //         status: 'on',
  //         isCheck: true,
  //         customize: {}
  //       },
  //       // 其他状态
  //       undefined: {
  //         name: '其他状态',
  //         status: 'on',
  //         nextState: 'default',
  //         customize: {}
  //       },
  //     },
  //     // 点击执行顺序
  //     order: ['default', 'status_1'],
  //   },
  //   {
  //     name: '睡眠',
  //     identifier: 'Sleep',
  //     json: 'SwhSlp',
  //     statusDefine: {
  //       // 默认状态
  //       default: {
  //         name: '默认状态',
  //         value: 0,
  //         status: 'off',
  //         moreCommand: {
  //           SlpMod: 0,
  //         },
  //         customize: {}
  //       },
  //       // 开启状态
  //       status_1: {
  //         name: '开启状态',
  //         value: 1,
  //         status: 'on',
  //         isCheck: true,
  //         moreCommand: {
  //           SlpMod: 1,
  //         },
  //         // 自定义函数
  //         customize: {
  //           after: true
  //         },
  //       },
  //       // 其他状态
  //       undefined: {
  //         name: '其他状态',
  //         status: 'on',
  //         nextState: 'default',
  //         customize: {}
  //       },
  //     },
  //     // 点击执行顺序
  //     order: ['default', 'status_1'],
  //   },
  // ],
};
export default state;