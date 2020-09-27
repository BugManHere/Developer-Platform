<template>
  <div class="status-page" role="group">
    <div class="status-input">
      <caption>
        <span v-text="'状态详情'" />
        <span v-text="keyNote(currentStatusKey)" class="text-label" />
      </caption>
      <div class="status-info">
        <div class="info-name">
          <span v-text="'名称'" class="text-label" />
          <input type="text" class="form-control" v-model="currentStatus.name" @blur="changeData(currentStatusIndex, 'name')" />
        </div>
        <div class="info-direction">
          <span v-text="'指向'" class="text-label" />
          <select class="select-medium form-control" v-model="currentDrection" @change="setDirection">
            <option
              v-for="(status, key) in statusList.filter((item, index) => ![currentStatusIndex, 1].includes(index))"
              :value="status.key"
              :key="key"
              v-text="status.name"
            />
          </select>
        </div>
        <div class="info-value">
          <span v-text="'状态值'" class="text-label" />
          <input type="text" class="form-control" v-model="currentStatus.value" />
        </div>
        <div class="info-check">
          <span v-text="'是否检查互斥'" class="text-label" />
          <select class="form-control" v-model="currentStatus.isCheck">
            <option :value="true">是</option>
            <option :value="false">否</option>
          </select>
        </div>
        <div class="info-customize">
          <span v-text="'自定义函数'" class="text-label" />
          <select class="select-medium form-control" v-model="currentStatus.customize">
            <option :value="false">不使用</option>
            <option value="replace">替代</option>
            <option value="before">执行前</option>
            <option value="after">执行后</option>
          </select>
        </div>
        <div class="info-icon-select">
          <div class="btn-switch">
            <span v-text="'按钮图标'" class="text-label" />
            <label for="config-input-voice">
              <input id="config-input-voice" type="checkbox" v-model="btnType" @change="changeBtnType" />
              <span class="on" :class="{ 'on-hide': !btnType }">亮起</span>
              <span class="off" :class="{ 'off-hide': btnType }">默认</span>
              <div class="toggle-inner" :class="{ right: btnType }"></div>
            </label>
          </div>
          <i
            class="iconfont"
            :class="`iconfont-${currentStatus.icon && iconArr.includes(currentStatus.icon.key) ? currentStatus.icon.key : 'undefined'}`"
            title="更改图标设置"
            @click="
              btnIconSelectType = true;
              miniIconSelectType = false;
            "
          />
        </div>
        <div class="info-icon-select">
          <span v-text="'状态图标'" class="text-label" />
          <i
            class="iconfont iconfont-undefined"
            :class="`iconfont-${currentStatus.miniIcon ? currentStatus.miniIcon.key : 'undefined'}`"
            title="更改图标设置"
            @click="
              btnIconSelectType = false;
              miniIconSelectType = true;
            "
          />
        </div>
        <!-- 新增额外命令 -->
        <div class="info-cmd">
          <span v-text="'额外命令'" class="text-label" />
          <!-- <button type="button" class="btn btn-default">
            <div class="close" aria-label="Close">
              <span aria-hidden="true">+</span>
            </div>
            添加
          </button> -->
          <div class="cmd-table" v-if="cmdMap.keys.length">
            <!-- 表格主体 -->
            <table class="table table-bordered" id="main">
              <thead>
                <tr class="active">
                  <th>字段</th>
                  <th>值</th>
                </tr>
              </thead>
              <!-- 显示已有命令 -->
              <!-- <tbody v-if="moreCommand">
                <tr class="active">
                  <td v-text="key"/>
                  <td v-text="val"/>
                </tr>
              </tbody> -->
              <tbody>
                <tr class="active" v-for="(key, index) in cmdMap.keys" :key="index">
                  <td>
                    <input type="text" class="form-control" v-model="cmdMap.keys[index]" @change="setCmd('key', index)" />
                  </td>
                  <td>
                    <input type="text" class="form-control" v-model="cmdMap.vals[index]" @change="setCmd('val', index)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 删除按钮 -->
      <div class="del-btn">
        <button type="button" class="btn btn-danger" v-text="'删除状态'" @click="delStatus" :disabled="['default', 'undefined'].includes(currentStatusKey)" />
      </div>
    </div>
    <!-- 图标库 -->
    <div class="iconfont-library" v-if="btnIconSelectType || miniIconSelectType">
      <caption>
        <span class="library-title">
          <i
            class="iconfont iconfont-fanhui"
            @click="
              btnIconSelectType = false;
              miniIconSelectType = false;
            "
          />
          <span v-text="btnIconSelectType ? '选择按钮图标' : '选择状态图标'" />
        </span>
      </caption>
      <!-- 图标 -->
      <div class="library-body">
        <div class="icon-item" v-for="(icon, index) in iconArr" :key="`icon_${index}`" @click="selectIcon(icon)">
          <i class="iconfont tubiao" :class="`iconfont-${icon}`" />
          <span v-text="icon" />
        </div>
      </div>
    </div>
    <!-- 状态预览 -->
    <div class="status-order" v-show="!(btnIconSelectType || miniIconSelectType)">
      <caption>
        <span v-text="'状态指向'" />
      </caption>
      <!-- 图表 -->
      <div class="order-chart" ref="mychart" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { deepCopy, randomKey } from '@/utils';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      funcCopy: [], // 功能副本
      currentStatusIndex: 0, // 当前选中状态的下标
      currentDrection: 'default',
      cmdMap: {
        keys: [''],
        vals: [''],
        oldKeys: ['']
      },
      btnIconSelectType: false,
      miniIconSelectType: false,
      btnType: false
    };
  },
  computed: {
    ...mapState({
      currentFuncId: state => state.tempModule.currentFuncId,
      statusSetStep: state => state.pulicModule.statusSetStep,
      iconArr: state => state.userModule.iconArr,
      funcDefine: (state, getters) => getters.funcDefine
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
      });
      this.statusList.forEach(item => {
        const curve = item.key === map[item.direction];
        nodes.push({
          itemStyle: {
            color: '#E9906F'
          },
          symbolSize: 27 + (weights[item.key] || 0) * 1.8,
          category: 1,
          x: null,
          y: null,
          draggable: true,
          name: item.name.length > 3 ? `${item.name.slice(0, 3)}...` : item.name,
          cursor: 'pointer',
          id: item.key
        });
        links.push({
          id: item.key,
          name: 'null',
          source: item.key,
          target: item.direction,
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
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        });
        categories.push({
          name: item.name
        });
      });
      let obj = {
        tooltip: {
          formatter: params => {
            const status = this.funcCopy.statusDefine[params.data.id];
            return `${status.name}：${status.value}`;
          }
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            // coordinateSystem: 'cartesian2d',
            data: nodes,
            links,
            categories,
            // draggable: true,
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
              shadowColor: 'rgba(0, 0, 0, 0.3)'
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
              height: 26
            }
          },
          {
            type: 'text',
            top: 7,
            right: 85,
            style: {
              text: '新增状态',
              font: '16px sans-serif',
              fill: '#404657'
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
              shadowColor: 'rgba(0, 0, 0, 0.3)'
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
      const key = this.currentStatusKey;
      const statusDefine = this.funcCopy.statusDefine;
      return statusDefine[key];
    },
    currentStatusKey() {
      if (!this.statusList.length) return 'default';
      return this.statusList[this.currentStatusIndex].key;
    },
    statusList() {
      let result = [];
      if (this.funcCopy.statusDefine) {
        const statusKeyList = Object.keys(this.funcCopy.statusDefine); // 取出功能下的状态名
        result = statusKeyList.map(key => {
          // 根据状态获取名称
          return {
            name: this.funcCopy.statusDefine[key].name,
            key,
            direction: this.funcCopy.map[key]
          };
        });
      }
      return result;
    }
  },
  watch: {
    currentStatusIndex(newVal) {
      this.highlightStatus(newVal);
      // 获取状态指向
      this.currentDrection = this.funcCopy.map[this.currentStatusKey];
      // 获取额外命令
      this.updateCmd();
      // 获取图标状态
      this.btnType = this.currentStatus.icon.type === 'on';
    }
  },
  mounted() {
    this.funcCopy = deepCopy(this.funcDefine[this.currentFuncId]); // 复制funcDefine
    this.initEchart(); // 初始化图表
    // 获取图标状态
    this.btnType = this.currentStatus.icon.type === 'on';
  },
  methods: {
    ...mapMutations({
      setTempModule: 'SET_TEMP_MODULE',
      setPulicModule: 'SET_PULIC_MODULE'
    }),
    ...mapActions({
      editTempFunc: 'EDIT_TEMP_FUNC'
    }),
    // 初始化图表
    initEchart() {
      // 载入图表参数
      this.myChart.setOption(this.opt);
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
        seriesIndex: 0
      });
      this.myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: index
      });
    },
    changeData(index, valueKey) {
      const key = this.statusList[index].key;
      const value = this.currentStatus[valueKey];
      if (this.statusList[index][valueKey] === value) return;
      this.$set(this.funcCopy.statusDefine[key], valueKey, value);

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
        icon: {
          key: this.funcCopy.identifier,
          type: 'on'
        },
        miniIcon: {
          key: this.funcCopy.identifier
        }
      });

      this.$set(this.funcCopy.map, key, 'default');
      this.currentStatusIndex = this.statusList.length - 1;

      this.updateEchart();
    },
    // 删除状态
    delStatus() {
      if (['default', 'undefined'].includes(this.currentStatusKey)) return;
      const key = this.currentStatusKey;
      this.$delete(this.funcCopy.statusDefine, this.currentStatusKey);
      this.$delete(this.funcCopy.map, key);
      this.currentStatusIndex = 0;

      this.updateCmd();
      this.updateEchart();
    },
    // 设置状态指向
    setDirection() {
      const fromKey = this.currentStatusKey;
      const toKey = this.currentDrection;
      this.$set(this.funcCopy.map, fromKey, toKey);

      this.updateEchart();
    },
    keyNote(key) {
      let result = '默认';
      switch (key) {
        case 'default':
          break;
        case 'undefined':
          result = '其他';
          break;
        default:
          result = `状态${key.split('_')[1]}`;
          break;
      }
      return result;
    },
    updateCmd() {
      this.cmdMap = {
        keys: [],
        vals: [],
        oldKeys: []
      };
      const moreCommand = this.funcCopy.statusDefine[this.currentStatusKey].moreCommand;
      if (moreCommand) {
        Object.keys(moreCommand).forEach(key => {
          this.cmdMap.keys.push(key);
          this.cmdMap.vals.push(moreCommand[key]);
        });
      }
      this.cmdMap.keys.push('');
      this.cmdMap.vals.push('');
      this.cmdMap.oldKeys = this.cmdMap.keys;
    },
    setCmd() {
      const cmd = {};
      this.cmdMap.keys.forEach((key, index) => {
        const val = this.cmdMap.vals[index];
        if (key === '' && val === '') return;
        cmd[key] = val;
      });
      this.$set(this.funcCopy.statusDefine[this.currentStatusKey], 'moreCommand', cmd);

      this.updateCmd();
    },
    // 选择图标
    selectIcon(icon) {
      if (this.btnIconSelectType) {
        this.$set(this.funcCopy.statusDefine[this.currentStatusKey].icon, 'key', icon);
      } else if (this.miniIconSelectType) {
        this.$set(this.funcCopy.statusDefine[this.currentStatusKey].miniIcon, 'key', icon);
      }
      this.btnIconSelectType = false;
      this.miniIconSelectType = false;
    },
    // 改变图标状态
    changeBtnType() {
      this.$set(this.funcCopy.statusDefine[this.currentStatusKey].icon, 'type', this.btnType ? 'on' : 'off');
    },
    // 完成
    async settingDone() {
      await this.editTempFunc(this.funcCopy);
      this.setTempModule({ currentFuncId: false });
      this.setTempModule({ activeStatusList: null });
      this.setPulicModule({ statusSetStep: 0 });
    }
  }
};
</script>
