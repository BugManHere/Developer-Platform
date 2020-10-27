/*
 * @Descripttion: 
 * @version: 1.1
 * @Author: ZM_lee└(^o^)┘
 * @Date: 2020-07-08 09:14:43
 * @LastEditors: ZM_lee└(^o^)┘
 * @LastEditTime: 2020-07-08 19:13:10
 */ 
// 根据实际业务修改
import { mapState, mapMutations, mapActions } from 'vuex';
import updateStatus from './updateStatus';
import LogicDefine from './../../logic/define';

import {
  GET_DEVICE_INFO,
  SET_MAC,
  SET_DATA_OBJECT,
  SET_CHECK_OBJECT,
  SET_REPAIR,
  IS_SCENE
} from '../../store/types';
import { getQueryStringByName } from '../../utils';

const mixin = {
  mixins: [updateStatus, LogicDefine], // 该mixin自定义初始化时检测故障等功能，需更改
  computed: {
    ...mapState({ 
      mac: state => state.mac,
      dataObject: state => state.dataObject,
      devOptions: state => state.devOptions,
    })
  },
  methods: {
    ...mapMutations({
      setMac: SET_MAC,
      setDataObject: SET_DATA_OBJECT,
      setCheckObject: SET_CHECK_OBJECT,
      setRepair: SET_REPAIR, 
      updateIsScene: IS_SCENE
    }),
    ...mapActions({ getDeviceInfo: GET_DEVICE_INFO }),
    /**
     * @description 初始化，并将小卡片传进来的值赋予state
     */
    init() {
      const mac = getQueryStringByName('mac');
      const dataArr = getQueryStringByName('data');
      console.log(`mac: ${mac}`);
      console.log('location.href:', location.href);
      let FreshAirConditionState = 0;
      try {
        FreshAirConditionState = getQueryStringByName('FreshAirConditionState');
        console.log('是否跳设备状态页', FreshAirConditionState);
      } catch (error) {
        console.log('---拿不到跳设备状态的值----', error);
      }

      const valArr = JSON.parse(dataArr);
      console.log(dataArr);

      const functype = JSON.parse(getQueryStringByName('functype'));
      console.log(`functype: ${functype}`);

      const hasReportedForRepair = getQueryStringByName('hasReportedForRepair');
      hasReportedForRepair === 'true'
        ? this.setRepair(true)
        : this.setRepair(false);
      
      this.setMac(mac);
      this.getDeviceInfo(mac);

      const key = JSON.parse(this.devOptions.statueJson2);
      const DataObject = {};

      key.forEach((item, index) => {
        DataObject[item] = Number(valArr[index]);
      });
      (DataObject.functype = functype) && (DataObject.OutHome = 0);
      FreshAirConditionState && Object.assign(DataObject, {FreshAirConditionState});
      console.log(DataObject);
      valArr && this.setCheckObject(DataObject);
      valArr && this.setDataObject(DataObject);
      console.log('finish');
    }
  }
};

export default mixin;
