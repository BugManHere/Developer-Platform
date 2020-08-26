// 根据实际业务修改
import { GET_DEVICE_INFO, GET_THIRD_INFO, IS_SCENE, SET_DATA_OBJECT, SET_MAC } from '@/store/types';
import { getQueryStringByName } from '@/utils';
import { mapActions, mapMutations, mapState } from 'vuex';
import updateStatus from './updateStatus';

function parseData(data) {
  // 更新state状态，需更改
  const obj = JSON.parse(data);
  const DataObject = {};
  DataObject.OnLine = obj[0];
  DataObject.Percentage = obj[1];
  DataObject.RemoteStatus = obj[2];
  DataObject.RunStatus = obj[3];
  DataObject.alarm = obj[4] || 'false';
  DataObject.batteryLow = obj[5] || (obj[8] < 10 ? 'true' : 'false'); // 电量小于10%即为低电量
  DataObject.close = obj[6];
  DataObject.continuousIntrusion = obj[7];
  DataObject.electricity = obj[8] || '100';
  DataObject.keyNo = obj[9];
  DataObject.press = obj[10];
  DataObject.temperature = obj[11];
  DataObject.humidity = obj[12];
  DataObject.pass = obj[13];
  DataObject.brightness = obj[14];
  DataObject.color = obj[15];
  DataObject.colorTemperature = obj[16];
  return DataObject;
}

const mixin = {
  mixins: [updateStatus], // 该mixin自定义初始化时检测故障等功能，需更改
  computed: {
    ...mapState({ mac: state => state.mac })
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations({
      setMac: SET_MAC,
      setDataObject: SET_DATA_OBJECT,
      updateIsScene: IS_SCENE
    }),
    ...mapActions({
      getDeviceInfo: GET_DEVICE_INFO,
      getThirdInfo: GET_THIRD_INFO
    }),
    /**
     * @description 初始化，并将小卡片传进来的值赋予state
     */
    init() {
      const mac = getQueryStringByName('mac');
      console.log(`mac: ${mac}`);

      if (process.env.VUE_APP_MID.startsWith('702')) {
        const dataArr = decodeURIComponent(getQueryStringByName('data'));
        const DataObject = parseData(dataArr);
        console.log('DataObject', DataObject);
        this.setDataObject(DataObject);
      }

      const isScene = getQueryStringByName('functype');
      console.log(`functype: ${isScene}`);

      this.setMac(mac);
      this.getDeviceInfo(mac);
      if (process.env.VUE_APP_MID.startsWith('703')) {
        this.getThirdInfo(mac);
      }
      Number(isScene) ? this.updateIsScene(1) : this.updateIsScene(0); // 场景
    }
  }
};

export default mixin;
