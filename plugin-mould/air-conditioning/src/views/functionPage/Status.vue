<template>
  <gree-view bg-color="#404040">
    <gree-header @on-click-back="clickBack" :left-options="{ preventGoBack: true }">机组运行状态</gree-header>
    <gree-page class="page-status">
      <div class="status">
        <h3 class="headline" style="border-top: 1px solid #D6D6D6">机组运行状态</h3>
        <gree-list>
          <gree-list-item title="运行模式" :text="!isGoBackFlag ? ModStatus : '---'" media-item />
          <gree-list-item title="风挡状态" :text="!isGoBackFlag ? WdSpdStatus : '---'" media-item />
          <gree-list-item title="循环模式" :text="!isGoBackFlag ? LoopModStatus : '---'" media-item />
          <gree-list-item title="室外环境温度" :text="!isGoBackFlag ? OutEnvTemStatus : '---'" media-item />
          <gree-list-item title="室内回风温度" :text="!isGoBackFlag ? InAirTemStatus : '---'" media-item />
          <gree-list-item title="室内回风湿度" :text="!isGoBackFlag ? InAirHumiStatus : '---'" media-item />
          <gree-list-item title="送风温度" :text="!isGoBackFlag ? WdSupTemStatus : '---'" media-item />
          <!-- <gree-list-item
          title="实时耗电量"
          :text="ActualElecStatus"
          footer="实时耗电量数据仅供查考"
          media-item 
        /> -->
        </gree-list>

        <h3 class="headline">空气品质状态</h3>
        <gree-list>
          <gree-list-item title="送风PM2.5浓度" :text="!isGoBackFlag ? WdSupPMStatus : '---'" media-item />
          <gree-list-item title="回风CO2浓度" :text="!isGoBackFlag ? AirCO2Status : '---'" media-item />
        </gree-list>

        <h3 class="headline">滤网状态</h3>
        <gree-list>
          <gree-list-item title="新风粗效滤网" :text="!isGoBackFlag ? getSieveStateStatus(1) : '---'" media-item />
          <gree-list-item title="回风粗效滤网" :text="!isGoBackFlag ? getSieveStateStatus(2) : '---'" media-item />
          <gree-list-item title="高效滤网" :text="!isGoBackFlag ? getSieveStateStatus(0) : '---'" media-item />
          <gree-list-item title="换热芯体" :text="!isGoBackFlag ? getSieveStateStatus(3) : '---'" media-item />
        </gree-list>

        <h3 class="status-bottom">到底啦~</h3>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, List, Item, Dialog } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { closePage } from '@PluginInterface';

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
      isGoBackFlag: false,
      toastMsg: '设备异常'
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
      isOffline: state => state.deviceInfo.deviceState
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
      const list = ['全新风', '循环风'];
      return list[this.LoopMod];
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
      const districtValue = ['低', '中', '高'];
      const index = district.findIndex(value => {
        return value >= this.AirCO2;
      });
      return districtValue[index];
    },

    /**
     * @description 设置正常状态判断
     */

    getSieveStateStatus() {
      return index => {
        const value = this.SieveState >> index;
        if (value % 2 === 1) {
          return '更换/清洗';
        }
        return '正常';
      };
    }
  },

  watch: {
    Pow: {
      immediate: true,
      handler(newVal) {
        if (newVal === 0) this.colse('关机');
      }
    },
    ErrCode1: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.colse('故障');
      }
    },

    ErrCode2: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.colse('故障');
      }
    },

    JFerr: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.colse('故障');
      }
    },

    isOffline: {
      immediate: true,
      handler(newVal) {
        if (newVal === -1) this.colse('离线');
      }
    },

    isGoBackFlag: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          Dialog.alert({
            title: '提示',
            content: this.toastMsg,
            confirmText: '确定',
            onConfirm: () => this.clickBack()
          });
          setTimeout(() => {
            Dialog.closeAll();
            this.clickBack();
          }, 3000);
        }
      }
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
      this.toastMsg = `设备${type}，将退出状态查询功能。 <br/>  请确认设备状态后重试。`;
      this.isGoBackFlag = true;
      // try {
      //   showToast(this.toastMsg, 1);
      // } catch (e) {
      //   Toast({
      //     content: this.toastMsg,
      //     position: 'bottom'
      //   });
      // }
    }
  }
};
</script>

<style lang="scss">
.page-status {
  .page-content {
    padding-bottom: 50px;
  }
  .status {
    overflow: auto;
  }
  .list {
    margin-top: 0;
    margin-bottom: 0.1rem;
    .item-content {
      .item-title {
        font-size: 42px;
        color: #404657;
      }
    }
  }
  .status-bottom {
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
<style lang="scss">
.gree-dialog-body {
  text-align: center !important;
}
</style>
