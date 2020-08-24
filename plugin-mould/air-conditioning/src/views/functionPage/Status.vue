<template>
  <gree-view bg-color="#404040">
    <gree-header @on-click-back="clickBack" :left-options="{ preventGoBack: true }" >机组运行状态</gree-header>
    <gree-page class="page-status">
      <div class="status">
        <h3 class="headline" style="border-top: 1px solid #D6D6D6">机组运行状态</h3>
        <gree-list>
          <gree-list-item title="运行模式" :text="ModStatus" media-item />
          <gree-list-item title="风挡状态" :text="WdSpdStatus" media-item />
          <gree-list-item title="循环模式" :text="LoopModStatus" media-item />
          <gree-list-item title="室外环境温度" :text="OutEnvTemStatus" media-item />
          <gree-list-item title="室内回风温度" :text="InAirTemStatus" media-item />
          <gree-list-item title="室内回风湿度" :text="InAirHumiStatus" media-item />
          <gree-list-item title="送风温度" :text="WdSupTemStatus" media-item />
        <!-- <gree-list-item
          title="实时耗电量"
          :text="ActualElecStatus"
          footer="实时耗电量数据仅供查考"
          media-item 
        /> -->
        </gree-list>

        <h3 class="headline">空气品质状态</h3>
        <gree-list>
          <gree-list-item title="送风PM2.5浓度" :text="WdSupPMStatus" media-item />
          <gree-list-item title="回风CO2浓度" :text="AirCO2Status" media-item />
        </gree-list>

        <h3 class="headline">滤网状态</h3>
        <gree-list>
          <gree-list-item title="新风粗效滤网" :text="getSieveStateStatus(1)" media-item />
          <gree-list-item title="回风粗效滤网" :text="getSieveStateStatus(2)" media-item />
          <gree-list-item title="高效滤网" :text="getSieveStateStatus(0)" media-item />
          <gree-list-item title="换热芯体" :text="getSieveStateStatus(3)" media-item />
        </gree-list>

        <h3 class="status-bottom">到底啦~</h3>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, List, Item } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { showToast, closePage } from '@PluginInterface';

export default {
  name: 'Status',
  components: {
    [Header.name]: Header,
    [List.name]: List,
    [Toast.name]: Toast,
    [List.name]: List,
    [Item.name]: Item
  },
  data() {
    return {
      LoopModList: ['全新风', '混合风', '循环风']
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
      WdSpd: state => state.dataObject.WdSpd,
      LoopMod: state => state.dataObject.LoopMod,
      OutEnvTem: state => state.dataObject.OutEnvTem,
      InAirTem: state => state.dataObject.InAirTem,
      InAirHumi: state => state.dataObject.InAirHumi,
      WdSupTem: state => state.dataObject.WdSupTem,
      ActualElec: state => state.dataObject.ActualElec,
      WdSupPM: state => state.dataObject.WdSupPM,
      AirCO2: state => state.dataObject.AirCO2,
      SieveState: state => state.dataObject.SieveState,
      ErrCode1: state => state.dataObject.ErrCode1,
      ErrCode2: state => state.dataObject.ErrCode2,
      JFerr: state => state.dataObject.JFerr,
      isOffline: state => state.deviceInfo.deviceState,
    }),

    ModStatus() {
      const list = ['制冷', '除湿', '送风', '制热', '自动'];
      return list[this.Mod - 1];
    },
    WdSpdStatus() {
      const list = ['低风挡', '中风挡', '高风挡']; 
      return list[this.WdSpd - 1];
    },
    LoopModStatus() {
      const list = ['全新风', '混合风', '循环风'];
      return list[this.LoopMod - 1];
    },
    // 室外环境温度
    OutEnvTemStatus() {
      return `${this.OutEnvTem - 40}℃`; 
    },
    // 室内回风温度
    InAirTemStatus() {
      return `${this.InAirTem - 40}℃`; 
    },
    // 室内回风湿度
    InAirHumiStatus() {
      return `${this.InAirHumi}%RH`; 
    },
    // 送风温度
    WdSupTemStatus() {
      return `${this.WdSupTem - 40}℃`; 
    },
    // 实时耗电量
    ActualElecStatus() {
      return `${this.ActualElec}KW/h`; 
    },

    // 送风PM2.5浓度 区间取值
    WdSupPMStatus() {
      const district = [75, 115, 250, 999999];
      const districtValue = ['优', '良', '中', '差'];
      const index = district.findIndex(value => {
        return value >= this.WdSupPM;
      });
      return districtValue[index]; 
    },

    // 回风CO2浓度 区间取值
    AirCO2Status() {
      const district = [1000, 2000, 999999];
      const districtValue = ['底', '中', '高'];
      const index = district.findIndex(value => {
        return value >= this.AirCO2;
      });
      return districtValue[index]; 
    },

    /**
     * @description 设置正常状态判断
     */    
    getSieveStateStatus() {
      return function (index) {
        const value = this.SieveState >> index;
        if (value % 2 === 1) {
          return '更换/清洗';
        }
        return '正常';
      };
    },
  },

  watch: {
    Pow(newVal) {
      if (!newVal) this.colse('设备已被关闭');
    },

    ErrCode1(newVal) {
      if (newVal) this.colse('设备出现故障');
    },

    ErrCode2(newVal) {
      if (newVal) this.colse('设备出现故障');
    },

    JFerr(newVal) {
      if (newVal) this.colse('设备出现故障');
    },

    isOffline(newVal) {
      if (newVal === -1) this.colse('设备离线');
    }
  },

  mounted() {},

  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),

    /**
     * @description 返回键
     */
    clickBack() {
      closePage();
    }, 

    /**
     * @description 退出当前页面
     */    
    colse(type) {
      try {
        showToast(`${type}，自动退出状态查询。`, 1);
      } catch (e) {
        Toast({
          content: `${type}，自动退出状态查询。`,
          position: 'bottom'
        });
      }
      closePage();
    }
  }
};
</script>

<style lang="scss">
.page-status {
  .page-content{
    padding-bottom: 50px;
  }
  .status{
    overflow: auto;
  }
  .list {
    margin-top: 0;
    margin-bottom: 0.1rem;
    .item-content{
    .item-title {
      font-size: 42px;
      color: #404657;
    }
    }
  }
  .status-bottom{
    text-align: center;
    margin-top: 50px;
    color: #989898;
  }
  .headline {
    padding-left: 70px;
    font-size: 40px;
    color: #989898;
    height: 79px;
    line-height: 79px;
  }
}
</style>
