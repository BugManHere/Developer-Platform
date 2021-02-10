<template>
  <div class="body-chart" ref="mychart" :style="{ height: `${clientHeight * 0.55}px` }" />
</template>

<script>
import echarts from 'echarts';
import { mapState, mapActions, mapMutations } from 'vuex';
import { types } from '@/store/types';
import { showLoading, hideLoading } from '@PluginInterface';

export default {
  props: {
    imshowChart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      clientHeight: 0,
      position: [],
      chartData: [
        [1, 26],
        [2, 27],
        [3, 28],
        [4, 28],
        [5, 28],
        [6, 28],
        [7, 26],
        [8, 26]
      ],
      temToVal: {
        16: [160, 0],
        17: [170, 0],
        18: [180, 0],
        19: [190, 0],
        20: [200, 0],
        21: [210, 0],
        22: [220, 0],
        23: [230, 0],
        24: [240, 0],
        25: [250, 0],
        26: [4, 1],
        27: [14, 1],
        28: [24, 1],
        29: [34, 1],
        30: [44, 1]
      },
      updatedTimer: null,
      disableUpdate: false
    };
  },
  created() {
    this.clientHeight = document.body.clientHeight;
  },
  async activated() {
    showLoading();
    // 增加更新
    clearInterval(this.updatedTimer);
    this.updatedTimer = setInterval(() => {
      this.imshowChart && this.updateLocal(this.dataObject);
    }, 5000);

    // 增加轮询
    await this.addPolling({
      jsons: [
        'SmartSlpMod',
        'Slp1L1',
        'Slp1H1',
        'Slp1L2',
        'Slp1H2',
        'Slp1L3',
        'Slp1H3',
        'Slp1L4',
        'Slp1H4',
        'Slp1L5',
        'Slp1H5',
        'Slp1L6',
        'Slp1H6',
        'Slp1L7',
        'Slp1H7',
        'Slp1L8',
        'Slp1H8'
      ],
      key: 'SlpCurve',
      immediate: true
    });

    this.imshowChart && this.updateLocal(this.dataObject);
    hideLoading();
  },
  deactivated() {
    clearInterval(this.updatedTimer);
    this.delPolling('SlpCurve');
  },
  computed: {
    ...mapState('control', {
      dataObject: state => state.dataObject
    }),
    // 图表ref
    myChart() {
      let dom = this.$refs.mychart;
      return echarts.init(dom);
    },
    // 图表配置
    chartOpt() {
      let image = document.createElement('img');
      image.src = `${require('@/assets/img/functionBtn/sleep/background.png')}`;
      let obj = {
        tooltip: {
          triggerOn: 'none',
          backgroundColor: 'rgb(225, 238, 247)',
          textStyle: {
            color: '#404657'
          },
          formatter: params => {
            return `${params.data[1]}℃`;
          }
        },
        grid: {
          top: this.adaptation(40),
          bottom: this.adaptation(60),
          left: this.adaptation(40),
          right: this.adaptation(20),
          containLabel: false,
          width: 'auto',
          height: 'auto',
          show: true,
          backgroundColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgb(88, 190, 255)'
              },
              {
                offset: 0.153,
                color: 'rgb(83, 183, 252)'
              },
              {
                offset: 0.1531,
                color: 'rgb(117, 197, 252)'
              },
              {
                offset: 0.1565,
                color: 'rgb(117, 197, 252)'
              },
              {
                offset: 0.1566,
                color: 'rgb(102, 191, 250)'
              },
              {
                offset: 0.58,
                color: 'rgb(73, 161, 237)'
              },
              {
                offset: 0.5815,
                color: 'rgb(83, 166, 239)'
              },
              {
                offset: 0.582,
                color: 'rgb(83, 166, 239)'
              },
              {
                offset: 0.583,
                color: 'rgb(52, 148, 235)'
              },
              {
                offset: 1,
                color: 'rgb(2, 95, 210)'
              }
            ],
            global: false
          }
        },
        xAxis: {
          name: '（小时后）',
          nameLocation: 'middle',
          nameGap: 24,
          nameTextStyle: {
            color: 'rgb(188, 188, 188)',
            fontSize: this.adaptation(14),
            padding: [0, 0, 0, this.adaptation(250)]
          },
          position: 'bottom',
          min: 0.5,
          max: 8.5,
          type: 'value',
          maxInterval: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            showMinLabel: false,
            showMaxLabel: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'white',
              opacity: 0.6
            }
          }
        },
        yAxis: {
          name: '（摄氏度）',
          nameGap: 5,
          nameTextStyle: {
            color: 'rgb(188, 188, 188)',
            fontSize: this.adaptation(14),
            padding: [0, 0, 0, 0]
          },
          min: 15.5,
          max: 30.5,
          type: 'value',
          maxInterval: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            showMinLabel: false,
            showMaxLabel: false,
            formatter: value => {
              return `${value}°`;
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            id: 'a',
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: this.adaptation(8),
            data: this.chartData,
            clip: true,
            itemStyle: {
              // color: 'rgb(94, 180, 243)',
              color: '#fff',
              borderColor: '#fff',
              borderWidth: 1.2
            },
            lineStyle: {
              shadowColor: '#1B7BA0',
              shadowBlur: 5,
              shadowOffsetY: 8,
              color: 'rgb(226, 237, 245)',
              width: 1
            }
          }
        ],
        textStyle: {
          fontSize: `${this.adaptation(11)}`,
          color: 'rgb(188, 188, 188)',
          fontFamily: 'Helvetica Neue'
        }
      };
      return obj;
    },
    temArr() {
      return this.chartData.map(item => {
        return item[1];
      });
    }
  },
  watch: {
    imshowChart: {
      handler(newVal) {
        if (newVal) {
          const initChart = () => {
            try {
              this.updateEchart();
            } catch (e) {
              console.log(e);
              setTimeout(() => {
                initChart();
              }, 50);
            }
          };
          initChart();
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: types.SET_DATA_OBJECT,
      setCheckObject: types.SET_CHECK_OBJECT,
      setState: types.CONTROL_SET_STATE
    }),
    ...mapActions({
      sendCtrl: types.SEND_CTRL,
      addPolling: types.ADD_POLLING,
      delPolling: types.DEL_POLLING
    }),
    changeData(val) {
      this.setState({ watchLock: false, ableSend: true });
      this.setDataObject(val);
      this.sendCtrl(val);
    },
    adaptation(value) {
      return (value * this.clientHeight) / 736;
    },
    updateLocal(dataObject) {
      if (this.disableUpdate) return;
      for (let i = 1; i <= 8; i += 1) {
        const typeKey = `Slp1H${i}`;
        const valueKey = `Slp1L${i}`;
        let result;
        if (dataObject[typeKey]) {
          result = Math.round((dataObject[valueKey] - 4) / 10 + 26);
        } else {
          result = Math.round(dataObject[valueKey] / 10);
        }
        this.chartData[i - 1][1] = result;
      }
      this.updateEchart();
    },
    updateEchart() {
      this.myChart.setOption(this.chartOpt);

      const option = {
        graphic: echarts.util.map(this.chartData, (item, dataIndex) => {
          return {
            type: 'circle',
            position: this.myChart.convertToPixel('grid', item),
            shape: {
              cx: 0,
              cy: 0,
              r: this.adaptation(25)
            },
            invisible: true,
            draggable: true,
            onmousedown: () => {
              this.disableUpdate = true;
              event.preventDefault();
            },
            onmouseup: () => {
              this.disableUpdate = false;
              this.saveSlp();
              this.hideTooltip();
            },
            ondrag: echarts.util.curry(this.onPointDragging, dataIndex),
            onmousemove: echarts.util.curry(this.showTooltip, dataIndex),
            onmouseout: echarts.util.curry(this.hideTooltip, dataIndex),
            z: 100
          };
        })
      };

      option.graphic.push({
        type: 'text',
        right: 'center',
        origin: [100, 0],
        style: {
          text: '舒 适 区',
          y: this.clientHeight * 0.18,
          font: `${this.adaptation(30)}px Microsoft YaHei`,
          fill: 'rgb(123, 204, 248)'
        }
      });

      this.myChart.setOption(option);

      window.addEventListener('resize', this.updatePosition);

      this.myChart.on('dataZoom', this.updatePosition);

      this.updatePosition(true);
    },
    updatePosition(update) {
      if (!this.position.length || update) {
        this.position = echarts.util.map(this.chartData, item => {
          return this.myChart.convertToPixel('grid', item);
        });
      }
      this.myChart.setOption({
        graphic: echarts.util.map(this.chartData, (item, dataIndex) => {
          return {
            position: this.position[dataIndex]
          };
        })
      });
    },
    onPointDragging(dataIndex, evt) {
      const position = [evt.offsetX, evt.offsetY];
      let data = Math.round(this.myChart.convertFromPixel('grid', position)[1]);

      data > 30 && (data = 30);
      data < 16 && (data = 16);

      if (data === this.chartData[dataIndex][1]) return;

      this.$set(this.chartData[dataIndex], 1, data);

      this.position[dataIndex] = this.myChart.convertToPixel('grid', this.chartData[dataIndex]);

      this.myChart.setOption({
        series: [
          {
            id: 'a',
            type: 'line',
            smooth: false,
            symbol: 'circle',
            symbolSize: this.adaptation(8),
            data: this.chartData,
            backgroundColor: 'red',
            itemStyle: {
              color: '#fff',
              borderColor: '#fff',
              borderWidth: 1.2
            },
            lineStyle: {
              color: 'rgb(226, 237, 245)',
              width: 1
            }
          }
        ]
      });

      this.updatePosition();
    },
    showTooltip(dataIndex) {
      this.myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex
      });
    },
    hideTooltip() {
      this.myChart.dispatchAction({
        type: 'hideTip'
      });
    },
    saveSlp() {
      const setData = {
        SwhSlp: 1,
        SlpMod: 3
      };
      this.temArr.forEach((item, index) => {
        const keyL = `Slp1L${index + 1}`;
        const keyH = `Slp1H${index + 1}`;
        const opt = this.temToVal[this.temArr[index]];
        [setData[keyL], setData[keyH]] = opt;
      });
      this.changeData(setData);
    }
  }
};
</script>

<style></style>
