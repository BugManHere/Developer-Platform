<template>
  <!-- 扫风页 -->
  <gree-view bg-color="#F4F4F4">
    <gree-page class="page-sweep">
      <gree-header>
        {{ $language(`sweep.${['speedTitle', 'advance_leftright', 'advance_updown'][touchId]}`) }}
        <i class="iconfont iconfont-fanhui" slot="overwrite-left" @click="turnBack" />
      </gree-header>
      <div class="sweep-body">
        <gree-sweep-select
          :canvas-id="canvasId1"
          :canvas-width="width1"
          :canvas-height="height1"
          :origin="origin1"
          :select-default="selectDefault"
          @change="sweepLrChangeHandler"
          v-if="touchId === 1"
        ></gree-sweep-select>
        <gree-sweep-select
          :canvas-id="canvasId2"
          :canvas-width="width2"
          :canvas-height="height2"
          :origin="origin2"
          :select-default="selectDefault"
          @change="sweepUdChangeHandler"
          v-if="touchId === 2"
        >
        </gree-sweep-select>
        <div class="sweep-body-img-horizontal" v-if="touchId === 1">
          <img src="../../assets/img/functionBtn/sweep/ac_horizontal.png" />
        </div>
        <div class="sweep-body-img-vertical" v-if="touchId === 2">
          <img src="../../assets/img/functionBtn/sweep/ac_vertical.png" />
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, SweepSelect, Toast } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { showToast, hideLoading } from '@PluginInterface';

export default {
  components: {
    [Header.name]: Header,
    [SweepSelect.name]: SweepSelect
  },
  data() {
    return {
      canvasId1: 'sector1',
      arr1: [],
      width1: Math.floor(window['lib'].flexible.rem / 0.1),
      height1: Math.floor(window['lib'].flexible.rem / 0.15561),
      origin1: {
        x: Math.floor(window['lib'].flexible.rem / 0.2),
        y: 0,
        r: Math.floor(window['lib'].flexible.rem / 0.15561),
        startdeg: 135,
        opendeg: 18,
        count: 5
      },
      selectDefault: ['3'],

      canvasId2: 'sector2',
      arr2: [],
      width2: Math.floor(window['lib'].flexible.rem / 0.15517),
      height2: Math.floor(window['lib'].flexible.rem / 0.09199),
      origin2: {
        x: Math.floor(window['lib'].flexible.rem / 0.15517),
        y: Math.floor(window['lib'].flexible.rem / 0.18),
        r: Math.floor(window['lib'].flexible.rem / 0.15517),
        startdeg: 226,
        opendeg: 18,
        count: 5
      },
      touchId: 1 // 1：左右扫风 2：上下扫风
    };
  },
  computed: {
    ...mapState({
      SwingLfRig: state => state.dataObject.SwingLfRig,
      SwUpDn: state => state.dataObject.SwUpDn,
      Pow: state => state.dataObject.Pow,
      selectSwingLfRig: state => {
        const swingLfRig = state.dataObject.SwingLfRig;
        const swingLfRigMap = [[], [], ['1'], ['2'], ['3'], ['4'], ['5']];
        return swingLfRigMap[swingLfRig];
      },
      selectSwUpDn: state => {
        const swUpDn = state.dataObject.SwUpDn;
        const swUpDnMap = [[], [], ['1'], ['2'], ['3'], ['4'], ['5']];
        return swUpDnMap[swUpDn];
      }
    }),
    routeName() {
      return this.$route.name;
    }
  },
  watch: {
    Pow(newVal) {
      if (newVal === 0 && this.routeName === 'Sweep') {
        try {
          showToast(this.$language('sweep.sweep_powoff_tips'), 1);
        } catch (err) {
          Toast.info(`${this.$language('sweep.sweep_powoff_tips')}`);
        }
        this.turnBack();
      }
    },
    selectSwUpDn(newVal) {
      const touchId = this.$route.params.id;
      if (touchId === 2) {
        this.selectDefault = newVal;
        this.touchId = 0;
        this.$nextTick(() => (this.touchId = touchId));
      }
    },
    selectSwingLfRig(newVal) {
      const touchId = this.$route.params.id;
      if (touchId === 1) {
        this.selectDefault = newVal;
        this.touchId = 0;
        this.$nextTick(() => (this.touchId = touchId));
      }
    }
  },
  created() {
    this.touchId = this.$route.params.id;
    const docWidth = window.screen.width;
    const docHeight = window.screen.height;
    this.canvasWidth = docWidth;
    this.canvasHeight = docHeight;
    if (this.touchId === 1) {
      this.selectDefault = this.selectSwingLfRig;
    } else if (this.touchId === 2) this.selectDefault = this.selectSwUpDn;
  },
  mounted() {
    hideLoading();
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    turnBack() {
      this.$router.push({ name: 'Home' }).catch(err => {
        err;
      });
    },
    sweepLrChangeHandler(val) {
      const val2 = [];
      val.forEach(item => {
        val2.indexOf(item) === -1 ? val2.push(item) : '';
      });
      if (val2) {
        if (val2.length === 1) {
          this._setSweep({ SwingLfRig: Number(val2[0]) + 1, SmartWind: 0 });
        } else {
          // 刷新扇叶
          this.selectDefault = this.selectSwingLfRig;
          this.touchId = 0;
          this.$nextTick(() => (this.touchId = 1));
          try {
            val2.length && showToast(this.$language('sweep.sweep_lr_tips'), 0);
          } catch (err) {
            val2.length && Toast.info(`${this.$language('sweep.sweep_lr_tips')}`);
          }
        }
      }
    },
    sweepUdChangeHandler(val) {
      const val2 = [];
      val.forEach(item => {
        val2.indexOf(item) === -1 ? val2.push(item) : '';
      });
      if (val2) {
        if (val2.length === 1) {
          this._setSweep({ SwUpDn: Number(val2[0]) + 1, SmartWind: 0 });
        } else {
          // 刷新扇叶
          this.selectDefault = this.selectSwUpDn;
          this.touchId = 0;
          this.$nextTick(() => (this.touchId = 2));
          try {
            val2.length && showToast(this.$language('sweep.sweep_ud_tips2'), 0);
          } catch (err) {
            val2.length && Toast.info(`${this.$language('sweep.sweep_ud_tips2')}`);
          }
        }
      }
    },
    _setSweep(data) {
      if (!data) {
        return;
      }
      const storage = window.storage;
      const funcData = storage.get('funcData') || {};
      if (typeof data.SwingLfRig !== 'undefined' && this.SwingLfRig !== data.SwingLfRig) {
        this.setState({ ableSend: true });
        this.setDataObject({ ...data, SmartWind: 0 });
        this.sendCtrl({ ...data, SmartWind: 0 });
        funcData.ConstLR = data.SwingLfRig;
        storage.set('funcData', funcData);
      }

      if (typeof data.SwUpDn !== 'undefined' && this.SwUpDn !== data.SwUpDn) {
        this.setState({ ableSend: true });
        this.setDataObject({ ...data, SmartWind: 0, AntiDirectBlow: 0 });
        this.sendCtrl({ ...data, SmartWind: 0, AntiDirectBlow: 0 });
        funcData.ConstUD = data.SwUpDn;
        storage.set('funcData', funcData);
      }
    }
  }
};
</script>

<style lang="scss">
.page-sweep {
  .sweep-body {
    margin-top: 120px;
    position: relative;
    height: 80%;
    display: flex;
    align-items: center;
    &-img-vertical {
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      img {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        height: 996px;
      }
    }
    &-img-horizontal {
      position: absolute;
      width: 100%;
      top: 0;
      img {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        height: 280px;
        width: 750px;
      }
    }
  }
  canvas {
    position: relative;
    opacity: 0 !important;
  }
  .sweep-select-horizontal {
    margin: 0 auto;
    width: 1080px;
    height: 686px;
    background-image: url('../../assets/img/functionBtn/sweep/sweep_horizontal.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    .selected {
      position: absolute;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      pointer-events: none;

      &-1 {
        top: 14px;
        left: 40px;
        width: 484px;
        height: 611px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_horizontal_1.png');
        background-size: 96%;
      }

      &-2 {
        top: 32px;
        left: 217px;
        width: 310px;
        height: 648px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_horizontal_2.png');
      }

      &-3 {
        top: 35px;
        left: 421px;
        width: 219px;
        height: 653px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_horizontal_3.png');
      }

      &-4 {
        top: 38px;
        left: 540px;
        width: 306px;
        height: 641px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_horizontal_4.png');
      }

      &-5 {
        top: 32px;
        left: 554px;
        width: 476px;
        height: 579px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_horizontal_5.png');
      }
    }
  }

  .sweep-select-vertical {
    position: relative;
    left: -100px;
    margin: 0 auto;
    width: 696px;
    height: 1174px;
    background-image: url('../../assets/img/functionBtn/sweep/sweep_vertical.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;

    .selected {
      position: absolute;
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: center;
      pointer-events: none;

      &-1 {
        top: 93px;
        left: 78px;
        width: 579px;
        height: 465px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_vertical_1.png');
      }

      &-2 {
        top: 263px;
        left: 10px;
        width: 634px;
        height: 311px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_vertical_2.png');
      }

      &-3 {
        top: 473px;
        left: 0;
        width: 632px;
        height: 217px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_vertical_3.png');
      }

      &-4 {
        top: 592px;
        left: 10px;
        width: 625px;
        height: 305px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_vertical_4.png');
      }

      &-5 {
        top: 608px;
        left: 78px;
        width: 576px;
        height: 473px;
        background-image: url('../../assets/img/functionBtn/sweep/sweep_vertical_5.png');
      }
    }
  }
}
</style>
