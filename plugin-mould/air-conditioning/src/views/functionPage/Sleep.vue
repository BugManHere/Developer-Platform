<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-sleep">
      <gree-header>
        <span v-text="$language('btn.SmartSleep')"/>
        <a 
          class="save"
          slot="right" 
          v-if="SwhSlp && SlpMod === 3"
          @click="saveSlp">
          保存
        </a>
      </gree-header>
      <div class="sleep-body">
        <!-- 顶部按钮 -->
        <div v-if="imshowType === 1" class="body-top">
          <!-- 列表 -->
          <gree-list>
            <gree-list-item title="睡眠" style="font-size: 18px">
              <gree-switch
                slot="after"
                class="blue"
                v-model="sleepActive"
                @change="sleepBtn(sleepActive)"
              ></gree-switch>
            </gree-list-item>
          </gree-list>
          <!-- 按钮组 -->
          <div v-if="imshowType === 1" class="body-big-btn">
            <div v-for="(btn, key) in bigBtnOptions" :key="key" class="big-btn-item" @click="selectStyle(btn.key, btn.type)" :class="{select: selectItem === btn.key}">
              <span v-text="btn.name"/>
            </div>
          </div>
        </div>
        <!-- 图表 -->
        <div v-show="showEchart" class="body-chart" id="echart" ref="mychart" :style="{height: `${clientHeight * .55}px`}"/>
        <!-- 底部按钮 -->
        <div v-if="imshowType === 0" class="body-btn" :style="{bottom: `${150 * clientHeight / 736}px`}">
          <div v-for="(btn, key) in btnOptions" :key="key" class="btn-item" @click="changeSlp(btn.key, btn.type)">
            <img :src="btn.img" alt="">
            <span v-text="btn.name"/>
          </div>
        </div>
        <!-- 列表 -->
        <div v-if="imshowType === 1" class="body-bottom">
          <gree-list>
            <gree-list-item title="防直吹" style="font-size: 18px" footer="防止风直接吹人">
              <gree-switch
                :disabled="Mod !== 1"
                slot="after"
                class="blue"
                v-model="blowActive"
                @change="blowBtn(blowActive)"
              ></gree-switch>
            </gree-list-item>
            <gree-list-item title="自动灯光" style="font-size: 18px" footer="夜间自动关闭灯光">
              <gree-switch
                slot="after"
                class="blue"
                v-model="ligActive"
                @change="ligBtn(ligActive)"
              ></gree-switch>
            </gree-list-item>
          </gree-list>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import echarts from 'echarts';
import { Header, Toast, Switch, List, Item } from 'gree-ui';
import { mapState, mapActions } from 'vuex';
import {
  showToast,
  hideLoading,
  sendDataToDevice,
} from '@PluginInterface';

export default {
  name: 'Sleep',
  components: {
    [Header.name]: Header,
    [Switch.name]: Switch,
    [Toast.name]: Toast,
    [List.name]: List,
    [Item.name]: Item,
  },
  data() {
    return {
      imshowType: 1,
      sleepActive: true,
      blowActive: false,
      ligActive: true,
      symbolSize: 20,
      position: [],
      data: [[1, 26], [2, 27], [3, 28], [4, 28], [5, 28], [6, 28], [7, 26], [8, 26]],
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
        30: [44, 1],
      },
      modToTem: {
        expert: [[1, 26], [2, 27], [3, 28], [4, 28], [5, 28], [6, 28], [7, 26], [8, 26]],
        nap: [[1, 26], [2, 26], [3, 26], [4, 26], [5, 26], [6, 26], [7, 26], [8, 26]],
        tradition: [[1, 26], [2, 27], [3, 27], [4, 27], [5, 27], [6, 27], [7, 27], [8, 27]],
        diy: [[1, 25], [2, 26], [3, 27], [4, 27], [5, 27], [6, 27], [7, 27], [8, 26]]
      },
      selectItem: '',
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      SwhSlp: state => state.dataObject.SwhSlp,
      SlpMod: state => state.dataObject.SlpMod,
      SmartSlpMod: state => state.dataObject.SmartSlpMod,
      functype: state => state.dataObject.functype,
      Lig: state => state.dataObject.Lig,
      AntiDirectBlow: state => state.dataObject.AntiDirectBlow,
      Mod: state => state.dataObject.Mod,
      mac: state => state.mac
    }),
    myChart() {
      let dom = this.$refs.mychart;
      return echarts.init(dom);
    },
    clientHeight() {
      return document.body.clientHeight;
    },
    temArr() {
      return this.data.map(item => {
        return item[1];
      });
    },
    showEchart() {
      return this.imshowType !== 1 || this.currentMod === 3;
    },
    currentMod() {
      if (!this.SwhSlp) return false;
      if (this.imshowType === 0) return this.SlpMod;
      if (this.SlpMod === 2) return this.SmartSlpMod * 10;
      if (this.SlpMod === 3) return 3;
      return false;
    },
    opt() {
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
          },
        },
        grid: {
          top: 40 * this.clientHeight / 736,
          bottom: 120 * this.clientHeight / 736,
          left: 30 * this.clientHeight / 736,
          right: 30 * this.clientHeight / 736,
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
                offset: 0, color: 'rgb(88, 190, 255)'
              }, 
              {
                offset: 0.153, color: 'rgb(83, 183, 252)'
              }, 
              {
                offset: 0.1531, color: 'rgb(117, 197, 252)'
              }, 
              {
                offset: 0.1565, color: 'rgb(117, 197, 252)'
              }, 
              {
                offset: 0.1566, color: 'rgb(102, 191, 250)'
              }, 
              {
                offset: 0.58, color: 'rgb(73, 161, 237)'
              }, 
              {
                offset: 0.5815, color: 'rgb(83, 166, 239)'
              }, 
              {
                offset: 0.582, color: 'rgb(83, 166, 239)'
              }, 
              {
                offset: 0.583, color: 'rgb(52, 148, 235)'
              }, 
              {
                offset: 1, color: 'rgb(2, 95, 210)'
              },
            ],
            global: false
          },
        },
        xAxis: {
          name: '（小时后）',
          nameLocation: 'middle',
          nameGap: 28,
          nameTextStyle: {
            color: 'rgb(188, 188, 188)',
            fontSize: 14 * this.clientHeight / 736,
          },
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
            },
          },
        },
        yAxis: {
          name: '（摄氏度）',
          nameGap: 5,
          nameTextStyle: {
            color: 'rgb(188, 188, 188)',
            fontSize: 14 * this.clientHeight / 736,
            padding: [0, 0, 0, 20 * this.clientHeight / 736]
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
            symbolSize: 8 * this.clientHeight / 736,
            data: this.data,
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
              width: 1,
            },
          }
        ],
        textStyle: {
          fontSize: `${11 * this.clientHeight / 736}`,
          color: 'rgb(188, 188, 188)',
          fontFamily: 'Helvetica Neue'
        }
      };
      return obj;
    },
    btnOptions() {
      const currentMod = this.currentMod;
      let result = [
        {
          img: currentMod === 2 ? require('@/assets/img/functionBtn/sleep/expert_selected.png') : require('@/assets/img/functionBtn/sleep/expert.png'),
          name: '专家模式',
          key: 'expert',
          type: currentMod === 2 ? 'on' : 'off'
        },
        {
          img: currentMod === 4 ? require('@/assets/img/functionBtn/sleep/nap_selected.png') : require('@/assets/img/functionBtn/sleep/nap.png'),
          name: '午睡模式',
          key: 'nap',
          type: currentMod === 4 ? 'on' : 'off'
        },
        {
          img: currentMod === 1 ? require('@/assets/img/functionBtn/sleep/tradition_selected.png') : require('@/assets/img/functionBtn/sleep/tradition.png'),
          name: '传统模式',
          key: 'tradition',
          type: currentMod === 1 ? 'on' : 'off'
        },
        {
          img: currentMod === 3 ? require('@/assets/img/functionBtn/sleep/diy_selected.png') : require('@/assets/img/functionBtn/sleep/diy.png'),
          name: 'Diy模式',
          key: 'diy',
          type: currentMod === 3 ? 'on' : 'off'
        },
      ];
      return result;
    },
    bigBtnOptions() {
      const currentMod = this.currentMod;
      let result = [
        {
          name: '平和体质',
          key: 'mild',
          type: [0, 10].includes(currentMod) ? 'on' : 'off'
        },
        {
          name: '偏寒体质',
          key: 'cool',
          type: currentMod === 20 ? 'on' : 'off'
        },
        {
          name: '偏热体质',
          key: 'heat',
          type: currentMod === 30 ? 'on' : 'off'
        },
        {
          name: 'DIY模式',
          key: 'diy',
          type: currentMod === 3 ? 'on' : 'off'
        },
      ];
      return result;
    }
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        this.$router.push({name: 'Home'}).catch(err => { err; });
        try {
          showToast('空调已被关闭，自动退出睡眠设置。', 1);
        } catch (e) {
          Toast({
            content: '空调已被关闭，自动退出睡眠设置。',
            position: 'bottom'
          });
        }
      }
    },
    currentMod: {
      handler(newVal) {
        if (newVal === false) return;
        switch (newVal) {
          case 3:
            this.selectItem = 'diy';
            break;
          case 10:
            this.selectItem = 'mild';
            break;
          case 20:
            this.selectItem = 'cool';
            break;
          case 30:
            this.selectItem = 'heat';
            break;
          default:
            break;
        }
        this.$nextTick(() => {
          this.updateData(['expert', 'tradition', 'expert', 'diy', 'nap'][newVal]);
          this.updateEchart();
        });
      },
      immediate: true
    },
    SwhSlp: {
      handler(newVal) {
        this.sleepActive = Boolean(newVal);
      },
      immediate: true
    },
    Lig: {
      handler(newVal) {
        this.ligActive = Boolean(newVal);
      },
      immediate: true
    },
    AntiDirectBlow: {
      handler(newVal) {
        this.blowActive = Boolean(newVal) && this.Mod === 1;
      },
      immediate: true
    }
  },
  mounted() {
    hideLoading();
    this.getSlpVal();
    this.updateEchart();
    this.$nextTick(() => {
      this.updateLocal(this.dataObject);
    });
  },
  methods: {
    ...mapActions({
      updateDataObject: 'UPDATE_DATAOBJECT',
    }),
    changeDataObject(obj) {
      const control = obj;
      if (obj.SwhSlp && this.Mod === 1) {
        control.AntiDirectBlow = 1;
        control.Tur = 0;
        control.Quiet = 2;
        control.WdSpd = 1;
      }
      const opt = Object.keys(obj);
      const p = Object.values(obj);
      const json = JSON.stringify({ 
        mac: this.mac,
        t: 'cmd',
        opt,
        p
      });
      console.table([opt, p]);
      this.updateDataObject(obj);
      if (this.functype) return;
      sendDataToDevice(this.mac, json, false);
    },
    async getSlpVal() {
      const cols = ['SwhSlp', 'SlpMod', 'Slp1L1', 'Slp1H1', 'Slp1L2', 'Slp1H2', 'Slp1L3', 'Slp1H3', 'Slp1L4', 'Slp1H4', 'Slp1L5', 'Slp1H5', 'Slp1L6', 'Slp1H6', 'Slp1L7', 'Slp1H7', 'Slp1L8', 'Slp1H8']; const statueJson = JSON.stringify({
        mac: this.mac,
        t: 'status',
        cols
      });
      const res = await sendDataToDevice(this.mac, statueJson, false);
      const _res = JSON.parse(res);
      const dataObject = {};
      _res.forEach((item, index) => {
        dataObject[cols[index]] = item;
      });

      this.updateLocal(dataObject);

      this.updateDataObject(dataObject);
    },
    updateLocal(dataObject) {
      for (let i = 1; i <= 8; i += 1) {
        const typeKey = `Slp1H${i}`;
        const valueKey = `Slp1L${i}`;
        let result;
        if (dataObject[typeKey]) {
          result = Math.round((dataObject[valueKey] - 4) / 10 + 26);
        } else {
          result = Math.round(dataObject[valueKey] / 10);
        }
        this.data[i - 1][1] = result;
      }
      this.updateEchart();
    },
    updateEchart() {
      this.myChart.setOption(
        this.opt
      );

      const option = {
        graphic: echarts.util.map(this.data, (item, dataIndex) => {
          return {
            type: 'circle',
            position: this.myChart.convertToPixel('grid', item),
            shape: {
              cx: 0,
              cy: 0,
              r: 25 * this.clientHeight / 736
            },
            invisible: true,
            draggable: this.currentMod === 3,
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
          font: `${30 * this.clientHeight / 736}px Microsoft YaHei`,
          fill: 'rgb(123, 204, 248)',
        },
      });

      this.myChart.setOption(option);
    
      window.addEventListener('resize', this.updatePosition);

      this.myChart.on('dataZoom', this.updatePosition);
    
      this.updatePosition(true);
    },
    updateData(key) {
      if (!key) return;
      this.data = this.modToTem[key];
    },
    changeSlp(key, type) {
      if (type === 'on') {
        this.changeDataObject({
          SwhSlp: 0,
          SlpMod: 0,  
        });
        return;
      }
      this.updateData(key);
      switch (key) {
        case 'expert':
          this.changeDataObject({
            SwhSlp: 1,
            SlpMod: 2,
          });
          break;
        case 'nap':
          this.changeDataObject({
            SwhSlp: 1,
            SlpMod: 4,
          });
          break;
        case 'tradition':
          this.changeDataObject({
            SwhSlp: 1,
            SlpMod: 1,
          });
          break;
        case 'diy':
          this.changeDataObject({
            SwhSlp: 1,
            SlpMod: 3,
          });
          break;
        default:
          break;
      }
      this.updateEchart();
    },
    updatePosition(update) {
      if (!this.position.length || update) {
        this.position = echarts.util.map(this.data, item => {
          return this.myChart.convertToPixel('grid', item);
        });
      }
      this.myChart.setOption({
        graphic: echarts.util.map(this.data, (item, dataIndex) => {
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

      this.$set(this.data[dataIndex], 1, data);

      this.position[dataIndex] = this.myChart.convertToPixel('grid', this.data[dataIndex]);

      this.myChart.setOption({
        series: [{
          id: 'a',
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 8 * this.clientHeight / 736,
          data: this.data,
          backgroundColor: 'red',
          itemStyle: {
            color: '#fff',
            borderColor: '#fff',
            borderWidth: 1.2
          },
          lineStyle: {
            color: 'rgb(226, 237, 245)',
            width: 1,
          },
        }]
      });

      this.updatePosition();
    },
    showTooltip(dataIndex) {
      this.myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex,
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
        SlpMod: 3,
      };
      this.temArr.forEach((item, index) => {
        const keyL = `Slp1L${index + 1}`;
        const keyH = `Slp1H${index + 1}`;
        const opt = this.temToVal[this.temArr[index]];
        [setData[keyL], setData[keyH]] = opt;
      });
      this.changeDataObject(setData);
    },
    selectStyle(key, type) {
      if (type === 'on') {
        this.selectItem = '';
        this.changeDataObject({
          SwhSlp: 0,
          SlpMod: 0,
          SmartSlpMod: 0,
        });
      } else {
        this.selectItem = key;
        switch (key) {
          case 'mild':
            this.changeDataObject({
              SwhSlp: 1,
              SlpMod: 2,
              SmartSlpMod: 1,
            });
            break;
          case 'cool':
            this.changeDataObject({
              SwhSlp: 1,
              SlpMod: 2,
              SmartSlpMod: 2,
            });
            break;
          case 'heat':
            this.changeDataObject({
              SwhSlp: 1,
              SlpMod: 2,
              SmartSlpMod: 3,
            });
            break;
          case 'diy':
            this.changeDataObject({
              SwhSlp: 1,
              SlpMod: 3,
              SmartSlpMod: 0,
            });
            break;
          default:
            break;
        }
      }
    },
    sleepBtn(type) {
      if (type) {
        this.changeDataObject({
          SwhSlp: 1,
          SlpMod: 1,
          SmartSlpMod: 0,
        });
      } else {
        this.changeDataObject({
          SwhSlp: 0,
          SlpMod: 0,
          SmartSlpMod: 0,
        });
        this.selectItem = '';
      }
    },
    blowBtn(type) {
      this.changeDataObject({
        AntiDirectBlow: type - 0
      });
    },
    ligBtn(type) {
      this.changeDataObject({
        Lig: type - 0,
      });
    },

  }
};
</script>

<style lang="scss">
.page .page-content {
  overflow: hidden;
}
.page-sleep {
  position: relative;
  overflow: hidden;
  .gree-header {
    border-bottom: 1px solid #ddd;
  }
  .sleep-body {
    background-color: #fff;
    overflow: hidden;
    .list {
      margin: 0;
    }
    .gree-switch.active {
      &.blue {
        .switch-icon {
          background: rgb(0, 174, 255);
        }
      }
    }
    .body-chart {
      position: relative;
      width: 1080px;
      left: 30px;
      top: -40px;
    }
    .body-big-btn {
      width: 100%;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-top: 20px;
      .big-btn-item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 427px;
        height: 120px;
        margin-bottom: 20px;
        border-radius: 80px;
        border: 4px solid rgb(205, 205, 205);
        span {
          font-size: 45px;
        }
        &.select {
          border: 4px solid rgb(133, 216, 255);
          span {
            color: rgb(133, 216, 255);
          }
        }
      }
    }
    .body-btn {
      position: absolute;
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: space-around;
      .btn-item {
        width: 173px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        height: 100%;
        img {
          height: 173px;
        }
        span {
          padding-top: 10px;
          color: #095ab5;
          font-size: 40px;
        }
      }
    }
  }
}
</style>
