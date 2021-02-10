<template>
  <div class="status-page">
    <div class="status-page-group">
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
              class="iconfont"
              :class="`iconfont-${currentStatus.miniIcon && iconArr.includes(currentStatus.miniIcon.key) ? currentStatus.miniIcon.key : 'undefined'}`"
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
    <!-- 底部按钮组 -->
    <div class="btn-group btn-group-justified col-md-12">
      <button class="btn " v-for="(btn, index) in bottomBtns" v-html="btn.text" :class="`btn-${btn.class}`" :key="index" @click="btn.method" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { randomKey } from '@utils';

export default {
  name: 'gdp-order-define',
  props: {
    model: {
      type: Object,
      default: () => {
        return {};
      }
    },
    currentStatusId: {
      type: Number,
      default: 0
    },
    iconArr: {
      type: Array,
      default: () => {
        return [];
      }
    },
    outputHandler: {
      type: Function,
      default: () => {
        return () => {};
      }
    },
    bottomBtns: {
      type: Array,
      default: function() {
        return [
          {
            class: 'primary',
            text: '完&emsp;成',
            method: () => {
              this.settingDone();
            }
          }
        ];
      }
    }
  },
  data() {
    return {
      currentStatusIndex: 0, // 当前选中状态的下标
      currentDrection: 'default',
      cmdMap: {
        keys: [''],
        vals: [''],
        oldKeys: ['']
      },
      btnIconSelectType: false,
      miniIconSelectType: false,
      btnType: false,
      modeCopy: {}
    };
  },
  created() {
    this.modeCopy = this.model;
  },
  computed: {
    // 图表配置
    opt() {
      const map = this.modeCopy.map || {};
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
            const status = this.modeCopy.statusDefine[params.data.id];
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
      const statusDefine = this.modeCopy.statusDefine;
      return statusDefine[key];
    },
    currentStatusKey() {
      if (!this.statusList.length) return 'default';
      return this.statusList[this.currentStatusIndex].key;
    },
    statusList() {
      let result = [];
      if (this.modeCopy.statusDefine) {
        const statusKeyList = Object.keys(this.modeCopy.statusDefine); // 取出功能下的状态名
        result = statusKeyList.map(key => {
          // 根据状态获取名称
          return {
            name: this.modeCopy.statusDefine[key].name,
            key,
            direction: this.modeCopy.map[key]
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
      this.currentDrection = this.modeCopy.map[this.currentStatusKey];
      // 获取额外命令
      this.updateCmd();
      // 获取图标状态
      this.btnType = this.currentStatus.icon.type === 'on';
    }
  },
  mounted() {
    this.currentStatusIndex = this.currentStatusId;
    setTimeout(() => {
      this.initEchart(); // 初始化图表
      // 获取图标状态
      this.btnType = this.currentStatus.icon.type === 'on';
    }, 0);
  },
  methods: {
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
      this.currentDrection = this.modeCopy.map[this.currentStatusKey];
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
      this.$set(this.modeCopy.statusDefine[key], valueKey, value);

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
      this.$set(this.modeCopy.statusDefine, key, {
        name,
        value: 1,
        isCheck: true,
        customize: false,
        icon: {
          key: this.modeCopy.identifier,
          type: 'on'
        },
        miniIcon: {
          key: this.modeCopy.identifier
        }
      });

      this.$set(this.modeCopy.map, key, 'default');
      this.currentStatusIndex = this.statusList.length - 1;

      this.updateEchart();
    },
    // 删除状态
    delStatus() {
      if (['default', 'undefined'].includes(this.currentStatusKey)) return;
      const key = this.currentStatusKey;
      this.$delete(this.modeCopy.statusDefine, this.currentStatusKey);
      this.$delete(this.modeCopy.map, key);
      this.currentStatusIndex = 0;

      this.updateCmd();
      this.updateEchart();
    },
    // 设置状态指向
    setDirection() {
      const fromKey = this.currentStatusKey;
      const toKey = this.currentDrection;
      this.$set(this.modeCopy.map, fromKey, toKey);

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
      const moreCommand = this.modeCopy.statusDefine[this.currentStatusKey].moreCommand;
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
      this.$set(this.modeCopy.statusDefine[this.currentStatusKey], 'moreCommand', cmd);

      this.updateCmd();
    },
    // 选择图标
    selectIcon(icon) {
      if (this.btnIconSelectType) {
        this.$set(this.modeCopy.statusDefine[this.currentStatusKey].icon, 'key', icon);
      } else if (this.miniIconSelectType) {
        this.$set(this.modeCopy.statusDefine[this.currentStatusKey].miniIcon, 'key', icon);
      }
      this.btnIconSelectType = false;
      this.miniIconSelectType = false;
    },
    // 改变图标状态
    changeBtnType() {
      this.$set(this.modeCopy.statusDefine[this.currentStatusKey].icon, 'type', this.btnType ? 'on' : 'off');
    },
    // 完成
    settingDone() {
      this.$popup.hide();
      this.outputHandler(this.modeCopy);
    }
  }
};
</script>

<style lang="scss" scoped>
.status-page {
  $pageHeight: 540px;
  $captionHeight: 30px;
  $buttonHeight: 64px;
  position: relative;
  height: $pageHeight + $captionHeight + $buttonHeight;
  width: auto;
  &-group {
    position: relative;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    padding: 15px 0;
    min-height: $pageHeight + $captionHeight;
    height: auto;
    border-bottom: 1px #ddd solid;
    caption {
      text-align: left;
      height: $captionHeight;
      width: 90%;
      padding-top: 0;
      letter-spacing: 0;
      border-bottom: 1px #ddd solid;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-input {
      $btnHeight: 48px;
      position: relative;
      width: 25%;
      height: $pageHeight;
      border-right: 1px #ddd solid;
      display: flex;
      align-content: flex-start;
      justify-content: center;
      flex-wrap: wrap;
      // align-items: flex-start;
      .status-info {
        $paddingTop: 15px;
        position: relative;
        top: 0;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        padding: 0 22px 0 17px;
        padding-top: $paddingTop;
        height: $pageHeight - $captionHeight - $btnHeight;
        width: 100%;
        overflow-y: overlay;
        border-bottom: 1px #f0f0f0 solid;
        > div {
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 34px;
          line-height: 30px;
          margin-bottom: 10px;
          > span {
            height: 34px;
          }
          > button {
            height: 34px;
          }
          > input {
            text-align: center;
            width: 30%;
          }
          select {
            text-align: center;
            width: 25%;
            &.select-medium {
              width: 35%;
            }
          }
          &.info-icon-select {
            .btn-switch {
              height: 100%;
              display: flex;
              align-items: center;
            }
            .iconfont {
              font-size: 28px;
              cursor: pointer;
            }
            label {
              position: relative;
              margin-left: 10px;
              cursor: pointer;
              width: 70px;
              height: 25px;
              margin-bottom: 0;
              input {
                width: 100%;
                opacity: 0;
              }
              .on {
                &.on-hide {
                  transition: 0.4s linear all;
                  opacity: 0;
                  visibility: hidden;
                }
                transition: 0.4s linear all;
                opacity: 1;
                visibility: visible;
                color: #ffffff;
                font-size: 12px;
                font-weight: 600;
                line-height: 25px;
                position: absolute;
                white-space: nowrap;
                top: -1px;
                z-index: 1;
                left: 7px;
              }
              .off {
                &.off-hide {
                  transition: 0.4s linear all;
                  opacity: 0;
                  visibility: hidden;
                  color: #404657;
                }
                left: 38px;
                font-size: 12px;
                font-weight: 600;
                line-height: 25px;
                position: absolute;
                white-space: nowrap;
                top: 0px;
                z-index: 1;
              }
              .toggle-inner {
                background-color: #e9ecef;
                bottom: 0;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
                &.right {
                  background-color: #3bb6b6;
                  &::before {
                    transition: 0.4s linear all;
                    transform: translateX(31px);
                  }
                }
                &::before {
                  background-color: #ffffff;
                  content: '';
                  height: 20px;
                  left: 5px;
                  position: absolute;
                  top: 2px;
                  transition: 0.4s linear all;
                  width: 30px;
                }
              }
            }
          }
        }
        .info-cmd {
          flex-wrap: wrap;
          .close {
            padding-left: 5px;
            opacity: 0.5;
            // height: 22px;
            // border: 1px #000 solid;
            // border-radius: 50px;
            // display: flex;
            // justify-content: center;
            // align-items: center;
            // background-color: #f0f0f0;
            // span {
            //   font-size: 20px;
            // }
          }
          .cmd-table {
            width: 100%;
            margin-top: 10px;
            display: flex;
            flex-wrap: nowrap;
            td,
            th {
              width: 50%;
              text-align: center;
            }
            #main {
              margin-bottom: 0;
              width: 100%;
              tr,
              td {
                height: 40px;
              }
            }
          }
        }
      }
      .del-btn {
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        padding-top: 10px;
        min-height: $btnHeight;
        &.split {
          border-top: 1px #ddd solid;
        }
      }
    }
    .status-order,
    .iconfont-library {
      position: relative;
      width: 75%;
      height: 530px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .library-title {
        i {
          font-size: 16px;
          margin-right: 6px;
          cursor: pointer;
        }
        display: flex;
        align-items: center;
      }
      .order-chart,
      .library-body {
        position: relative;
        padding-top: 15px;
        height: 93%;
        width: 100%;
      }
      .library-body {
        padding: 0;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        align-items: flex-start;
        overflow-y: auto;
        .icon-item {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-wrap: wrap;
          height: 100px;
          width: 140px;
          cursor: pointer;
          i {
            font-size: 42px;
          }
          span {
            width: 100%;
            text-align: center;
            font-size: 12px;
          }
        }
      }
    }
  }
  //  {
  //   position: relative;
  //   width: 75%;
  //   height: 530px;
  //   display: flex;
  //   justify-content: center;
  //   flex-wrap: wrap;
  //   .library-body {
  //     position: relative;
  //     padding-top: 15px;
  //     height: 93%;
  //     width: 100%;
  //   }
  // }
  .btn-group {
    height: $buttonHeight;
    display: flex;
    justify-content: center;
    background-color: #fff;
    padding: 15px 0;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    button {
      width: 80px;
      margin-right: 10px;
      margin-left: 10px;
    }
  }
}
</style>
