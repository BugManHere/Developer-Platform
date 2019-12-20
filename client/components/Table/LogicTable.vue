<template>
  <div class="logic-table">
    <div>
      <caption>
        提示：点击纵轴后是否执行横轴的互斥
      </caption>
      <!-- 标签- -->
      <div class="label-select" v-for="(option, type, index) in labelOptions" :key="type">
        <!-- 标题 -->
        <span class="label-theme" v-text="option"/>
        <!-- 已添加的标签 -->
        <div class="label-body">
          <div v-for="(label, index) in labelList[type]" :key="index" class="name" v-show="label" @click="removeOneLabel(type, label.index)">
            <span v-html="label.name"/>
          </div>
        </div>
        <!-- 按钮组 -->
        <div class="label-buttons">
          <span class="glyphicon glyphicon-remove-circle add-button" @click="panelShow(index)"/>
          <span class="glyphicon glyphicon-remove-circle close-button" @click="removeLabel(type)"/>
        </div>
      </div>
      <!-- 互斥表格 -->
      <table class="table" v-show="logictable.length > 1 && logictable[0].length > 1">
        <tbody>
          <tr v-for="(colItem, colIndex) in logictable" :key="colIndex">
            <td v-for="(rowItem, rowIndex) in colItem" :key="rowIndex" :class="{'set-hover': setHoverClass(rowIndex, colIndex)}" @mouseenter="setHoverItem(rowIndex, colIndex)" @click="setLogic(rowIndex, colIndex)">
              <span v-text="rowItem"/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Panel :options="panelOptions"/>
  </div>
</template>

<script>
import { deepCopy } from '@/utils';
import { mapState, mapMutations } from "vuex";
import Panel from '@components/Panel/index'

export default {
  components: {
    Panel
  },
  data() {
    return {
      tableItem: '是否执行互斥',
      labelOptions: {
        col: '纵轴',
        row: '横轴'
      },
      rowList: ['1','2'],
      colList: [],
      hoverItem: [false, false],
    };
  },
  mounted() {
    
  },
  computed: {
    ...mapState({
      deviceKey: state => state.funcModule.deviceKey,
      selectPanel: state => state.funcModule.selectPanel,
      selectLabel: state => state.funcModule.selectLabel,
      logicMap: (state, getters) => getters.logicMap,
      funcDefine: (state, getters) => getters.funcDefine,
    }),
    panelOptions() {
      return {
        show: this.selectPanel !== false,
        title: '添加查询标签',
        miniBtn: {
          close: {
            method: this.panelShow,
          },
        },
        bottomBtn: {
          done: {
            selfMethod: 'commitSelect',
            method: this.settingDone,
            both: true,
          }
        },
        component: {
          name: 'SelectLabel',
          ref: 'select-label-0'
        }
      }
    },
    selectSide() {
      return ['col', 'row'][this.selectPanel];
    },
    labelList() {
      const result = {};
      const setLabelList = side => {
        const arr = [];
        this.selectLabel[side].forEach((item, index) => {
          if (item) {
            const key = this.funcDefine[index].identifier;
            const name = this.funcDefine[index].name;
            arr.push({ name, index, key });
          }
        });
        return arr;
      }
      result['row'] = setLabelList('row');
      result['col'] = setLabelList('col');
      return result;
    },
    logictable() {
      const result = [['是否互斥']];
      this.labelList.row.forEach(rowItem => {
        result[0].push(rowItem.name);
      });
      this.labelList.col.forEach((colItem, colIndex) => {
        const colKey = colItem.key;
        result[colIndex + 1] = [colItem.name];
        this.labelList.row.forEach(rowItem => {
          const rowKey = rowItem.key;
          if (this.logicMap[colKey] && this.logicMap[colKey].includes(rowKey)) {
            result[colIndex + 1].push('\u2713');
          } else {
            result[colIndex + 1].push('-');
          }
        })
      });
      return result;
    }
  },
  methods: {
    ...mapMutations({
      setFuncObject: "SET_FUNC_OBJECT",
      setLogicMap: "SET_LOGIC_MAP",
    }),
    panelShow(val=false) {
      this.setFuncObject(['selectPanel', val]);
    },
    removeOneLabel(type, index) {
      const selectLabel = deepCopy(this.selectLabel);
      selectLabel[type][index] = false;
      this.setFuncObject(['selectLabel', selectLabel]);
    },
    removeLabel(type) {
      const selectLabel = deepCopy(this.selectLabel);
      selectLabel[type].fill(false);
      this.setFuncObject(['selectLabel', selectLabel]);
    },
    settingDone() {
      this.panelShow();
    },
    setHoverItem(rowIndex, colIndex) {
      this.hoverItem = [rowIndex, colIndex];
    },
    setHoverClass(rowIndex, colIndex) {
      let isSetClass = false;
      if (this.hoverItem.includes(false) || this.hoverItem.includes(0)) return isSetClass;
      if (rowIndex === this.hoverItem[0] && colIndex === 0) {
        isSetClass = true;
      } else if (colIndex === this.hoverItem[1] && rowIndex === 0) {
        isSetClass = true;
      } else if (rowIndex === this.hoverItem[0] && colIndex === this.hoverItem[1]) {
        isSetClass = true;
      }
      return isSetClass;
    },
    setLogic(rowIndex, colIndex) {
      const rowKey = this.labelList.row[rowIndex - 1].key;
      const colKey = this.labelList.col[colIndex - 1].key;
      if (rowKey && colKey && rowKey !== colKey) {
        const logicMap = deepCopy(this.logicMap);
        if (logicMap[colKey]) {
          if (logicMap[colKey].includes(rowKey)) {
            logicMap[colKey].remove(rowKey);
          } else {
            logicMap[colKey].push(rowKey);
          }
        } else {
          logicMap[colKey] = [rowKey];
        }
        this.setLogicMap([this.deviceKey, logicMap]);
      }
    },
  },
};
</script>
