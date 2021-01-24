<template>
  <div class="gdp-table">
    <!-- 标题 -->
    <div class="gdp-table-title">
      <!-- 标题烂 -->
      <div class="gdp-table-title-group" v-for="(title, titleIndex) in titleList" :key="title.key" :style="flexStyle[titleIndex]">
        <span v-text="title.text" />
      </div>
    </div>
    <!-- 内容 -->
    <div class="gdp-table-content">
      <!-- 行 -->
      <div
        class="gdp-table-content-group"
        v-for="(contentList, rowIndex) in contentArray"
        :key="rowIndex"
        draggable="true"
        @dragstart="_dragStart(rowIndex)"
        @dragenter.prevent="_dragEnter(rowIndex)"
        @dragend="_dragEnd"
        @dragover.prevent
      >
        <!-- 列 -->
        <div class="gdp-table-content-group-item" v-for="(content, colIndex) in contentList" :key="colIndex" :style="flexStyle[colIndex]">
          <!-- 文字框 -->
          <div v-if="content.type === 'text'" class="text-type">
            <span
              v-text="content.text"
              v-show="rowIndex !== editTextAxis[0] || colIndex !== editTextAxis[1]"
              :class="{ 'edit-able': editAbleList[colIndex] }"
              @click="editAbleList[colIndex] ? editText(rowIndex, colIndex, content.text) : {}"
            />
            <input
              v-show="rowIndex === editTextAxis[0] && colIndex === editTextAxis[1]"
              :id="`input-${rowIndex}-${colIndex}`"
              :key="`input-${rowIndex}-${colIndex}`"
              @keyup.esc="initInput"
              @keyup.enter.prevent="enterInput"
              @keydown.tab.prevent="nextInput"
              @blur="enterInput"
              spellcheck="false"
            />
          </div>
          <!-- 选项框 -->
          <div v-else-if="content.type === 'select'" class="select-type">
            <!-- 没有选项的情况下显示文本 -->
            <span v-if="Object.keys(content.options).length <= 1 || !editAbleList[colIndex]" v-text="content.default" />
            <!-- 有选项的情况下显示选项 -->
            <select v-else v-model="content.select[content.key]" class="select-medium form-control" @change="content.method(rowIndex)">
              <option v-for="(optionValue, optionKey) in content.options" :key="optionKey" :value="optionKey" v-text="optionValue" />
            </select>
          </div>
          <!-- 简要标签 -->
          <div v-else-if="content.type === 'brief'" class="brief-type">
            <span
              v-for="(contentText, statusIndex) in content.options"
              v-text="contentText"
              :key="statusIndex"
              :class="{ 'edit-able': editAbleList[colIndex] }"
              @click="editAbleList[colIndex] ? content.method(rowIndex, statusIndex) : {}"
            />
          </div>
          <!-- icon按钮 -->
          <div v-else-if="content.type === 'icon'" class="icon-type">
            <i
              v-for="(icon, iconIndex) in content.options"
              class="iconfont"
              :key="iconIndex"
              :class="`iconfont-${icon.key}`"
              :title="icon.descript"
              @click="icon.method(rowIndex)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gdp-table',
  props: {
    // 标题
    titleList: {
      type: Array,
      default: () => {
        return [
          {
            text: '功能名称',
            editAble: true,
            flex: 12
          },
          {
            text: '标识符',
            editAble: true,
            flex: 12
          },
          {
            text: '控制字段',
            editAble: true,
            flex: 12
          },
          {
            text: '类型',
            editAble: true,
            flex: 14
          },
          {
            text: '状态简要',
            editAble: true,
            flex: 36
          },
          {
            text: '操作',
            editAble: true,
            flex: 14
          }
        ];
      }
    },
    // 内容
    contentArray: {
      type: Array,
      default: () => {
        const item = [
          {
            type: 'text',
            text: '上下定格'
          },
          {
            type: 'text',
            text: 'ConstUD'
          },
          {
            type: 'text',
            text: 'SwUpDn'
          },
          {
            type: 'select',
            options: {
              'active-button': '高级按钮',
              'active-homeButton': '主页按钮'
            },
            value: 'active-button'
          },
          {
            type: 'brief',
            options: ['默认：0', '定格1：2', '定格2：3', '定格3：4', '定格4：5', '定格5：6']
          },
          {
            type: 'icon',
            options: [
              {
                key: 'more',
                descript: '状态定义',
                method: () => {
                  console.log('-click-more----------');
                }
              },
              {
                key: 'page',
                descript: '插入页面',
                method: () => {
                  console.log('-click-more----------');
                }
              },
              {
                key: 'disable',
                descript: '删除',
                method: () => {
                  console.log('-click-more----------');
                }
              }
            ]
          }
        ];
        return [item, item, item];
      }
    },
    outputHandler: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      editTextAxis: [false, false],
      nextInputFlag: false,
      drag: {
        from: false,
        to: false
      }
    };
  },
  computed: {
    // 布局样式配置
    flexStyle() {
      const len = this.titleList.length;
      return this.titleList.map((title, index) => {
        const result = {
          flex: `0 0 ${title.flex}%`,
          'justify-content': 'center'
        };
        index === 0 && (result['justify-content'] = 'flex-start');
        index === len - 1 && (result['justify-content'] = 'flex-end');
        return result;
      });
    },
    // 内容是否可编辑
    editAbleList() {
      return this.titleList.map(title => Boolean(title.editAble));
    },
    // 可编辑文本的对应关系 { colIndex: key }
    editTextMap() {
      const result = {};
      let length = 0;
      this.titleList.forEach((title, colIndex) => {
        if (title.type === 'text') {
          result[colIndex] = title.key;
          length++;
        }
      });
      result.length = length;
      return result;
    }
  },
  methods: {
    // 编辑文本
    editText(rowIndex, colIndex, text) {
      if ([rowIndex, colIndex].includes(false)) return;
      const id = `input-${rowIndex}-${colIndex}`;
      const dom = document.getElementById(id);
      // 显示输入框
      this.editTextAxis = [rowIndex, colIndex];
      setTimeout(() => {
        dom.value = text;
        dom.focus();
        dom.select();
        this.nextInputFlag = false;
      }, 0);
    },
    // 退出编辑状态
    initInput() {
      this.editTextAxis = [false, false];
    },
    // 确认输入
    enterInput(e) {
      if (this.editTextAxis.includes(false) || this.nextInputFlag) return;

      const [rowIndex, colIndex] = this.editTextAxis;
      const key = this.editTextMap[colIndex];

      const value = e.target.value;
      // 输出
      this.outputHandler({
        key,
        type: 'text',
        value,
        rowIndex,
        colIndex
      });

      this.initInput();
    },
    // 切换到下一个文本框
    nextInput(e) {
      // if (this.inputType !== 1) return;
      // this.inputType = 2;
      const { length: colLen } = this.editTextMap;
      const { length: rowLen } = this.contentArray;
      // 计算下一个输入框的位置
      let nextTextAxis = this.editTextAxis.concat();
      if (this.editTextAxis[1] < colLen - 1) {
        nextTextAxis[1] += 1;
      } else if (this.editTextAxis[0] < rowLen - 1) {
        nextTextAxis[0] += 1;
        nextTextAxis[1] = 0;
      } else {
        nextTextAxis = [0, 0];
      }
      const { text } = this.contentArray[nextTextAxis[0]][nextTextAxis[1]];

      this.enterInput(e);
      this.$nextTick(() => {
        this.editText(...nextTextAxis, text);
      });
      this.nextInputFlag = true;
    },
    // 拖动开始
    _dragStart(index) {
      this.drag.from = index;
    },
    // 拖动进入
    _dragEnter(index) {
      this.drag.to = index;
    },
    // 拖动结束
    _dragEnd() {
      // 输出
      this.outputHandler({
        type: 'drag',
        drag: this.drag
      });

      this.initInput();
    }
  }
};
</script>

<style lang="scss" scoped>
.gdp-table {
  position: relative;
  height: auto;
  width: 100%;
  font-size: 14px;
  &-title {
    position: relative;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    background-color: #d9edf7;
    border: 1px solid rgb(214, 222, 230);
    &-group {
      display: flex;
      padding: 8px;
      > span {
        font-weight: 700;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: #333333;
        border-spacing: 0;
        border-collapse: collapse;
      }
    }
  }
  &-content {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    &-group {
      height: auto;
      min-height: 56px;
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      border: 1px solid rgb(214, 222, 230);
      border-top: 0;
      &:hover {
        background-color: #f0f0f0;
      }
      &-item {
        $padding: 8px;
        padding: $padding;
        display: flex;
        align-items: center;
        overflow: hidden;
        .text-type {
          // display: block;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: inherit;
          align-items: center;
          .edit-able {
            cursor: pointer;
            &:hover {
              color: #469dff;
              &::after {
                position: relative;
                top: 2px;
                right: -1px;
                font-family: 'Glyphicons Halflings';
                font-size: 12px;
                content: '\270f';
              }
            }
          }
          input {
            width: 100%;
          }
        }
        .select-type {
          > {
            select {
              cursor: pointer;
              &:hover {
                border: 1px Violet solid;
              }
            }
          }
        }
        .brief-type {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          height: auto;
          > span {
            margin: 5px;
            padding: 6px 8px;
            background-color: #f4f6f9;
            border-radius: 5px;
            border: 1px Thistle solid;
            &.edit-able {
              cursor: pointer;
              &:hover {
                border: 1px Violet solid;
              }
            }
          }
        }
        .icon-type {
          > i {
            font-size: 20px;
            margin-left: 16px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
