<template>
  <div class="center-slider">
    <div v-show="powType()" class="center-slider-main">
      <div id="slider" :style="`opacity: ${temAbleSet ? 1 : 0.01}`" />
      <div
        class="layer"
        :style="{
          width: lottieRadius / 1.5 + 'px',
          height: lottieRadius / 1.5 + 'px',
          'background-position': `0 ${roundBg * 100}%`
        }"
      >
        <div class="rotate -one"></div>
        <div class="rotate -two"></div>
      </div>
      <article>
        <!-- 显示模式/风档 -->
        <gree-block v-if="modText.length && fanName.length">
          <div class="left">
            <span v-text="modText" />
          </div>
          <div class="bar" />
          <div class="right">
            <span v-text="fanName" />
          </div>
        </gree-block>
        <gree-block v-else>
          <span v-if="modText.length" v-text="modText" />
          <span v-if="fanName.length" v-text="fanName" />
        </gree-block>
        <!-- 显示插槽2 -->
        <h3 v-if="imshowSlot2" class="slider-slot-2" v-text="imshowSlot2" />
        <!-- 温度调节 -->
        <div v-else class="tem-value" :class="{ 'deci-tem': temStep < 1 }">
          <gree-animated-number class="tem-value-int" :value="circleValInt" :precision="0" :duration="200" transition />
          <gree-animated-number v-if="temStep < 1" class="tem-value-dec" :value="circleValDec * 10" :precision="0" :duration="200" transition />
          <div :class="{ 'unit-tem': temSetJson === 'SetTem', 'unit-humi': temSetJson === 'SetCoolHumi' }" v-text="circleValUnit" />
        </div>
        <!-- 显示插槽1 -->
        <div v-if="imshowSlot1" class="slider-slot-1">
          <span v-text="imshowSlot1" />
        </div>
      </article>
    </div>
    <!-- 加减按钮 -->
    <div class="center-slider-btn-group" :class="{ 'set-gray': imshowSlot2 }" v-if="powType()">
      <div class="center-slider-btn-group-minus" @click="setTemByStep(-1)" />
      <div class="center-slider-btn-group-plus" @click="setTemByStep(1)" />
    </div>
    <div class="pow-off" v-else :style="{ width: svgRadius + 63.5 + 'px', height: svgRadius + 63.5 + 'px' }">
      <h3 v-text="'已关机'" />
    </div>
  </div>
</template>

<script>
import { Block, AnimatedNumber } from 'gree-ui';
import { mapActions, mapGetters } from 'vuex';
import { types } from '@/store/types';
import { statusNameGetter } from '@/utils/fsm';

export default {
  props: {
    roundBg: {
      type: Number,
      default: 0
    }
  },
  components: {
    [Block.name]: Block,
    [AnimatedNumber.name]: AnimatedNumber
  },
  data() {
    return {
      svgRadius: 0,
      lottieRadius: 0,
      circleVal: 26,
      temChange: false, // 轮询回来的温度改变flag
      fanName: '',
      circleObj: '',
      timer: null, // 节流函数用
      sliderValueMap: {} // 节流函数用
    };
  },
  created() {
    this.svgRadius = window.screen.width * 0.8;
    this.lottieRadius = this.svgRadius * 1.8;
  },
  computed: {
    ...mapGetters([
      'inputMap',
      'temSetVal',
      'temSetJson',
      'temMinVal',
      'temMaxVal',
      'temStep',
      'temAbleSet',
      'fanIdentifier',
      'imshowSlot1',
      'imshowSlot2',
      'modTextKey'
    ]),
    ...mapGetters('machine', ['funcDefineMap', 'statusMap']),
    modText() {
      return this.$language(this.modTextKey);
    },
    circleValInt() {
      return Math.floor(this.circleVal);
    },
    circleValDec() {
      return this.circleVal % 1;
    },
    circleValUnit() {
      const map = { SetTem: '℃', SetCoolHumi: '%', undefined: '' };
      const result = map[this.temSetJson];
      return result;
    }
  },
  mounted() {
    this.circleVal = this.temSetVal;
    // init circular slider
    this.circleObj = $('#slider').roundSlider({
      animation: false,
      showTooltip: false,
      min: 16,
      max: 30,
      step: 0.1,
      value: this.circleVal,
      radius: this.svgRadius / 2 + 5,
      width: 5,
      handleSize: '+38',
      keyboardAction: false,
      startAngle: -45,
      endAngle: '+270',
      sliderType: 'min-range',
      circleShape: 'full',
      handleShape: 'dot',
      svgMode: true,
      borderWidth: 0,
      borderColor: 'rgb(240, 240, 240)',
      pathColor: 'rgb(240, 240, 240)',
      rangeColor: '#ffffff',
      start: () => {
        this.temChange = false;
        // $('span.rs-block').css('padding', '2.7px');
      },
      stop: () => {
        // $('span.rs-block').css('padding', '2px');
      },
      drag: e => {
        const base = 1 / this.temStep;
        this.circleVal = Math.round(e.value * base) / base;
      },
      beforeValueChange: e => {
        if (Math.abs(e.preValue - e.value) >= (this.temMaxVal - this.temMinVal) / 3 && !this.temChange) return false;
        const base = 1 / this.temStep;
        this.temChange = false;
        this.circleVal = Math.round(e.value * base) / base;
      },
      change: e => {
        const base = 1 / this.temStep;
        this.circleVal = Math.round(e.value * base) / base;
        this.temSetMethod(this.circleVal);
        this.throttle(this.circleVal, 'value');
      }
    });
  },
  activated() {
    this.setSliderArea();
  },
  watch: {
    statusMap: {
      handler(newVal) {
        if (!newVal) return;
        const fanStateName = this.getStateNameById(this.fanIdentifier);
        if (fanStateName) {
          this.fanName = this.$language(`fan.${fanStateName}`);
        }
      },
      immediate: true,
      deep: true
    },
    // 圆环数值
    temSetVal: {
      handler(newVal) {
        this.temChange = true;
        this.throttle(newVal, 'value');
      },
      immediate: true
    },
    // 圆环最小值
    temMinVal: {
      handler(newVal) {
        this.throttle(newVal, 'min');
      },
      immediate: true
    },
    // 圆环最大值
    temMaxVal: {
      handler(newVal) {
        this.throttle(newVal, 'max');
      },
      immediate: true
    },
    circleValInt: {
      handler() {
        this.outPutCircleVal();
      },
      immediate: true
    },
    circleValDec: {
      handler() {
        this.outPutCircleVal();
      },
      immediate: true
    },
    circleValUnit: {
      handler() {
        this.outPutCircleVal();
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      sendData: types.SEND_DATA
    }),
    // 温度设置方法
    temSetMethod(value) {
      value === this.temSetVal || this.sendData({ [this.temSetJson]: value });
    },
    getStateNameById(identifier) {
      const map = this.statusMap[identifier];
      if (map) {
        const statusName = map.statusName;
        const status = this.funcDefineMap[identifier];
        const name = status.statusDefine[statusName].name;
        const stateName = `${identifier}_${name}`;
        return stateName;
      }
      return false;
    },
    // 节流函数
    throttle(value, key) {
      this.sliderValueMap[key] = value;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        $('#slider').roundSlider(this.sliderValueMap);
        this.sliderValueMap = {};
        // 关闭更新标志位
        this.$nextTick(() => {
          this.temChange = false;
        });
      }, 20);
    },
    // 设置温度上下限
    setSliderArea() {
      this.temChange = true;
      $('#slider').roundSlider({
        min: this.temMinVal,
        max: this.temMaxVal,
        value: this.temSetVal
      });
    },
    // 根据间隔设置温度
    setTemByStep(type) {
      const step = this.temStep;
      this.temSetMethod(this.circleVal + step * type);
    },
    outPutCircleVal() {
      this.$emit('circleVal', {
        int: this.circleValInt,
        dec: this.circleValDec,
        val: this.circleVal,
        unit: this.circleValUnit,
        show: Boolean(!this.imshowSlot2)
      });
    },
    powType() {
      return statusNameGetter('Pow') === 'status_1';
    }
  }
};
</script>
