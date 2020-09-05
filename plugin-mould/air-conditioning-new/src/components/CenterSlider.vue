<template>
  <div class="center-slider">
    <div v-show="Pow" class="slider-main">
      <div id="slider" :style="`opacity: ${Mod ? 1 : 0.01}`" />
      <div class="layer" :style="{ width: lottieRadius / 1.5 + 'px', height: lottieRadius / 1.5 + 'px' }">
        <div class="rotate -one"></div>
        <div class="rotate -two"></div>
      </div>
      <article>
        <gree-block>
          <div class="left">
            <span v-text="modName" />
          </div>
          <div class="bar" />
          <div class="right">
            <span v-text="fanName" />
          </div>
        </gree-block>
        <h3 v-if="Mod" class="tem" v-text="SetTem" />
        <h3 v-else class="auto-span" v-text="'自动调温'" />
        <div v-if="roomTemShow" class="room-tem" v-text="`室温 ${TemSen}℃`" />
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
      fanName: '',
      modName: ''
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
      radius: this.svgRadius / 2 + 6,
      width: 2,
      handleSize: '+35',
      keyboardAction: false,
      startAngle: -90,
      endAngle: '+360',
      sliderType: 'min-range',
      circleShape: 'full',
      handleShape: 'dot',
      start: () => {
        $('span.rs-block').css('padding', '4px');
      },
      stop: () => {
        $('span.rs-block').css('padding', '2px');
      },
      drag: e => {
        this.circleVal = Math.round(e.value);
      },
      beforeValueChange: e => {
        if (Math.abs(e.preValue - e.value) >= e.options.step * 30) return false;
      },
      change: e => {
        this.circleVal = Math.round(e.value);
        this.changeData({ SetTem: this.circleVal });
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
        const modStateName = this.getStateNameByKey(this.modKey);
        if (modStateName) {
          this.modName = this.$language(`mod.${modStateName}`);
        }
      },
      immediate: true,
      deep: true
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
    }
  }
};
</script>
