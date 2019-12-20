<template>
  <div class="gr-transfer">
    <!-- 左边列表 -->
    <div class="gr-transfer-panel">
      <!-- 左边列表-标题 -->
      <div class="gr-transfer-header" @click="selectAll(0)">
        <div class="gr-transfer-checkbox">
          <div
            class="checkbox-input"
            :class="{'select select-some': selectType.left === 1, 'select select-all': selectType.left === 2}"
          />
          <span class="checkbox-text">未选择</span>
          <span class="checkbox-number">{{ selectListNum.left }}/{{ itemList.left.length }}</span>
        </div>
      </div>
      <!-- 左边列表-内容 -->
      <div class="gr-transfer-body">
        <div class="gr-transfer-list">
          <div
            class="gr-transfer-item able crowd"
            v-for="(item, index) in itemList.left"
            :key="index"
            @click="selectOne(0, index)"
          >
            <div class="checkbox-input" :class="{'select select-all': selectList.left[index]}" />
            <span class="checkbox-label" v-text="item"/>
          </div>
        </div>
      </div>
    </div>
    <!-- 中间按钮 -->
    <div class="gr-transfer-buttons">
      <!-- 向上 -->
      <button
        type="button"
        class="gr-transfer-button btn btn-default"
        :class="{disable: !selectListNum.right || selectListNum.left || selectList.right[0]}"
        @click="optionLift(0)"
      >
        <span class="arrow-up" />
      </button>
      <!-- 向右 -->
      <button
        type="button"
        class="gr-transfer-button btn btn-default"
        :class="{disable: !selectListNum.left}"
        @click="changeSide(0)"
      >
        <span class="arrow-right" />
      </button>
      <!-- 向左 -->
      <button
        type="button"
        class="gr-transfer-button btn btn-default"
        :class="{disable: !selectListNum.right}"
        @click="changeSide(1)"
      >
        <span class="arrow-left" />
      </button>
      <!-- 向下 -->
      <button
        type="button"
        class="gr-transfer-button btn btn-default"
        :class="{disable: !selectListNum.right || selectListNum.left || selectList.right[selectList.right.length - 1]}"
        @click="optionLift(1)"
      >
        <span class="arrow-down" />
      </button>
    </div>
    <!-- 右边列表 -->
    <div class="gr-transfer-panel">
      <!-- 右边列表-标题 -->
      <div class="gr-transfer-header" @click="selectAll(1)">
        <div class="gr-transfer-checkbox">
          <div
            class="checkbox-input"
            :class="{'select select-some': selectType.right === 1, 'select select-all': selectType.right === 2}"
          />
          <span class="checkbox-text">已选择</span>
          <span class="checkbox-number">{{ selectListNum.right }}/{{ itemList.right.length }}</span>
        </div>
      </div>
      <!-- 右边列表-内容 -->
      <div class="gr-transfer-body">
        <div class="gr-transfer-list">
          <canvas v-show="itemList.right.length" id="transfer-line" width="196" :height="lineCanvas.height" ref="canvas">

          </canvas>
          <!-- 固定内容 -->
          <div
            class="gr-transfer-item"
            v-for="(item, index) in disAbleList"
            :key="-index-1"
          >
            <span class="checkbox-label" v-text="item"/>
          </div>
          <!-- 自选内容 -->
          <div
            class="gr-transfer-item able"
            v-for="(item, index) in itemList.right"
            :key="index"
            @click="selectOne(1, index)"
          >
            <div
              class="checkbox-input"
              :class="{'select select-all': selectList.right[index]}"
            />
            <span class="checkbox-label" v-text="item"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/scss/transfer/index.scss";
import _sum from "lodash/sum";
import _difference from "lodash/difference";

export default {
  props: {
    optionslList: {
      type: Object,
      default: function() {
        return {
          left: [
            "默认状态",
            "智能风",
            "风随人",
            "风避人",
            "环绕风",
            "其他状态"
          ],
          right: [],
          const: []
        };
      }
    }
  },
  data() {
    return {
      // 是否被选中。键值 right、left 对应 ==> 子元素类型：Booblean
      selectList: {
        left: [],
        right: []
      },
      // 选项列表。键值 right、left 对应 ==> 子元素类型：String
      itemList: {
        left: [],
        right: []
      },
      // 传入的固定值，不可改动，子元素类型：String
      disAbleList: [],
    };
  },
  watch: {
    // 监听输入
    optionslList: {
      handler() {
        this.disAbleList = this.optionslList.const;
        this.selectList.left = Array.from(this.optionslList.left, () => {
          return false;
        });
        this.itemList.left = this.optionslList.left.concat();
        this.itemList.right = this.optionslList.right.concat();
      },
      deep: true,
      immediate: true
    },
    // 监听canvas变化
    lineCanvas: {
      handler(newVal) {
        this.$nextTick(() => {
          this.initCanvas();
        })
      },
      deep: true
    },
    itemList: {
      handler(newVal) {
        const result = {};
        const valToIndex = (arr) => {
          return arr.map(val => {
            return newVal.right.indexOf(val);
          })
        };
        result.num = newVal.right.length;
        result.left = valToIndex(this.optionslList.left);
        result.right = valToIndex(this.optionslList.right);
        this.$emit('itemList', result);
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initCanvas();
  },
  computed: {
    // 键值 right、left 对应 ==> 0未被选中 1被选中 2被全选
    selectType() {
      const getType = arr => {
        if (!_sum(arr)) {
          return 0;
        } else if (_sum(arr) !== arr.length) {
          return 1;
        }
        return 2;
      };
      return {
        left: getType(this.selectList.left),
        right: getType(this.selectList.right)
      };
    },
    // 键值 right、left 对应 ==> 已选中元素数量
    selectListNum() {
      const getNum = arr => {
        const len = arr.length;
        if (!len) {
          return 0;
        } else if (len === 1) {
          return arr[0] - 0;
        }
        return _sum(arr);
      };
      return {
        left: getNum(this.selectList.left),
        right: getNum(this.selectList.right)
      };
    },
    // 返回canvas高度
    lineCanvas() {
      const unit = 30;
      const gap = 7;
      const baseNum = this.disAbleList.length;
      const listNum = this.itemList.right.length;
      return {
        height: baseNum * (unit + gap) + listNum * (unit + gap) - gap
      }
    }
  },
  methods: {
    // 选中所有
    selectAll(type) {
      const key = ["left", "right"][type];
      if (_sum(this.selectList[key]) === this.selectList[key].length) {
        this.$set(
          this.selectList,
          key,
          Array(this.selectList[key].length).fill(false)
        );
      } else {
        this.$set(
          this.selectList,
          key,
          Array(this.selectList[key].length).fill(true)
        );
      }
    },
    // 选中某一个
    selectOne(type, index) {
      const key = ["left", "right"][type];
      const value = this.selectList[key][index];
      this.$set(this.selectList[key], index, !value);
    },
    // 改变位置（左右）
    changeSide(type) {
      const from = ["left", "right"][type];
      const to = ["right", "left"][type];
      const targetArr = [];
      if (!this.selectListNum[from]) return;
      this.selectList[from].forEach((item, index) => {
        if (item) {
          targetArr.push(this.itemList[from][index]);
        }
      });
      const targetLen = targetArr.length;
      const fromLen = this.selectList[from].length - targetLen;
      const toLen = this.selectList[to].length + targetLen;
      this.selectList[from] = Array(fromLen).fill(false);
      this.selectList[to] = Array(toLen).fill(false);
      this.$set(
        this.itemList,
        from,
        _difference(this.itemList[from], targetArr)
      );
      this.$set(this.itemList, to, [
        ...this.itemList[to],
        ...targetArr
      ]);
    },
    // 改变位置（上下）
    optionLift(type) {
      const inputArr = type ? this.itemList.right.concat().reverse() : this.itemList.right.concat();
      const logicArr = type ? this.selectList.right.concat().reverse() : this.selectList.right.concat();
      const setOrder = (inputArr, logicArr) => {
        logicArr.forEach((item, index) => {
          if (item) {
            let temporary = inputArr[index];
            inputArr[index] = inputArr[index - 1];
            inputArr[index - 1] = temporary;
          }
        });
        return inputArr;
      }
      const result = type ? setOrder(inputArr, logicArr).reverse() : setOrder(inputArr, logicArr);
      this.$set(this.itemList, 'right', result);
      this.$set(this.selectList, 'right', Array(result.length).fill(false));
      this.initCanvas();
    },
    // 初始化
    initCanvas() {
      const canvas = document.getElementById('transfer-line');
      const context = canvas.getContext('2d');

      const target = document.getElementsByClassName('checkbox-label');
      const targetWidth = target[target.length - 1].offsetWidth;

      // 长箭头
      const longArrow = () => {
        const leftTo = 98;
        const leftFrom = targetWidth + 39;
        const right = 132;
        const up = 52;
        const down = this.lineCanvas.height - 15;
        const halfLineWidth = 2;
        const arrowWidth = 8;
        const halfArrowHeight = 4;

        context.beginPath();
        context.moveTo(leftTo, up - halfLineWidth);
        context.lineTo(right + halfLineWidth, up - halfLineWidth);
        context.lineTo(right + halfLineWidth, down + halfLineWidth);
        context.lineTo(leftFrom, down + halfLineWidth);
        context.lineTo(leftFrom, down - halfLineWidth);

        context.lineTo(right - halfLineWidth, down - halfLineWidth);
        context.lineTo(right - halfLineWidth, up + halfLineWidth);
        context.lineTo(leftTo, up + halfLineWidth);
        context.lineTo(leftTo, up + halfLineWidth + halfArrowHeight);
        context.lineTo(leftTo - arrowWidth, up);
        context.lineTo(leftTo, up - halfLineWidth - halfArrowHeight);
        context.lineTo(leftTo, up - halfLineWidth);
        context.closePath();
        context.stroke();
      };
      // 短箭头
      const shortArrow = index => {
        const gap = 37;
        const basePoint = [47, 25 + index * gap];
        const hl = basePoint[0];
        const va = basePoint[1];

        const LineHeight = 12;
        const halfLineWidth = 1.5;
        const halfArrowWidth = 3;
        const arrowHeight = 6;
        context.beginPath();
        context.moveTo(hl - halfLineWidth, va);
        context.lineTo(hl + halfLineWidth, va);
        context.lineTo(hl + halfLineWidth, va + LineHeight);
        context.lineTo(hl + halfLineWidth + halfArrowWidth, va + LineHeight);
        context.lineTo(hl, va + LineHeight + arrowHeight);
        context.lineTo(hl - halfLineWidth - halfArrowWidth, va + LineHeight);
        context.lineTo(hl - halfLineWidth, va + LineHeight);
        context.lineTo(hl - halfLineWidth, va);
        context.closePath();
        context.stroke();
      };

      context.lineWidth = 1.5;
      context.strokeStyle = "#404657";
      canvas.width = canvas.width;

      longArrow();
      const len = this.disAbleList.length + this.itemList.right.length;
      for (let i = 0; i < len - 1; i += 1) {
        shortArrow(i);
      }
    },
  }
};
</script>
