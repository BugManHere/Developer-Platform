<template>
  <div class="status-page" role="group">
    <div class="status-input">
      <caption>状态详情</caption>
      <div class="status-info">
        <div class="info-name">
          <span v-text="'名称'"/>
          <input
            type="text"
            class="form-control"
            v-model="currentStatus.name"
            @blur="changeData(currentStatusIndex, 'name')"
          />
        </div>
        <div class="info-direction">
          <span v-text="'指向'"/>
          <select class="select-medium form-control" v-model="currentDrection" @change="setDirection">
            <option 
              v-for="(status, key) in statusList.filter((item, index) => ![currentStatusIndex, 1].includes(index))" 
              :value="status.key" 
              :key="key"
              v-text="status.name"/>
          </select>
        </div>
        <div class="info-value">
          <span v-text="'状态值'"/>
          <input
            type="text"
            class="form-control"
            v-model="currentStatus.value"
          />
        </div>
        <div class="info-check">
          <span v-text="'是否检查互斥'"/>
          <select class="form-control" v-model="currentStatus.isCheck">
            <option :value="true">是</option>
            <option :value="false">否</option>
          </select>
        </div>
        <div class="info-customize">
          <span v-text="'自定义函数'"/>
          <select class="select-medium form-control" v-model="currentStatus.customize">
            <option :value="false">不使用</option>
            <option value="replace">替代</option>
            <option value="before">执行前</option>
            <option value="after">执行后</option>
          </select>
        </div>
        <div class="info-cmd">
          <span v-text="'额外命令'"/>
          <span v-text="currentStatus.moreCommand"/>
        </div>
      </div>
    </div>
    <div class="status-order">
      <caption>状态指向</caption>
      <!-- 图表 -->
      <div class="order-chart" ref="mychart"/>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { deepCopy, randomKey } from "@/utils";
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      funcCopy: [], // 功能副本
      statusList: [], 
      currentStatusIndex: 0, // 当前选中状态的下标
      currentDrection: 'default'
    }
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.tempModule.currentFuncId,
      statusSetStep: state => state.pulicModule.statusSetStep,
      funcDefine: (state, getters) => getters.funcDefine,
    }),
    // 图表配置
    opt() {
      const map = this.funcCopy.map || {};
      const nodes = []; // 节点
      const links = []; // 线
      const categories = []; // 注释
      const weights = {}; // 权重
      Object.values(map).forEach(key => {
        weights[key] = (weights[key] || 0) + 1;
      })
      this.statusList.forEach(item => {
        const curve = item.key === map[map[item.key]];
        nodes.push(
          {
            itemStyle: {
              color: '#E9906F'
            },
            symbolSize: 27 + (weights[item.key] || 0) * 1.8,
            category: 1,
            x: null,
            y: null,
            // draggable: true,
            name: item.name.length > 3 ? `${item.name.slice(0, 3)}...` : item.name,
            cursor: 'pointer',
            id: item.key,
          }
        );
        links.push(
          {
            id: item.key,
            name: 'null',
            source: item.key,
            target: map[item.key],
            // symbol: [null, 'triangle'],
            // symbolSize: 13,
            lineStyle: {
              color: curve ? '#334B5C' : '#797B7F',
              width: 2,
              opacity: 1,
              curveness: curve * 0.5,
              borderColor: '#fff',
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            }
          }
        );
        console.log(links);
        categories.push({
          name: item.name
        })
      });
      let obj = {
        tooltip: {
          formatter: params => {
            const status = this.funcCopy.statusDefine[params.data.id];
            return `${status.name}：${status.value}`;
          }
        },
        series : [
            {
                type: 'graph',
                layout: 'force',
                // coordinateSystem: 'cartesian2d',
                data: nodes,
                links,
                categories,
                draggable: true,
                focusNodeAdjacency: false,
                legendHoverLink: false,
                zoom: 2.5,
                roam: true,
                label: {
                  show: true,
                  position: 'inside'
                },
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 1,
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.3)',
                },
                edgeSymbol: [null, 'arrow'],
                edgeSymbolSize: [0, 13],
                force: {
                  repulsion: 100
                },
                emphasis: {
                  itemStyle: {
                    color: '#CD6600'
                  }
                }
            }
        ],
        graphic: [
          {
            type: 'image',
            id: 'plus',
            top: 3,
            right: 150,
            cursor: 'pointer',
            draggable: true,
            style: {
              image: require('@assets/img/plus.png'),
              width: 26,
              height: 26,
            },
          },
          {
            type: 'text',
            top: 7,
            right: 85,
            style: {
              text: '新增状态',
              font: '16px sans-serif',
              fill: '#404657',
            }
          },
          {
            type: 'rect',
            top: 1,
            right: 75,
            shape: {
              width: 106,
              height: 30,
              r: 10
            },
            style: {
              fill: 'transparent',
              stroke: '#aaa',
              lineWidth: 1,
              shadowBlur: 12,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            }
          }
        ]
      };
      return obj;
    },
    // 图表
    myChart() {
      let dom = this.$refs.mychart;
      return echarts.init(dom);
    },
    currentStatus() {
      if (!this.statusList.length) return {};
      const key = this.statusList[this.currentStatusIndex].key;
      const statusDefine = this.funcCopy.statusDefine;
      return statusDefine[key];
    },
    currentStatusKey() {
      if (!this.statusList.length) return 'default';
      return this.statusList[this.currentStatusIndex].key;
    },
  },
  watch: {
    currentStatusIndex(newVal) {
      this.highlightStatus(newVal);
      // 获取状态指向
      this.currentDrection = this.funcCopy.map[this.currentStatusKey];
    }
  },
  mounted() {
    this.funcCopy = deepCopy(this.funcDefine[this.currentFuncId]); // 复制funcDefine
    const statusKeyList = Object.keys(this.funcCopy.statusDefine); // 取出功能下的状态名
    this.statusList = statusKeyList.map(key => {
      // 根据状态获取名称
      return {
        name: this.funcCopy.statusDefine[key].name, 
        key,
        direction: this.funcCopy.map[key]
      };
    });
    this.initEchart(); // 初始化图表
  },
  methods: {
    ...mapMutations({
      setTempModule: "SET_TEMP_MODULE",
      setPulicModule: "SET_PULIC_MODULE",
    }),
    ...mapActions({
      editTempFunc: "EDIT_TEMP_FUNC",
    }),
    async settingDone() {
    },
    // 初始化图表
    initEchart(){
      // 载入图表参数
      this.myChart.setOption(
        this.opt
      );
      // 绑定点击事件
      this.myChart.on('click', param => {
        switch (param.componentType) {
          case 'series':
            this.currentStatusIndex = param.dataIndex;
            break;
          case 'graphic':
            this.addStatus();
            break;
          default:
            break;
        }
      });
      // 高亮选中状态
      this.highlightStatus(this.currentStatusIndex);
      // 获取状态指向
      this.currentDrection = this.funcCopy.map[this.currentStatusKey];
    },
    highlightStatus(index = 0) {
      this.myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
      this.myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: index
      })
    },
    changeData(index, valueKey) {
      const key = this.statusList[index].key;
      const value = this.currentStatus[valueKey];
      if (this.statusList[index][valueKey] === value) return;
      this.$set(this.funcCopy.statusDefine[key], valueKey, value);
      this.$set(this.statusList[index], valueKey, value);

      this.updateEchart();
    },
    updateEchart() {
      this.myChart.setOption(this.opt);
    },
    // 添加状态
    addStatus() {
      let key = 'status_1';
      if (this.statusList.length > 2) {
        const str = this.statusList.map(item => item.key).toString();
        const num = Math.max(...str.match(/\d+/g).map(Number)) + 1; // 找最大值然后+1
        key = `status_${num}`;
      }
      const name = `未命名${randomKey(4)}`;
      this.$set(this.funcCopy.statusDefine, key, {
        name,
        value: 1,
        isCheck: true,
        customize: false,
      });
      this.statusList.push({ name, key });
      this.$set(this.funcCopy.map, key, 'default');
      this.currentStatusIndex = this.statusList.length - 1;

      this.updateEchart();
    },
    // 设置状态指向
    setDirection() {
      const fromKey = this.currentStatusKey;
      const toKey = this.currentDrection;
      this.$set(this.funcCopy.map, fromKey, toKey);

      this.updateEchart();
    }
  }
}
</script>
