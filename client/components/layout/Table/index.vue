<template>
  <div class="gree-table">
    <table class="table">
      <caption v-html="funcOptions.caption" />
      <thead>
        <tr class="info">
          <th v-for="(item, index) in funcOptions.title" :key="index" v-html="item" />
        </tr>
      </thead>
      <tbody>
        <!-- 无内容的时候显示 -->
        <tr v-if="!funcOptions.content.length">
          <!-- 根据标题数量填充空内容 -->
          <td v-for="(item, key) in [...Array.from({ length: funcOptions.title.length - 2 }, () => ''), []]" :key="key">
            <p v-if="!Array.isArray(item)" v-text="item" />
            <span v-else class="definitions">
              <span v-for="(val, index) in item" :key="index" v-text="val" />
            </span>
          </td>
          <td v-if="funcOptions.content">
            <p>
              <span />
              &nbsp;
              <span />
            </p>
          </td>
        </tr>
        <!-- 有内容的时候显示 -->
        <tr
          v-for="(content, index) in funcOptions.content"
          :class="{ develop: developType === 1 }"
          v-show="content"
          :key="index"
          @dragstart="dragItem(index)"
          @dragenter.prevent="dragMove(index)"
          @dragend="transPos"
          @dragover.prevent
          draggable="true"
        >
          <!-- 根据类型显示内容 -->
          <td v-for="(item, colIndex) in content" :key="colIndex" :id="funcOptions.keys[colIndex]">
            <!-- 文本 -->
            <p
              v-if="funcOptions.types[colIndex] === 'edit'"
              v-show="index !== editItem[0] || colIndex !== editItem[1]"
              @click="labelEvent(index, colIndex, item, 'edit')"
              v-text="item"
              id="edit"
            />
            <!-- 点击文本后出现输入框 -->
            <p v-if="funcOptions.types[colIndex] === 'edit'" v-show="index === editItem[0] && colIndex === editItem[1]" id="edit">
              <input
                @blur="setValue"
                @keydown.tab="nextInput"
                @keyup.esc="initInput"
                @keyup.enter="setValue"
                :id="`input-${index}-${colIndex}`"
                :key="`${index}-${colIndex}`"
                spellcheck="false"
              />
            </p>
            <!-- 选项 -->
            <div v-else-if="funcOptions.types[colIndex] === 'option'" id="option">
              <p v-if="Object.keys(item.options).length <= 1" v-text="item.options[item.value]" />
              <select v-else class="select-medium form-control" v-model="item.value" @change="labelEvent(index, colIndex, item, 'option')">
                <option v-for="(optionValue, optionKey) in item.options" :key="optionKey" :value="optionKey" v-text="optionValue" />
              </select>
            </div>
            <!-- 状态简要 -->
            <span v-else-if="funcOptions.types[colIndex] === 'brief'" class="definitions" id="brief">
              <span v-for="(val, statusIndex) in item" :key="statusIndex" @click="goThatStatus(realIndex[index], statusIndex)" v-text="val" />
            </span>
            <!-- 按钮 -->
            <p v-else-if="funcOptions.types[colIndex] === 'btn'" id="btn">
              <i
                v-for="(icon, iconIndex) in item"
                class="iconfont"
                :key="iconIndex"
                :style="icon.value && funcDefine[realIndex[index]][icon.value] && 'color: #469dff'"
                :class="`iconfont-${icon.key}`"
                :title="icon.value && funcDefine[realIndex[index]][icon.value] ? icon.onDescript : icon.descript"
                @click="operateEvent(icon.key, index)"
              />
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 弹出面板 -->
    <Panel :options="insertPageShow === false ? defPanelOptions : insertPageOptions" ref="panel" />
  </div>
</template>

<script>
import { deepCopy } from '@/utils';
import { mapMutations, mapState, mapActions } from 'vuex';
import Panel from '@components/layout/Panel/index';
import https from '@/https';

export default {
  components: {
    Panel
  },
  props: {
    tableOptions: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      addStatusType: false, // 是否处于添加状态
      editItem: [false, false],
      isNext: false,
      timer: null,
      insertPageShow: false,
      insertPageList: [],
      dragFromIndex: false,
      dragToIndex: false
    };
  },
  computed: {
    ...mapState({
      admin: state => state.userModule.admin,
      animationSecond: state => state.pulicModule.animationSecond,
      developType: state => state.pulicModule.developType, // 0：产品开发 1：模板开发
      userDeviceList: state => state.devModule.userDeviceList,
      deviceKey: state => state.devModule.deviceKey,
      currentFuncId: state => state.tempModule.currentFuncId,
      currentStatusId: state => state.tempModule.currentStatusId,
      statusSetStep: state => state.pulicModule.statusSetStep,
      delStatusType: state => state.pulicModule.delStatusType,
      funcDefine: (state, getters) => getters.funcDefine,
      funcImport: (state, getters) => getters.funcImport
    }),
    currentComponent() {
      return ['StatusDef', 'OrderDef'][this.statusSetStep];
    },
    // 显示的index 跟 数据库中的index 的对应关系
    realIndex() {
      const result = [];
      if (!this.funcDefine) return result;
      this.funcDefine.forEach((item, index) => {
        if (this.developType === 0) {
          result.push(index);
        } else if (this.developType === 1 && this.tableOptions.type.some(check => item.type.includes(check))) {
          result.push(index);
        }
      });
      return result;
    },
    // 要显示的func
    imshowFunc() {
      if (!this.funcDefine) return [];
      if (this.developType === 1) {
        return this.realIndex.map(item => {
          return this.funcDefine[item];
        });
      }
      const result = this.funcImport.map(funcId => {
        return this.funcDefine.find(item => item._id === funcId);
      });
      return result;
    },
    // 显示用
    funcOptions() {
      let content = [];
      try {
        if (this.imshowFunc.length) {
          content = this.imshowFunc.map(func => {
            if (!func) return undefined;
            const res = this.tableOptions.titleList.map(title => {
              let result = '';
              switch (title.type) {
                case 'edit':
                  if (title.model && title.options) {
                    result = title.options[func[title.model]];
                  } else {
                    result = func[title.key];
                  }
                  break;
                case 'option':
                  result = {
                    value: func[title.model],
                    type: title.type,
                    options: title.options,
                    model: title.model
                  };
                  break;
                case 'btn':
                  result = title.icons;
                  break;
                case 'brief':
                  result = Object.keys(func.statusDefine)
                    .filter(status => status !== 'undefined')
                    .map(status => {
                      if (status === 'undefined') return;
                      const target = func.statusDefine[status];
                      let text = `${target.name}：${target.value}`;
                      text += target.moreCommand ? '+' : '';
                      return text;
                    });
                  break;
                default:
                  break;
              }
              return result;
            });
            return res;
          });
        }
      } catch (err) {
        err;
      }
      return {
        caption: this.tableOptions.caption,
        content,
        title: this.tableOptions.titleList.map(title => title.name),
        keys: this.tableOptions.titleList.map(title => title.key),
        types: this.tableOptions.titleList.map(title => title.type)
      };
    },
    // 【插入页面】页面设置
    insertPageOptions() {
      const result = {
        show: this.insertPageShow !== false,
        class: 'big',
        title: '选择页面',
        miniBtn: {
          close: {
            method: this.insertPage
          }
        },
        bottomBtn: {
          done: {
            selfMethod: 'settingDone'
          }
        },
        component: {
          name: 'SelectPage',
          ref: 'SelectPage'
        }
      };
      return result;
    },
    // 【定义】页面设置
    defPanelOptions() {
      let result = {};
      switch (this.statusSetStep) {
        case 0:
          result = {
            show: this.currentFuncId !== false,
            class: 'big',
            title: (this.funcDefine && this.funcDefine.length && this.funcDefine[this.currentFuncId] && this.funcDefine[this.currentFuncId].name) || '',
            miniBtn: {
              close: {
                method: this.editStatus
              }
            },
            bottomBtn: {
              done: {
                selfMethod: 'settingDone'
              }
            },
            component: {
              name: 'OrderDef',
              ref: 'statusDef'
            }
          };
          break;
        default:
          break;
      }
      return result;
    }
  },
  created() {
    document.onkeydown = e => {
      e.keyCode === 27 && (this.currentFuncId !== false || (this.insertPageShow = false)) && this.editStatus();
    };
  },
  destroyed() {
    this.editStatus();
  },
  methods: {
    ...mapMutations({
      setTempModule: 'SET_TEMP_MODULE',
      changeTemp: 'CHANGE_TEMPLATE',
      setDevModule: 'SET_DEV_MODULE',
      setPulicModule: 'SET_PULIC_MODULE'
    }),
    ...mapActions({
      delTempFunc: 'DEL_TEMP_FUNC',
      delDevFunc: 'DEL_DEV_FUNC'
    }),
    setRealIndex(index) {
      this.realIndex = index;
    },
    // 插入页面
    insertPage(index = false) {
      this.insertPageShow = index;
    },
    // 编辑状态
    editStatus(index = false) {
      if (!this.$_throttle()) return;
      this.setTempModule({ currentFuncId: index });
      this.setTempModule({ currentStatusId: false });
      this.setPulicModule({ delStatusType: false });
      !index && this.setPulicModule({ statusSetStep: 0 });
    },
    // 删除功能
    $_delFun(index) {
      if (this.developType === 1) {
        this.delTempFunc(this.realIndex[index]);
      } else {
        this.delDevFunc(index);
      }
    },
    // 点击状态简要后跳转到该状态的设置
    goThatStatus(index, statusIndex) {
      if (!this.$_throttle() || this.developType === 0) return; // 节流,设备管理页面不可进入
      this.setTempModule({ currentFuncId: index }); // 该功能在所有功能内的位置
      const statusId = statusIndex ? statusIndex + 1 : 0; // 该状态在功能内的位置
      this.$nextTick(() => {
        this.$refs.panel.$refs['statusDef'].currentStatusIndex = statusId; // 显示指定状态
      });
    },
    labelEvent(index, index2, item, type) {
      // 模板定义
      const funcDefine = deepCopy(this.funcDefine); // 深复制
      const currentFunc = funcDefine[this.realIndex[index]]; // 选中的funciton
      switch (type) {
        case 'edit':
          this.showInput(index, index2, item);
          break;
        case 'option':
          if (this.developType === 1) {
            currentFunc[item.model] = item.value; // 赋值
            this.changeTemp({ funcDefine }); // 更新到state
          } else {
            console.log(this.devModule);
          }
          break;
        default:
          break;
      }
    },
    // 显示指定位置的输入框
    showInput(index, index2, value) {
      if (this.developType === 0) return; // 设备管理页面不可进入
      const id = `input-${index}-${index2}`; // 计算输入框的id
      const doc = document.getElementById(id);
      // 显示此输入框
      this.editItem = [index, index2];
      setTimeout(() => {
        doc.value = value;
        doc.focus();
        doc.select();
        this.isNext = false;
      }, 0);
    },
    // 将输入框的输入值更新到表格上
    setValue(evt) {
      if (this.isNext || this.editItem[0] === false || evt.target.value === '') return true;
      const valOrder = ['name', 'identifier', 'json']; // 输入框的顺序
      const fromKey = valOrder[this.editItem[1]]; // 根据上面定义的顺序取得输入值的key
      const toValue = evt.target.value; // 要输入的值
      const funcDefine = deepCopy(this.funcDefine); // 深复制
      funcDefine[this.realIndex[this.editItem[0]]][fromKey] = toValue; // 对应位置赋值
      this.changeTemp({ funcDefine }); // 更新到state
      this.funcOptions.content[this.editItem[0]][this.editItem[1]] = toValue; // 更新显示内容
      this.initInput(); // 取消选中
      return true;
    },
    // 清空输入框选中状态
    initInput() {
      this.editItem = [false, false];
    },
    // 按table键后跳转到下一个输入框
    nextInput(evt) {
      const xMax = 2; // 横向输入框数量
      const yMax = this.funcOptions.content.length - 1; // 纵向输入框数量
      // 计算下一个输入框的位置
      let nextItem = this.editItem.concat();
      if (this.editItem[1] < xMax) {
        nextItem[1] += 1;
      } else if (this.editItem[0] < yMax) {
        nextItem[0] += 1;
        nextItem[1] = 0;
      } else {
        nextItem = [0, 0];
      }
      // 确定之前的输入值
      if (!this.setValue(evt)) return;
      // 跳转到下一个输入框
      this.$nextTick(() => {
        this.showInput(
          nextItem[0],
          nextItem[1],
          this.funcOptions.content[nextItem[0]][nextItem[1]] // 更新输入框内容
        );
      });
      this.isNext = true;
    },
    setDelType(type = false) {
      this.setPulicModule({ delStatusType: type });
    },
    minusFunc() {
      this.setDelType(true);
    },
    Previous() {
      this.setPulicModule({ statusSetStep: 0 });
    },
    // 节流函数
    $_throttle() {
      if (this.timer) return false;
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.animationSecond * 1000);
      return true;
    },
    // 点击右侧图标
    operateEvent(key, index) {
      const realIndex = this.realIndex[index];
      switch (key) {
        case 'more':
          this.editStatus(realIndex);
          break;
        case 'page':
          this.insertPage(realIndex);
          break;
        case 'disable':
          this.$_delFun(index);
          break;
        default:
          break;
      }
    },
    dragItem(index) {
      this.dragFromIndex = index;
      this.dragToIndex = index;
    },
    dragMove(index) {
      this.dragToIndex = index;
    },
    async transPos() {
      if (this.dragFromIndex === this.dragToIndex) return;
      if (this.developType === 0) {
        const idList = deepCopy(this.funcImport);
        const toID = idList[this.dragToIndex];
        idList[this.dragToIndex] = idList[this.dragFromIndex];
        idList[this.dragFromIndex] = toID;
        const res = await https.fetchPost('/userDevice/save', { idList: JSON.stringify(idList), id: this.deviceKey, admin: this.admin });
        this.setDevModule({ userDeviceList: res.data });
      } else if (this.developType === 1) {
        // 定义换位函数
        const trans = (from, to, arr) => {
          const fromItem = deepCopy(arr[from]);
          const toItem = deepCopy(arr[to]);
          const arrCopy = deepCopy(arr);
          arrCopy[to] = fromItem;
          arrCopy[from] = toItem;
          return arrCopy;
        };
        const funcDefine = trans(this.realIndex[this.dragFromIndex], this.realIndex[this.dragToIndex], this.funcDefine);
        this.$set(this.funcOptions, 'content', trans(this.dragFromIndex, this.dragToIndex, this.funcOptions.content));
        this.changeTemp({ funcDefine });
        this.editItem = [false, false]; // 如果打开了输入框，要清掉
      }
    }
  }
};
</script>
