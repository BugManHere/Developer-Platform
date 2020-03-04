<template>
  <div class="logic-table">
    <div>
      <caption v-text="'提示：点击纵轴后是否执行横轴的互斥'"/>
      <!-- 标签- -->
      <div class="label-select" v-for="(option, type, index) in labelOptions" :key="type">
        <!-- 标题 -->
        <span class="label-theme" v-text="option"/>
        <!-- 已添加的标签 -->
        <div class="label-body">
          <div v-for="(label, index) in axis[type]" :key="index" class="name" v-show="label" @click="removeOneLabel(type, label.index)">
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
      <div 
        class="table-content" 
        v-show="logictable.length > 1 && logictable[0].length > 1">
        <caption 
          class="table-caption" 
          v-html="'\u2714：纵轴生效时执行横轴的互斥（左键）<br/>\u2716：纵轴生效后禁用横轴（右键）'"/>
        <table class="table-main">
          <tbody>
            <tr 
              v-for="(colItem, colIndex) in logictable" 
              :key="colIndex">
              <td 
                v-for="(rowItem, rowIndex) in colItem" 
                :key="rowIndex"
                :class="{'set-hover': setHoverClass(rowIndex, colIndex)}" 
                @mouseenter="setHoverItem(rowIndex, colIndex)"
                @click="setLogic(rowIndex, colIndex, true)"
                @contextmenu.prevent="setLogic(rowIndex, colIndex, false)">
                <!-- 换行 -->
                <span v-html="rowItem.replace(/\B（/g, '<br/>（')"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
      disableMap: (state, getters) => getters.disableMap,
      labelList: (state, getters) => getters.labelList,
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
    axis() {
      const result = {};
      const setLabelList = side => {
        const arr = [];
        this.selectLabel[side].forEach((item, index) => {
          if (item) {
            const name = this.labelList[index].name;
            const key = `${this.labelList[index].identifier}_${this.labelList[index].statusName}`;
            const identifier = this.labelList[index].identifier;
            arr.push({ name, index, key, identifier });
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
      this.axis.row.forEach(rowItem => {
        result[0].push(rowItem.name);
      });
      this.axis.col.forEach((colItem, colIndex) => {
        const colKey = colItem.key;
        result[colIndex + 1] = [colItem.name];
        this.axis.row.forEach(rowItem => {
          const rowKey = rowItem.key;
          const logicType = this.logicMap[colKey] && this.logicMap[colKey].includes(rowKey);
          const disableType = this.disableMap[colKey] && this.disableMap[colKey].includes(rowKey);
          let str = '';
          // if (logicType || disableType) {
          //   logicType && (str += '\u2714 ');
          //   disableType && (str += '\u2716');
          // } else {
          //   str = '-'
          // }
          if (disableType) {
            str = '\u2716';
          } else if (logicType) {
            str = '\u2714';
          } else {
            str = '-'
          }
          result[colIndex + 1].push(str);
        })
      });
      return result;
    }
  },
  destroyed() {
    const selectLabel = {
      col: [],
      row: []
    };
    this.setFuncObject(['selectLabel', selectLabel]);
  },
  methods: {
    ...mapMutations({
      setFuncObject: "SET_FUNC_OBJECT",
      setLogicMap: "SET_LOGIC_MAP",
      setDisableMap: "SET_DISABLE_MAP",
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
      if ((rowIndex === this.hoverItem[0] && colIndex === 0)
        || (colIndex === this.hoverItem[1] && rowIndex === 0)
        || (rowIndex === this.hoverItem[0] && colIndex === this.hoverItem[1])) {
        isSetClass = true;
      }
      return isSetClass;
    },
    setLogic(rowIndex, colIndex, type) {
      const rowKey = this.axis.row[rowIndex - 1].key;
      const rowId = this.axis.row[rowIndex - 1].identifier;
      const colKey = this.axis.col[colIndex - 1].key;
      const colId = this.axis.col[colIndex - 1].identifier;
      if (rowId && colId && rowId !== colId) {
        const map = deepCopy(type ? this.logicMap : this.disableMap);
        if (map[colKey]) {
          if (map[colKey].includes(rowKey)) {
            map[colKey].remove(rowKey);
          } else {
            map[colKey].push(rowKey);
          }
        } else {
          map[colKey] = [rowKey];
        }
        type ? this.setLogicMap([this.deviceKey, map]) : this.setDisableMap([this.deviceKey, map]);
      }
    },
  },
};
</script>
