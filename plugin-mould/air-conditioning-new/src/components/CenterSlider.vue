<template>
  <div class="center-slider">
    <div v-show="Pow" class="slider-main">
      <div id="slider" :style="`opacity: ${Mod ? 1 : 0.01}`" />
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
        <gree-block v-else style="margin-bottom: 5px">
          <span v-if="modName.length" v-text="modName" />
          <span v-if="fanName.length" v-text="fanName" />
        </gree-block>
        <!--  -->
        <h3 v-if="imshowSlot2" class="auto-span" v-text="imshowSlot2" />
        <h3 v-else class="tem" v-text="circleVal" />
        <!-- 显示插槽1 -->
        <div v-if="imshowSlot1" class="room-tem-text">
          <span v-text="imshowSlot1" />
          <!-- <span v-text="`室温 `" />
          <span v-if="roomTemShow" class="value" v-text="`${TemSen > 40 ? TemSen - 40 : TemSen}`" />
          <span v-if="roomTemShow" v-text="'℃'" /> -->
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
import LogicDefine from '@logic/define';

export default {
  mixins: [LogicDefine],
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
      sliderValueMap: {}, // 节流函数用
      temKey: 'tem', // 查找温度字段
      temMinKey: 'temMin', // 查找温度下限用
      temMaxKey: 'temMax' // 查找温度上限用
    };
  },
  created() {
    this.svgRadius = window.screen.width * 0.7;
    this.lottieRadius = this.svgRadius * 1.8;
  },
  computed: {
    ...mapState({
      fanKey: state => state.fanKey,
      modKey: state => state.modKey,
      Pow: state => state.dataObject.Pow,
      SetTem: state => state.dataObject.SetTem,
      TemSen: state => state.dataObject.TemSen,
      Mod: state => state.dataObject.Mod,
      WdSpd: state => state.dataObject.WdSpd
    }),
    // 模式的定义
    modDefine() {
      return this.g_funcDefine_inertia.find(module => module.type === `inertia-${this.modKey}`);
    },
    // 显示插槽1, 存在被隐藏的状态就不显示
    imshowSlot1() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === 'inertia-imshowSlot1')
        .filter(module => !this.g_hideStateArr.some(state => state.includes(module.identifier)));
      // 存在多个的情况时，只取第一个，其他不处理
      if (modules.length) {
        const json = modules[0].json;
        const value = this.g_inputMap[json];
        const id = modules[0].identifier;
        const text = this.$language(`slot1.${id}`).replace('%s', value);
        return text;
      }
      return undefined;
    },
    // 显示插槽2, 隐藏的状态被禁用就显示
    imshowSlot2() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === 'inertia-imshowSlot2')
        .filter(module => this.g_hideStateArr.some(state => state.includes(module.identifier)));
      // 存在多个的情况时，只取第一个，其他不处理
      console.log(modules);
      if (modules.length) {
        const json = modules[0].json;
        const value = this.g_inputMap[json];
        const id = modules[0].identifier;
        const text = this.$language(`slot2.${id}`).replace('%s', value);
        return text;
      }
      return undefined;
    },
    // 温度设定
    temSetJson() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === `inertia-${this.temKey}`)
        .filter(module => !this.g_hideStateArr.some(state => state.includes(module.identifier)));
      // 如果存在检测字段，则使用（存在多个的情况时，只取第一个，其他不处理）
      if (modules.length) return modules[0].json;
      return undefined; // 默认字段
    },
    // 温度显示值
    temSetVal() {
      if (this.temSetJson) return this.g_inputMap[this.temSetJson];
      return '';
    },
    // 温度最小值设定
    temMinVal() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === `inertia-${this.temMinKey}`)
        .filter(module => !this.g_hideStateArr.some(state => state.includes(module.identifier)));
      // 如果存在检测字段，则使用（存在多个的情况时，只取第一个，其他不处理）
      if (modules.length) return this.g_inputMap[modules[0].json];
      return 16; // 默认温度最小值
    },
    // 温度最大值设定
    temMaxVal() {
      const modules = this.g_funcDefine_inertia
        .filter(module => module.type === `inertia-${this.temMaxKey}`)
        .filter(module => !this.g_hideStateArr.some(state => state.includes(module.identifier)));
      if (modules.length) return this.g_inputMap[modules[0].json];
      return 30; // 默认温度最大值
    },
    // 室温显示
    roomTemShow() {
      return this.g_identifierArr.includes('TemSen') && !this.g_hideStateArr.includes('TemSen_default') && this.TemSen;
    }
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
        const fanStateName = this.getStateNameByKey(this.fanKey);
        if (fanStateName) {
          this.fanName = this.$language(`fan.${fanStateName}`);
        }
        const modStateName = this.modDefine ? this.getStateNameByKey(this.modDefine.identifier) : '';
        if (modStateName) {
          this.modName = this.$language(`mod.${modStateName}`);
        }
      },
      immediate: true,
      deep: true
    },
    // SetTem: {
    //   handler(newVal, oldVal) {
    //     if (oldVal === undefined) return;
    //     this.temChange = true;
    //     $('#slider').roundSlider({ value: newVal });
    //   },
    //   immediate: true
    // },
    temSetVal: {
      handler(newVal) {
        this.temChange = true;
        this.throttle(newVal, 'value');
      },
      immediate: true
    },
    temSetJson: {
      handler(newVal) {
        this.temChange = true;
        const value = this.g_inputMap[newVal];
        this.throttle(value, 'value');
      },
      immediate: true
    },
    temMinVal: {
      handler(newVal) {
        this.throttle(newVal, 'min');
      },
      immediate: true
    },
    temMaxVal: {
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
      value === this.temSetVal || this.changeData({ [this.temSetJson]: value });
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
