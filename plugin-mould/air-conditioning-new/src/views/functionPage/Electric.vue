<!--
 * @Author: Jerry-Rain
 * @Date: 2020-03-24 13:48:00
 * @LastEditors: Jerry-Rain
 * @LastEditTime: 2020-04-23 17:00:22
 * @Description: 新电量统计页面
 -->
<template>
  <gree-view class="page-electric" bgcolor="#f4f4f4">
    <gree-header :style="{ 'background-color': 'white' }" :left-options="{ preventGoBack: true }" @on-click-back="goBack()">电量统计</gree-header>
    <gree-page>
      <!-- 总电量显示 -->
      <gree-block class="total-clean">
        <span>当前累计总用电量：{{ chartData.total / 10 }} kW·h</span>
        <span @click="cleanElc()">电量清零</span>
      </gree-block>
      <!-- 按钮组 -->
      <gree-block class="button-group">
        <div
          v-for="(item, index) in typeList"
          :key="index"
          class="btn"
          @click="btnIndex(index)"
          :style="{
            color: index === selcetedIndex ? 'white' : 'black',
            background: index === selcetedIndex ? '#00aeff' : 'white'
          }"
        >
          {{ item }}
        </div>
      </gree-block>
      <!-- 图表区 -->
      <div class="chart-bg">
        <gree-block class="chart-block">
          <div v-show="selcetedIndex === 0 && !isNoData">
            <div class="total-day">
              <span>日累计用电量</span>
              <span>{{ 0 }} kW·h</span>
            </div>
            <gree-divider type="center" direction="horizontal"></gree-divider>
          </div>
          <div v-show="isNoData" class="isNoData">服务器暂无数据</div>
          <div class="chart-canves" ref="day" v-show="selcetedIndex === 0" />
          <div class="chart-canves" ref="week" v-show="selcetedIndex === 1" />
          <div class="chart-canves" ref="month" v-show="selcetedIndex === 2" />
          <div class="chart-canves" ref="year" v-show="selcetedIndex === 3" />
          <span v-show="!isNoData" class="unit-txt">/{{ type[selcetedIndex] }}</span>
        </gree-block>
        <gree-row class="tip">该设备的用电量仅供参考</gree-row>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import echarts from 'echarts';
import { View, Page, Header, Row, Col, Block, Divider, Dialog } from 'gree-ui';
import { mapState, mapActions, mapMutations } from 'vuex';
import chartsConfig from '@/mixins/config/echarts';
import { showLoading, hideLoading, showToast, getGridConList, clearHistoricalPhotovoltaicPowerData } from '@PluginInterface';

export default {
  components: {
    [View.name]: View,
    [Page.name]: Page,
    [Header.name]: Header,
    [Row.name]: Row,
    [Col.name]: Col,
    [Block.name]: Block,
    [Divider.name]: Divider,
    [Dialog.name]: Dialog
  },
  mixins: [chartsConfig],
  data() {
    return {
      DEBUG: false, // 测试
      typeList: ['日', '月', '年', '历年'],
      selcetedIndex: 0,
      type: ['h', '日', '月', '年'],
      yearChart: '',
      monthChart: '',
      dayChart: '',
      weekChart: '',
      isNoData: true, // 无数据显示
      daytotle: 0, // 日累计用电量
      tooltip: {}
    };
  },
  computed: {
    ...mapState({
      mac: state => state.mac,
      isClear: state => state.isClear,
      chartData: state => state.chartData
    })
  },
  mounted() {
    this.initCharts(); // 初始化图表
    try {
      hideLoading();
    } catch (e) {
      e;
    }
  },
  beforeDestroy() {
    this.setChartData({ dayChart: null });
  },
  methods: {
    ...mapMutations({
      setChartData: 'SET_CHART_DATA'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    // 初始化图表
    async initCharts() {
      this.dayChart = echarts.init(this.$refs.day);
      this.weekChart = echarts.init(this.$refs.week);
      this.monthChart = echarts.init(this.$refs.month);
      this.yearChart = echarts.init(this.$refs.year);
      await this.getDayData();
      await this.getYearData();
    },
    // 当前选择类型请求对应的数据
    btnIndex(index) {
      this.DEBUG ? this.setChartData(this.debugData) : ''; // 测试数据
      this.selcetedIndex = index;
      this.tooltip = {
        formatter: '当年用电量：{c} kW·h',
        trigger: 'item', // 数据项图形触发
        backgroundColor: '#fff',
        padding: 3,
        show: true,
        textStyle: {
          fontFamily: 'FZLTH--GB1-4',
          fontSize: '0.31rem',
          color: '#404657'
        }
      };
      const dataZoom = [
        {
          show: false,
          start: 1,
          end: 50
        },
        {
          type: 'inside'
        }
      ];
      switch (index) {
        case 0:
          this.chartData.dayChart ? this.dayChartSet() : this.getDayData();
          break;
        case 1:
          this.chartData.weekChart ? this.weekChartSet(dataZoom) : this.getWeekData();
          break;
        case 2:
          this.chartData.monthChart ? this.monthChartSet(dataZoom) : this.getMonthData();
          break;
        case 3:
          this.chartData.yearChart ? this.yearChartSet(dataZoom) : this.getYearData();
          break;
        default:
          this.chartData.weekChart ? this.dayChartSet() : this.getDayData();
          break;
      }
    },
    // 清楚电量dialog
    cleanElc() {
      Dialog.confirm({
        title: '提示',
        content: '电量清零后不可恢复，是否确定清零？',
        confirmText: '确定',
        onConfirm: () => this.cleanElcInterface(),
        cancelText: '取消',
        onCancel: () => console.log('[Dialog.confirm] cancel clicked')
      });
    },
    async getDayData() {
      await getGridConList(this.mac, 'day')
        .then(res => {
          hideLoading();
          const obj = JSON.parse(res);
          const { time, val } = obj.data;

          //  日求和，取最大
          this.daytotle = 0;
          if (val.length > 0) {
            this.daytotle = val[val.length - 1].toFixed(2);
          }

          const day = [];
          const count = [];
          for (let i = 0; i < 12; i += 1) {
            day[i] = 0;
            count[i] = 2 * (i + 1);
          }
          this.isNoData = !time.length;
          this.setChartData({ dayChart: [day, count] });
          this.refreshChart(day, count, 'dayChart');
        })
        .catch(res => {
          console.log('查询失败', res);
          showToast('查询失败', 0);
          hideLoading();
        });
    },
    getWeekData() {
      showLoading();
      getGridConList(this.mac, 'month')
        .then(res => {
          hideLoading();
          const obj = JSON.parse(res);
          const { time, val } = obj.data;

          const d = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
          const monthCount = d.getDate();
          const month = [];
          const count = [];

          for (let i = 0; i < monthCount; i += 1) {
            month[i] = 0;
            count[i] = i + 1;
          }

          for (let i = 0; i < time.length; i += 1) {
            month[time[i] - 1] = val[i];
          }
          this.isNoData = !time.length;
          this.setChartData({ weekChart: [month, count] });
          this.refreshChart(month, count, 'weekChart');
        })
        .catch(res => {
          console.log('查询失败', res);
          showToast('查询失败', 0);
          hideLoading();
        });
    },
    getMonthData() {
      showLoading();
      getGridConList(this.mac, 'year')
        .then(res => {
          hideLoading();
          const obj = JSON.parse(res);
          const { time, val } = obj.data;

          const year = [];
          const count = [];
          for (let i = 0; i < 12; i += 1) {
            year[i] = 0;
            count[i] = i + 1;
          }

          for (let i = 0; i < time.length; i += 1) {
            year[time[i] - 1] = val[i].toFixed(2);
          }
          this.isNoData = !time.length;
          this.setChartData({ monthChart: [year, count] });
          this.refreshChart(year, count, 'monthChart');
        })
        .catch(res => {
          console.log('查询失败', res);
          showToast('查询失败', 0);
          hideLoading();
        });
    },
    getYearData() {
      showLoading();
      getGridConList(this.mac, 'all')
        .then(res => {
          hideLoading();
          const obj = JSON.parse(res);
          const { time, val } = obj.data;

          const all = [];
          const count = [];
          let TOTAL = 0;
          for (let i = 0; i < time.length; i += 1) {
            all[i] = val[i].toFixed(2);
            count[i] = time[i];
            TOTAL += val[i];
          }
          this.setChartData({ total: TOTAL.toFixed(2) });
          this.isNoData = !time.length;
          this.setChartData({ yearChart: [all, count] });
          this.refreshChart(all, count, 'yearChart');
        })
        .catch(res => {
          console.log('查询失败', res);
          showToast('查询失败', 0);
          hideLoading();
        });
    },
    // 清除电量接口
    cleanElcInterface() {
      showLoading();
      clearHistoricalPhotovoltaicPowerData(this.mac)
        .then(result => {
          hideLoading();
          const res = JSON.parse(result);
          // 判断是否成功清除电量
          if (res.r === 400) {
            console.log('Api调用失败');
          } else if (res.r === 200) {
            console.log('成功请求，清除电量');
            this.sendCtrl({ Electnumzero: 0 });
          } else if (res.r === 10700) {
            showToast('您没有权限清除电量哦', 0);
          } else {
            console.log('失败！其他原因');
          }
        })
        .catch(err => {
          console.log('err', err);
          hideLoading();
        });
    },
    refreshChart(value, count, type) {
      const realValue = value.map(item => item / 10);
      this.otherOpt.xAxis.data = count;
      this.otherOpt.series[0].data = realValue;
      this.dayChartOpt.xAxis.data = count;
      this.dayChartOpt.series[0].data = realValue;
      this[type].setOption(type === 'dayChart' ? this.dayChartOpt : this.otherOpt, true);
      this.$nextTick(() => {
        this[type].resize();
      });
    },
    dayChartSet() {
      this.tooltip.formatter = '累计用电量:{c} kW·h';
      this.dayChartOpt.tooltip = this.tooltip;
      this.dayChartOpt.grid = { left: '2%', top: '25%', right: '2%', bottom: '10%', containLabel: false };
      this.refreshChart(this.chartData.dayChart[0], this.chartData.dayChart[1], 'dayChart');
    },
    weekChartSet(dataZoom) {
      this.tooltip.formatter = '当日用电量：{c} kW·h';
      this.otherOpt.tooltip = this.tooltip;
      this.otherOpt.dataZoom = dataZoom;
      this.otherOpt.grid = { left: '2%', top: '5%', right: '2.5%', bottom: '10%' };
      this.refreshChart(this.chartData.weekChart[0], this.chartData.weekChart[1], 'weekChart');
    },
    monthChartSet() {
      this.tooltip.formatter = '当月用电量：{c} kW·h';
      this.otherOpt.tooltip = this.tooltip;
      this.otherOpt.dataZoom = [];
      this.otherOpt.grid = { left: '2%', top: '5%', right: '2%', bottom: '10%' };
      this.refreshChart(this.chartData.monthChart[0], this.chartData.monthChart[1], 'monthChart');
    },
    yearChartSet() {
      this.tooltip.formatter = '当年用电量：{c} kW·h';
      this.otherOpt.tooltip = this.tooltip;
      this.otherOpt.dataZoom = [];
      this.otherOpt.grid = { left: '2%', top: '5%', right: '2%', bottom: '10%' };
      this.refreshChart(this.chartData.yearChart[0], this.chartData.yearChart[1], 'yearChart');
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
