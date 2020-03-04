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
      dataObject: state => state.dataObject
    })
  },
  mounted() {
    console.log(this.dataObject);
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

      const DataObject = dataArr;
      console.log(DataObject);

      const functype = getQueryStringByName('functype');
      console.log(`functype: ${functype}`);

      const hasReportedForRepair = getQueryStringByName('hasReportedForRepair');
      hasReportedForRepair === 'true'
        ? this.setRepair(true)
        : this.setRepair(false);
        
      DataObject.functype = functype;
      this.setMac(mac);
      this.getDeviceInfo(mac);
      DataObject && this.setCheckObject(DataObject);
      DataObject && this.setDataObject(DataObject);
    }
  }
};

export default mixin;
