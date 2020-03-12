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
        v-show="imshowArr.length > 1 && imshowArr[0].length > 1">
        <caption 
          class="table-caption" 
          v-html="'\u2714：纵轴执行时关闭横轴（左键）<br/>\u2716：纵轴执行后隐藏横轴（右键）'"/>
        <table class="table-main">
          <tbody>
            <tr 
              v-for="(colItem, colIndex) in imshowArr" 
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
      funcDefineCopy: {},
      getFuncDefineTimer: null,
    };
  },
  mounted() {
    if (!this.funcDefine) {
      this.getFuncDefineTimer = setInterval(() => {
        if (this.funcDefine) {
          this.funcDefineCopy = deepCopy(this.funcDefine);
          clearInterval(this.getFuncDefineTimer);
          this.setFuncModule(['excludeMap', deepCopy(this.excludeMap)]); // 更新到state.js
          this.setFuncModule(['hideMap', deepCopy(this.hideMap)]); // 更新到state.js
        }
      }, 50);
    } else {
      this.funcDefineCopy = deepCopy(this.funcDefine);
      this.setFuncModule(['excludeMap', deepCopy(this.excludeMap)]); // 更新到state.js
      this.setFuncModule(['hideMap', deepCopy(this.hideMap)]); // 更新到state.js
    }
  },
  computed: {
    ...mapState({
      deviceKey: state => state.funcModule.deviceKey,
      selectPanel: state => state.funcModule.selectPanel,
      selectLabel: state => state.funcModule.selectLabel,
      funcDefine: (state, getters) => getters.funcDefine,
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
    /**
     * @description 选择的解析selectLabel返回横轴和纵轴
     * @return Object {row: [横轴], col: [纵轴]}
     */
    axis() {
      const result = {};
      // 解析selectLabel
      const setLabelList = side => {
        const arr = [];
        this.selectLabel[side].forEach((item, index) => {
          if (item) {
            const name = this.labelList[index].name; // 名称
            const statusName = this.labelList[index].statusName; // 状态名称
            const key = `${this.labelList[index].identifier}_${this.labelList[index].statusName}`; // state的key值
            const identifier = this.labelList[index].identifier; // id
            arr.push({ name, index, key, identifier, statusName }); 
          }
        });
        return arr;
      }
      result['row'] = setLabelList('row'); // 提取到横轴
      result['col'] = setLabelList('col'); // 提取到纵轴
      return result;
    },
    /**
     * @description 用于显示表格的数组
     * @return Array [[imshow]]
     */
    imshowArr() {
      // 左上角文字
      const result = [['是否互斥']];
      // 将横轴坐标轴放入显示数组
      this.axis.row.forEach(rowItem => {
        result[0].push(rowItem.name); // 填入内容到第一排（坐标轴）
      });
      // 轮询纵轴填入内容
      this.axis.col.forEach((colItem, colIndex) => {
        const colKey = colItem.key; // 获取纵轴state的key
        result[colIndex + 1] = [colItem.name]; // 从第二排开始，填入内容
        // 轮询横轴
        this.axis.row.forEach(rowItem => {
          const rowKey = rowItem.key; // 获取横轴state的key
          const excludeType = this.excludeMap[colKey] && this.excludeMap[colKey].includes(rowKey); // 是否存在'排斥'关系
          const hideType = this.hideMap[colKey] && this.hideMap[colKey].includes(rowKey); // 是否存在'隐藏'关系
          let str = '-'; // 没有逻辑关系的时候显示'-'
          // 根据逻辑关系显示相应内容
          if (hideType) {
            str = excludeType ? '\u2714 \u2716' : '\u2716';
          } else if (excludeType) {
            str = '\u2714';
          }
          result[colIndex + 1].push(str);// 从第二排开始，填入内容
        })
      });
      return result;
    },
    /**
     * @description 表示排斥关系的对象
     * @return Object
     */
    excludeMap() {
      const result = {};
      // 用于提取定义在状态下的逻辑
      const extractLogic = (status, key) => {
        if (status[key] && status[key].length) { // 如果存在互斥逻辑
         return status[key]; // 返回互斥
        }
        return [];
      };
      // 轮询所有功能，提取互斥
      this.funcDefineCopy.forEach(func => {
        const id = func.identifier; // 获取id
        // 轮询功能里面的状态，提取互斥
        Object.keys(func.statusDefine).forEach(statusKey => {
          if (statusKey === 'undefined' || !func.statusDefine[statusKey].isCheck) return; // 排除1.'其他'状态；2.不检查互斥的状态
          const stateKey = `${id}_${statusKey}`; // 获取状态的key值
          const arr = extractLogic(func.statusDefine[statusKey], 'excludeArr'); // 提取互斥
          if (!arr.length) return // 如果空，不操作
          result[stateKey] = arr; // 记录互斥关系
        });
      });
      return result;
    },
    /**
     * @description 表示排斥关系的对象
     * @return Object
     */
    hideMap() {
      const result = {};
      // 用于提取定义在状态下的逻辑
      const extractLogic = (status, key) => {
        if (status[key] && status[key].length) { // 如果存在互斥逻辑
         return status[key]; // 返回互斥
        }
        return [];
      };
      // 轮询所有功能，提取互斥
      this.funcDefineCopy.forEach(func => {
        const id = func.identifier; // 获取id
        // 轮询功能里面的状态，提取互斥
        Object.keys(func.statusDefine).forEach(statusKey => {
          if (statusKey === 'undefined' || !func.statusDefine[statusKey].isCheck) return; // 排除1.'其他'状态；2.不检查互斥的状态
          const stateKey = `${id}_${statusKey}`; // 获取状态的key值
          const arr = extractLogic(func.statusDefine[statusKey], 'hideArr'); // 提取互斥
          if (!arr.length) return // 如果空，不操作
          result[stateKey] = arr; // 记录互斥关系
        });
      });
      return result;
    },
  },
  destroyed() {
    const selectLabel = {
      col: [],
      row: []
    };
    this.setFuncModule(['selectLabel', selectLabel]);
  },
  methods: {
    ...mapMutations({
      setFuncModule: "SET_FUNC_MODULE",
      setExcludeMap: "SET_EXCLUDE_MAP",
      setDisableMap: "SET_DISABLE_MAP",
      setFuncDefine: "SET_FUNC_DEFINE"
    }),
    panelShow(val=false) {
      this.setFuncModule(['selectPanel', val]);
    },
    removeOneLabel(type, index) {
      const selectLabel = deepCopy(this.selectLabel);
      selectLabel[type][index] = false;
      this.setFuncModule(['selectLabel', selectLabel]);
    },
    removeLabel(type) {
      const selectLabel = deepCopy(this.selectLabel);
      selectLabel[type].fill(false);
      this.setFuncModule(['selectLabel', selectLabel]);
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
    // 点击设置逻辑
    setLogic(rowIndex, colIndex, type) {
      if (!rowIndex || !colIndex) return; // 如果点击到坐标轴，不作处理
      const rowKey = this.axis.row[rowIndex - 1].key; // 获取横轴的key
      const rowId = this.axis.row[rowIndex - 1].identifier; // 获取横轴的id
      const colKey = this.axis.col[colIndex - 1].key; // 获取纵轴的key
      const colId = this.axis.col[colIndex - 1].identifier; // 获取纵轴的id
      const colStatusName = this.axis.col[colIndex - 1].statusName; // 获取纵轴的id
      if (rowId && colId && rowId !== colId) { // 先排除1.错误值 2.点击的纵轴和横轴是同一个功能
        const arrName = type ? 'excludeArr' : 'hideArr'; // 状态内存储逻辑关系的数组，左键为'排斥'，右键为'隐藏' [state]
        const mapName = type ? 'excludeMap' : 'hideMap'; // 所有状态内存储逻辑关系的对象，左键为'排斥'，右键为'隐藏' {state: [state]}
        const funcIndex = this.funcDefineCopy.findIndex(item => item.identifier === colId); // 找到identifier对应的功能
        let logicArr = deepCopy(this[mapName][colKey]); // 根据state判断该状态下是否有逻辑关系
        if (logicArr && logicArr.length) { // 已存在该逻辑
          const statusIndex = logicArr.indexOf(rowKey); // 横轴的状态在此数组中的位置
          if (statusIndex !== -1) { // 判断是否存在
            if (logicArr.length <= 1) { // 判断是否只有这个状态（或者为空数组）
              this.$delete(this.funcDefineCopy[funcIndex].statusDefine[colStatusName], arrName); // 直接删除数组
            } else {
              logicArr.splice(statusIndex, 1); // 删除该位置的状态
              this.$set(this.funcDefineCopy[funcIndex].statusDefine[colStatusName], arrName, logicArr); // 更新到对应数组上
            }
          } else { // 如果不存在，添加进去
            this.$set(this.funcDefineCopy[funcIndex].statusDefine[colStatusName], arrName, [...logicArr, rowKey]);
          }
        } else { // 如果否，存入该逻辑
          this.$set(this.funcDefineCopy[funcIndex].statusDefine[colStatusName], arrName, [rowKey]);
        }
        this.setFuncDefine([this.deviceKey, deepCopy(this.funcDefineCopy)]); // 更新到state.js
        this.setFuncModule([mapName, deepCopy(this[mapName])]); // 更新到state.js
      }
    },
  },
};
</script>
