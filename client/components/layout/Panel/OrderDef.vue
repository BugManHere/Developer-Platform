<template>
  <div>
    <div class="order-body" role="group">
        <!-- 图表 -->
      <div class="body-chart" ref="mychart"/>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      statusList: [],
    }
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.tempModule.currentFuncId,
      statusSetStep: state => state.pulicModule.statusSetStep,
      funcDefine: (state, getters) => getters.funcDefine,
      currentStatusList: state => state.tempModule.currentStatusList,
      activeStatusList: state => state.tempModule.activeStatusList,
    }),
    opt() {
      const map = this.funcDefine[this.currentFuncId].map || {};
      const nodes = [];
      const links = [];
      const weights = {}; // 权重
      Object.values(map).forEach(key => {
        weights[key] = (weights[key] || 0) + 1;
      })
      this.statusList.forEach(item => {
        const curve = item.key === map[map[item.key]];
        nodes.push(
          {
            itemStyle: null,
            symbolSize: 25 + (weights[item.key] || 0) * 1.8,
            value: 10,
            category: 1,
            x: null,
            y: null,
            draggable: true,
            name: item.name,
            id: item.key
          }
        );
        links.push(
          {
            id: item.key,
            name: 'null',
            source: item.key,
            target: map[item.key],
            symbol: [null, 'triangle'],
            symbolSize: 13,
            lineStyle: {
              color: '#8B1C62',
              width: 5,
              opacity: 0.6 + curve * 0.4,
              curveness: curve * 0.5
            }
          }
        )
      });
      let obj = {
        series : [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: nodes,
                links,
                roam: true,
                zoom: 2.5,
                label: {
                  show: true,
                  position: 'inside'
                },
                force: {
                  repulsion: 100
                }
            }
        ]
      };
      return obj;
    },
    myChart() {
      let dom = this.$refs.mychart;
      return echarts.init(dom);
    }
  },
  mounted() {
    this.statusList = this.currentStatusList.map(key => {
      return {
        name: this.funcDefine[this.currentFuncId].statusDefine[key].name, // 利用key获取状态名称
        key
      };
    });

    this.updateEchart();
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
      // 根据右边List生成order
      // const order = this.rightList.map(item => {
      //   return item.key;
      // });
      // // 深复制funcDefine
      // const subFuncDefine = deepCopy(this.funcDefine[this.currentFuncId]);
      // subFuncDefine.order = order;
      // await this.editTempFunc(subFuncDefine);
      // // 设置完成，数据初始化
      // this.setTempModule(["currentFuncId", false]);
      // this.setTempModule(["activeStatusList", null]);
      // this.setPulicModule(["statusSetStep", 0]);
    },
    updateEchart(){
      this.myChart.setOption(
        this.opt
      );
    }
  }
}
</script>
