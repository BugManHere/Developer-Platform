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
      const result = this.SetTem + ((this.add01 * 0.1) || (this.add05 * 0.5)) || 0;
      return result;
    },
    // 显示文本，禁止滑动
    banSwiping() {
      return !this.Mod || this.autoAbleSetTem;
    }
  },
  watch: {
    currentVal() {
      // if (newVal === this.swiperVal) return;
      this.initSwiper();
    },
    temStep() {
      localStorage.has01 = this.has01;
      localStorage.has05 = this.has05;
      this.currentTemStep = this.temStep;
      this.initSwiper();
    },
    banSwiping() {
      this.ableSwiping();
    },
  },
  created() {
    if (!localStorage.has01 && !localStorage.has05) {
      this.setDataObject({
        has01: 0,
        has05: 1,
      });
    } else {
      this.setDataObject({
        has01: Number(localStorage.has01),
        has05: Number(localStorage.has05),
      });
    }
  },
  mounted() {
    this.setList();
    this.updateSwiper();
    this.ableSwiping();
    this.$nextTick(() => {
      this.initSwiper();
    });
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(val) {
      this.setDataObject(val);
      this.sendCtrl(val);
    },
    // 初始化
    initSwiper() {
      this.removeAllSlide();
      this.$nextTick(() => {
        this.updateSwiper();
        if (this.temList.length) return;
        this.insertAllSlide();
      });
    },
    // 给滑轮赋予初始区间
    setList() {
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
    updateList() {
      // const moveLen = index - this.leftLen;
      // this.removeSlide(moveLen);
      // this.insertSlide(moveLen);
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
      // 四舍五入，精确到小数点后两位
      const round100 = val => {
        return Math.round(val * 100) / 100;
      };
      if (toVal < this.minVal) {
        toVal += (this.maxVal - this.minVal) + this.currentTemStep;
      } else if (toVal > this.maxVal) {
        toVal -= (this.maxVal - this.minVal) + this.currentTemStep;
      }
      return round100(Math.abs(toVal * 10) / 10);
    },
    // 移除slide
    removeSlide(moveLen) {
      if (this.temList.length === this.swiperLen) return;
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
        const value = this.countVal(this.swiperVal, ((i + len) * this.currentTemStep * direction) - moveLen * this.currentTemStep);
        const decimal = Math.round((value * 10) % 10);
        const integer = Math.floor(value);
        if (!this.temList.map(item => item.value).includes(value)) {
          this.$refs[this.ref][funcName](`<div class="swiper-slide"><p>${integer}</p>${decimal ? `<span>.${decimal}</span>` : ''}</div>`);
          // 更新temList
          const operate = direction === 1 ? 'push' : 'unshift';
          this.temList[operate]({
            value,
            integer, 
            decimal 
          });
        }
      }
    },
    // 移除所有slide
    removeAllSlide() {
      // 清除所有slide
      this.$refs[this.ref].removeAllSlides();
      // 更新temList
      this.temList = [];
    },
    // 根据情况填充slide 
    insertAllSlide() {
      const value = this.SetTem + (this.add01 * 0.1 || this.add05 * 0.5);
      const valueInteger = Math.floor(value);
      const valueDecimal = Math.round((value * 10) % 10);
      const step = this.temStep;
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
        this.initSwiper();
        this.changeStepFlag = false;
      }
    },
    ableSwiping() {
      const ref = this.$refs[this.ref];
      if (this.banSwiping) {
        ref.showText(true, this.$language('mode.auto'));
      } else {
        ref.showText(false);
      }
    },

  }
};
</script>
