<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-status">
      <gree-header>{{ $language('btn.LoopMod') }}</gree-header>
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
        <gree-list-item title="新风粗效滤网" :text="SieveStateBit3" media-item />
        <gree-list-item title="回风粗效滤网" :text="SieveStateBit2" media-item />
        <gree-list-item title="高效滤网" :text="SieveStateBit1" media-item />
        <gree-list-item title="换热芯体" :text="SieveStateBit0" media-item />
      </gree-list>
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
      return `${this.InAirHumi}℃`; 
    },
    // 送风温度
    WdSupTemStatus() {
      return `${this.WdSupTem - 40}℃`; 
    },
    // 实时耗电量
    ActualElecStatus() {
      return `${this.ActualElec}KW/h`; 
    },
    // 送风PM2.5浓度
    WdSupPMStatus() {
      return `${this.WdSupPM}ug/m³`; 
    },
    // 回风CO2浓度
    AirCO2Status() {
      return `${this.AirCO2}ppm`;
    },
    // 滤网状态  换热芯体
    SieveStateBit0() {
      return this.getSieveStateStatus(1);
    },
    // 滤网状态 高效滤网  
    SieveStateBit1() {
      return this.getSieveStateStatus(2);
    },
    // 滤网状态 回风粗效滤网  
    SieveStateBit2() {
      return this.getSieveStateStatus(3);
    },
    // 滤网状态 新风粗效滤网  
    SieveStateBit3() {
      return this.getSieveStateStatus(4);
    },
  },

  watch: {
    Pow(newVal) {
      if (!newVal) {
        try {
          showToast('设备已被关闭，自动退出状态查询。', 1);
        } catch (e) {
          Toast({
            content: '设备已被关闭，自动退出状态查询。',
            position: 'bottom'
          });
        }
        closePage();
      }
    },
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
    
    getSieveStateStatus(index) {
      const value = this.SieveState >> index;
      if (value % 2 === 1) {
        return '更换';
      }
      return '正常';
    } 
  }
};
</script>

<style lang="scss">
.page-status {
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
  .headline {
    padding-left: 70px;
    font-size: 40px;
    color: #989898;
    height: 79px;
    line-height: 79px;
  }
}
</style>
