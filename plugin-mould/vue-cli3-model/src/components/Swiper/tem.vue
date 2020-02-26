<template>
  <div>
    <Swiper
      :ref="ref" 
      class="tem-swiper"
      :slides-data="options" 
      @realIndex="swiperChange"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Swiper from './index';

export default {
  components: {
    Swiper
  },
  data() {
    return {
      ref: 'temSwiper',
      itemList: [],
      temList: [],
      swiperVal: 16, // 当前滑轮位置的温度值
      minVal: 16, // 最小值
      maxVal: 30, // 最大值
      leftLen: 3, // 按下滑轮后左边可供显示的元素数目（为了性能考虑，不全显示）
      rightLen: 3,
      currentTemStep: 1,
      changeStepFlag: false,
    };
  },
  computed: {
    ...mapState({
      SetTem: state => state.dataObject.SetTem,
      Mod: state => state.dataObject.Mod,
      Pow: state => state.dataObject.Pow,
      has01: state => state.dataObject.has01,
      has05: state => state.dataObject.has05,
      autoAbleSetTem: state => state.autoAbleSetTem,
      add01: state => state.dataObject['Add0.1'],
      add05: state => state.dataObject['Add0.5']
    }),
    options() {
      return {
        key: 'tem', 
        list: this.itemList,
        isNumber: true
      };
    },
    temStep() {
      return (this.has01 && 0.1) || (this.has05 && 0.5) || 1;
    },
    // swiper显示的slide总数
    swiperLen() {
      return this.leftLen + this.rightLen + 1;
    },
    // 实际温度值
    currentVal() {
      const result = this.SetTem + (this.add01 * 0.1 || this.add05 * 0.5);
      return result;
    },
    // 显示文本，禁止滑动
    banSwiping() {
      return !this.Mod || this.autoAbleSetTem;
    }
  },
  watch: {
    currentVal(newVal) {
      if (newVal === this.swiperVal || this.banSwiping) return;
      this.removeAllSlide();
      this.insertAllSlide();
    },
    has01(newVal) {
      if (!newVal || this.banSwiping) return;
      this.currentTemStep = this.temStep;
      this.removeAllSlide();
      this.insertAllSlide();
    },
    has05(newVal) {
      if (!newVal || this.banSwiping) return;
      this.currentTemStep = this.temStep;
      this.removeAllSlide();
      this.insertAllSlide();
    },
    banSwiping() {
      this.ableSwiping();
    }
  },
  mounted() {
    this.initList();
    this.updateSwiper();
    this.ableSwiping();
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(val) {
      this.setDataObject(val);
      this.sendCtrl(val);
    },
    // 给滑轮赋予初始区间
    initList() {
      this.currentTemStep = this.temStep;
      this.swiperVal = this.currentVal;
      const list = [];
      for (let i = -this.leftLen; i <= this.rightLen; i += 1) {
        const value = this.countVal(this.swiperVal, i * this.currentTemStep);
        const decimal = Math.round((value * 10) % 10);
        const integer = Math.round(value - decimal / 10);
        list.push({
          value,
          integer, // 整数
          decimal // 小数
        });
      }
      this.itemList = list;
      this.temList = JSON.parse(JSON.stringify(list));
    },
    // 更新滑轮的显示区间
    updateList(index) {
      const moveLen = index - this.leftLen;
      this.removeSlide(moveLen);
      this.insertSlide(moveLen);
      this.swiperVal = this.currentVal;
    },
    // 滑轮定位到当前位置
    updateSwiper() {
      this.$nextTick(() => {
        this.$refs[this.ref].setIndex(this.leftLen); // 定位到中间
      });
    },
    // 计算滑轮向左（右）滑动moveLen后的值                                                                                                              
    countVal(fromVal, moveLen) {
      let toVal = fromVal + moveLen;
      if (toVal < this.minVal) {
        toVal += (this.maxVal - this.minVal) + this.currentTemStep;
      } else if (toVal > this.maxVal) {
        toVal -= (this.maxVal - this.minVal) + this.currentTemStep;
      }
      return Math.abs(toVal * 10) / 10;
    },
    // 移除slide
    removeSlide(moveLen) {
      const direction = moveLen <= 0; // false：往右滑，true：往左滑
      const removeLen = Math.abs(moveLen) <= this.swiperLen ? Math.abs(moveLen) : this.swiperLen;
      const removeIndexList = Array.from({ length: removeLen }, (item, index) => {
        return direction ? (this.leftLen + this.rightLen) - index : index;
      }); 
      // 需要移除的slide的Index
      this.$refs[this.ref].removeSlide(removeIndexList);
      // 更新temList
      this.temList.splice(
        direction ? (this.leftLen + this.rightLen) - Math.abs(moveLen) + 1 : 0,
        Math.abs(moveLen)
      );
    },
    // 新增slide
    insertSlide(moveLen) {
      const direction = moveLen / Math.abs(moveLen); // 1：往右，-1：往左
      const len = direction === 1 ? this.rightLen : this.leftLen;
      const funcName = direction === 1 ? 'appendSlide' : 'prependSlide';
      const startIndex = Math.abs(moveLen) <= this.swiperLen ? 1 : Math.abs(moveLen) - this.swiperLen + 1;
      for (let i = startIndex; i <= Math.abs(moveLen); i += 1) {
        const value = this.countVal(this.swiperVal, (i + len) * this.currentTemStep * direction);
        const decimal = Math.round((value * 10) % 10);
        const integer = Math.floor(value);
        this.$refs[this.ref][funcName](`<div class="swiper-slide"><p>${integer}</p>${decimal ? `<span>.${decimal}</span>` : ''}</div>`);
        // 更新temList
        const operate = direction === 1 ? 'push' : 'unshift';
        this.temList[operate]({
          value,
          integer, 
          decimal 
        });
      }
    },
    // 移除所有slide
    removeAllSlide() {
      const list = Array.from({length: this.swiperLen}, (v, index) => index);
      list.splice(this.leftLen, 1);
      this.$refs[this.ref].removeSlide(list);
      // 更新temList
      this.temList = [];
    },
    // 根据需求新增slide 
    insertAllSlide() {
      const value = this.SetTem + (this.add01 * 0.1 || this.add05 * 0.5);
      const valueInteger = Math.floor(value);
      const valueDecimal = Math.round((value * 10) % 10);
      const step = this.has01 ? 0.1 : (1 - this.has05 * 0.5);
      let leftTem = Math.floor(value * (1 / step)) / (1 / step);
      let rightTem = Math.ceil(value * (1 / step)) / (1 / step);
      if (leftTem === rightTem) {
        leftTem -= step;
        rightTem += step;
      } else {
        this.changeStepFlag = true;
      }
      // 左边添加slide
      for (let i = 0; i > -this.leftLen; i -= 1) {
        const toVal = this.countVal(leftTem, i * step);
        const decimal = Math.round((toVal * 10) % 10);
        const integer = Math.floor(toVal);
        this.$refs[this.ref].prependSlide(`<div class="swiper-slide"><p>${integer}</p>${decimal ? `<span>.${decimal}</span>` : ''}</div>`);
        // 更新temList
        this.temList.unshift({
          value: toVal,
          integer, 
          decimal 
        });
      }
      // 中间
      this.$refs[this.ref].appendSlide(`<div class="swiper-slide"><p>${valueInteger}</p>${valueDecimal ? `<span>.${valueDecimal}</span>` : ''}</div>`);
      this.$refs[this.ref].removeSlide(this.leftLen);
      // 更新temList
      this.temList.push({
        value,
        integer: valueInteger,
        decimal: valueDecimal
      });
      // 右边添加slide
      for (let i = 0; i < this.rightLen; i += 1) {
        const toVal = this.countVal(rightTem, i * step);
        const decimal = Math.round((toVal * 10) % 10);
        const integer = Math.floor(toVal);
        this.$refs[this.ref].appendSlide(`<div class="swiper-slide"><p>${integer}</p>${decimal ? `<span>.${decimal}</span>` : ''}</div>`);
        // 更新temList
        this.temList.push({
          value: toVal,
          integer, 
          decimal 
        });
      }
    },
    // 滑动事件
    swiperChange(index) {
      if (index === this.leftLen || this.banSwiping) return;
      const {decimal, integer} = this.temList[index];
      decimal >= 5 ? this.changeData({ SetTem: integer, 'Add0.1': decimal, 'Add0.5': 1 }) : this.changeData({ SetTem: integer, 'Add0.1': decimal, 'Add0.5': 0 });
      this.updateList(index); // 更新滑轮
      // 如果切换了温度跨度，需要处理
      if (this.changeStepFlag) {
        this.removeAllSlide();
        this.insertAllSlide();
        this.changeStepFlag = false;
      }
    },
    ableSwiping() {
      const ref = this.$refs[this.ref];
      if (this.banSwiping) {
        ref.showText(true, this.$language('mode.auto'));
        ref.touchControlAble(true);
      } else {
        ref.showText(false);
        ref.touchControlAble(false);
      }
    }
  }
};
</script>
