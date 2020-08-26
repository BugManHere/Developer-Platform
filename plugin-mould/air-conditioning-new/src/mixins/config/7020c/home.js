/**
 * @description Home配置列表
 */
import homeData from '@/api/7020c/home';

const homeConfig = {
  data() {
    return {
      JsonData: {}
    };
  },
  created() {
    this.JsonData = homeData[0];
  },
  computed: {
    FootList() {
      this.JsonData.FootList.forEach((item, index) => {
        if (index === 0) {
          this.JsonData.FootList[index].ImgName =
            this.dataObject.RemoteStatus === 'ON'
              ? 'lightstrip-on'
              : 'lightstrip-off';
          this.JsonData.FootList[index].Title =
            this.dataObject.RemoteStatus === 'ON' ? '关' : '开';
        }
      });
      return this.JsonData.FootList;
    }
  }
};

export default homeConfig;
