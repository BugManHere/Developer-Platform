<template>
  <div class="center-slider">
    <div v-show="Pow" class="slider-main">
      <div id="slider" :style="`opacity: ${work_temSetJson ? 1 : 0.01}`" />
      <div class="layer" :style="{ width: lottieRadius / 1.5 + 'px', height: lottieRadius / 1.5 + 'px' }">
        <div class="rotate -one"></div>
        <div class="rotate -two"></div>
      </div>
      <article>
        <!-- 显示模式/风档 -->
        <gree-block v-if="modName.length && fanName.length">
          <div class="left">
            <span v-text="modName" />
          </div>
          <div class="bar" />
          <div class="right">
            <span v-text="fanName" />
          </div>
        </gree-block>
        <gree-block v-else>
          <span v-if="modName.length" v-text="modName" />
          <span v-if="fanName.length" v-text="fanName" />
        </gree-block>
        <!-- 显示插槽2 -->
        <h3 v-if="work_imshowSlot2" class="auto-span" v-text="work_imshowSlot2" />
        <h3 v-else class="tem" v-text="circleVal" />
        <!-- 显示插槽1 -->
        <div v-if="work_imshowSlot1" class="room-tem-text">
          <span v-text="work_imshowSlot1" />
        </div>
      </article>
    </div>
    <div class="pow-off" v-show="!Pow" :style="{ width: svgRadius + 63.5 + 'px', height: svgRadius + 63.5 + 'px' }">
      <img src="@assets/img/off_bg.png" />
      <h3 v-text="'已关机'" />
    </div>
  </div>
</template>

<script>
import { Block } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import WorkLogin from '@logic/work';

export default {
  mixins: [WorkLogin],
  components: {
    [Block.name]: Block
  },
  data() {
    return {
      svgRadius: 0,
      lottieRadius: 0,
      circleVal: 26,
      temChange: false, // 轮询回来的温度改变flag
      fanName: '',
      modName: '',
      circleObj: '',
      timer: null, // 节流函数用
      sliderValueMap: {} // 节流函数用
    };
  },
  created() {
    this.svgRadius = window.screen.width * 0.7;
    this.lottieRadius = this.svgRadius * 1.8;
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      SetTem: state => state.dataObject.SetTem,
      TemSen: state => state.dataObject.TemSen,
      Mod: state => state.dataObject.Mod,
      WdSpd: state => state.dataObject.WdSpd
    })
  },
  mounted() {
    this.circleVal = this.SetTem;
    // init circular slider
    this.circleObj = $('#slider').roundSlider({
      min: 16,
      max: 30,
      step: 0.1,
      value: this.circleVal,
      radius: this.svgRadius / 2 + 5,
      width: 2,
      handleSize: '+35',
      keyboardAction: false,
      startAngle: -90,
      endAngle: '+360',
      sliderType: 'min-range',
      circleShape: 'full',
      handleShape: 'dot',
      start: () => {
        $('span.rs-block').css('padding', '2.7px');
      },
      stop: () => {
        $('span.rs-block').css('padding', '2px');
      },
      drag: e => {
        this.circleVal = Math.round(e.value);
      },
      beforeValueChange: e => {
        if (Math.abs(e.preValue - e.value) >= e.options.step * 30 && !this.temChange) return false;
        this.temChange = false;
        this.circleVal = Math.round(e.value);
      },
      change: e => {
        this.circleVal = Math.round(e.value);
        this.temSetMethod(this.circleVal);
        this.throttle(this.circleVal, 'value');
      }
    });
  },
  watch: {
    g_statusMap: {
      handler(newVal) {
        if (!newVal) return;
        const fanStateName = this.getStateNameByKey(this.work_fanKey);
        if (fanStateName) {
          this.fanName = this.$language(`fan.${fanStateName}`);
        }
        const modStateName = this.work_modDefine ? this.getStateNameByKey(this.work_modDefine.identifier) : '';
        if (modStateName) {
          this.modName = this.$language(`mod.${modStateName}`);
        }
      },
      immediate: true,
      deep: true
    },
    // 圆环数值
    work_temSetVal: {
      handler(newVal) {
        this.temChange = true;
        this.throttle(newVal, 'value');
      },
      immediate: true
    },
    // 圆环字段
    work_temSetJson: {
      handler(newVal) {
        this.temChange = true;
        const value = this.g_inputMap[newVal];
        this.throttle(value, 'value');
      },
      immediate: true
    },
    // 圆环最小值
    work_temMinVal: {
      handler(newVal) {
        this.throttle(newVal, 'min');
      },
      immediate: true
    },
    // 圆环最大值
    work_temMaxVal: {
      handler(newVal) {
        this.throttle(newVal, 'max');
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setCheckObject: 'SET_CHECK_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    // 温度设置方法
    temSetMethod(value) {
      value === this.work_temSetVal || this.changeData({ [this.work_temSetJson]: value });
    },
    getStateNameByKey(key) {
      const map = this.g_statusMap[key];
      if (map) {
        const status = map.status;
        const define = this.g_funcDefineMap[key];
        const statusName = define.statusDefine[status].name;
        const stateName = `${key}_${statusName}`;
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
      }, 20);
    }
  }
};
</script>
