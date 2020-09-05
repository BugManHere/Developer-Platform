<template>
  <!-- 扫风页 -->
  <gree-view :bg-color="`#404040`">
    <gree-page class="page-sweep">
      <gree-header>{{ $language(`sweep.${['speedTitle', 'advance_leftright', 'advance_updown'][touchId]}`) }}</gree-header>
      <div class="sweep-main" :class="{ spin: touchId === 1 }">
        <div class="sweep-body">
          <img src="@assets/img/functionBtn/sweep/bg.png" />
        </div>
        <div class="ac">
          <img src="@assets/img/functionBtn/sweep/ac.png" />
        </div>
        <div class="blades-body">
          <div class="blade" v-for="(blade, index) in blades" :key="index" :style="`top: ${blade.y}px; left: ${blade.x}px; transform: rotate(${blade.rotate})`">
            <img :src="blade.img" :style="`height: ${blade.height}`" v-show="imshowArr.includes(`${index + 1}`)" />
          </div>
        </div>
      </div>
      <gree-sweep-select
        canvas-id="sweep-lr"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
        :origin="originLr"
        :select-default="selectSwingLfRig"
        :color-secter="{ bgColor: 'transparent', borderColor: 'transparent' }"
        @change="sweepLrChangeHandler"
        @move="setImshow"
        v-if="touchId === 1"
      ></gree-sweep-select>
      <gree-sweep-select
        canvas-id="sweep-ud"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
        :origin="originUd"
        :select-default="selectSwUpDn"
        :color-secter="{ bgColor: 'transparent', borderColor: 'transparent' }"
        @change="sweepUdChangeHandler"
        @move="setImshow"
        v-else-if="touchId === 2"
      ></gree-sweep-select>
      <!-- <div class="point-text">
        <p>{{ $language('sweep.Stage_tips') }}</p>
        <p v-html="$language('sweep.sweep_txt2')"></p>
      </div> -->
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
      imshowArr: [],
      canvasWidth: 0,
      canvasHeight: 0,
      originLr: {
        x: 0, // 扇形原点x坐标
        y: 0, // 扇形原点y坐标
        r: 100, // 半径
        startdeg: 135, // 起始度数0～360
        opendeg: 18, // 扇形开合度数
        count: 5 // 扇形数量
      },
      originUd: {
        x: 0, // 扇形原点x坐标
        y: 0, // 扇形原点y坐标
        r: 100, // 半径
        startdeg: 225, // 起始度数0～360
        opendeg: 18, // 扇形开合度数
        count: 5 // 扇形数量
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
        const swingLfRigMap = [[], ['1', '2', '3', '4', '5'], ['1'], ['2'], ['3'], ['4'], ['5']];
        return swingLfRigMap[swingLfRig];
      },
      selectSwUpDn: state => {
        const swUpDn = state.dataObject.SwUpDn;
        const swUpDnMap = [[], ['1', '2', '3', '4', '5'], ['1'], ['2'], ['3'], ['4'], ['5']];
        return swUpDnMap[swUpDn];
      }
    }),
    routeName() {
      return this.$route.name;
    },
    blades() {
      const trans = val => {
        return (val * this.canvasWidth) / 375;
      };
      const bladesHeight = `${trans(72)}px`;
      return [
        {
          img: require('@assets/img/functionBtn/sweep/sweep_3.png'),
          x: trans(-3),
          y: trans(53),
          height: bladesHeight,
          rotate: '36deg'
        },
        {
          img: require('@assets/img/functionBtn/sweep/sweep_3.png'),
          x: trans(-20),
          y: trans(87),
          height: bladesHeight,
          rotate: '18deg'
        },
        {
          img: require('@assets/img/functionBtn/sweep/sweep_3.png'),
          x: trans(-24),
          y: trans(124),
          height: bladesHeight,
          rotate: '0'
        },
        {
          img: require('@assets/img/functionBtn/sweep/sweep_3.png'),
          x: trans(-18),
          y: trans(160),
          height: bladesHeight,
          rotate: '-18deg'
        },
        {
          img: require('@assets/img/functionBtn/sweep/sweep_3.png'),
          x: trans(0),
          y: trans(192),
          height: bladesHeight,
          rotate: '-36deg'
        }
      ];
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
    }
  },
  created() {
    this.touchId = this.$route.params.id;
    const docWidth = window.screen.width;
    const docHeight = window.screen.height;
    const rem = docWidth / 10;
    this.canvasWidth = docWidth;
    this.canvasHeight = docHeight;

    if (this.touchId === 1) {
      this.originLr.r = 6 * rem;
      this.originLr.x = this.canvasWidth / 2;
      this.originLr.y = 3.5 * rem;
    }
    if (this.touchId === 2) {
      this.originUd.r = 6 * rem;
      this.originUd.x = 8 * rem;
      this.originUd.y = 6.5 * rem;
    } else {
      this.touchId = 1;
      this.originUd.r = 6 * rem;
      this.originUd.x = 8 * rem;
      this.originUd.y = 6.5 * rem;
    }
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
      this.imshowArr = val;
      const val2 = [];
      val.forEach(item => {
        val2.indexOf(item) === -1 ? val2.push(item) : '';
      });
      if (val2) {
        if (val2.length === 0) {
          this._setSweep({ SwingLfRig: 0 });
        } else if (val2.length === 1) {
          this._setSweep({ SwingLfRig: Number(val2[0]) + 1, SmartWind: 0 });
        } else if (val2.length === 5) {
          this._setSweep({ SwingLfRig: 1, SmartWind: 0 });
        } else {
          try {
            showToast(this.$language('sweep.sweep_lr_tips'), 0);
          } catch (err) {
            Toast.info(`${this.$language('sweep.sweep_lr_tips')}`);
          }
        }
      }
    },
    sweepUdChangeHandler(val) {
      this.imshowArr = val;
      const val2 = [];
      val.forEach(item => {
        val2.indexOf(item) === -1 ? val2.push(item) : '';
      });
      if (val2) {
        if (val2.length === 0) {
          this._setSweep({ SwUpDn: 0 });
        } else if (val2.length === 1) {
          this._setSweep({ SwUpDn: Number(val2[0]) + 1, SmartWind: 0 });
        } else if (val2.length === 5) {
          this._setSweep({ SwUpDn: 1, SmartWind: 0 });
        } else {
          try {
            showToast(this.$language('sweep.sweep_ud_tips2'), 0);
          } catch (err) {
            Toast.info(`${this.$language('sweep.sweep_ud_tips2')}`);
          }
        }
      }
    },
    _setSweep(data) {
      if (!data) {
        return;
      }
      if (typeof data.SwingLfRig !== 'undefined' && this.SwingLfRig !== data.SwingLfRig) {
        this.setState({ ableSend: true });
        this.setDataObject({ ...data, SmartWind: 0 });
        this.sendCtrl({ ...data, SmartWind: 0 });
        if (data.SwingLfRig === 0) {
          try {
            showToast(this.$language('sweep.sweep_lr_turnoff_tips'), 0);
          } catch (err) {
            Toast.info(`${this.$language('sweep.sweep_lr_turnoff_tips')}`);
          }
        }
      }

      if (typeof data.SwUpDn !== 'undefined' && this.SwUpDn !== data.SwUpDn) {
        this.setState({ ableSend: true });
        this.setDataObject({ ...data, SmartWind: 0, AntiDirectBlow: 0 });
        this.sendCtrl({ ...data, SmartWind: 0, AntiDirectBlow: 0 });
        if (data.SwUpDn === 0) {
          showToast(this.$language('sweep.sweep_ud_turnoff_tips'), 0);
          try {
            showToast(this.$language('sweep.sweep_ud_turnoff_tips'), 0);
          } catch (err) {
            Toast.info(`${this.$language('sweep.sweep_ud_turnoff_tips')}`);
          }
        }
      }
    },
    setImshow(val) {
      this.imshowArr = val;
    }
  }
};
</script>

<style lang="scss">
.page-sweep {
  .sweep-main {
    position: relative;
    margin-top: 94px;
    width: 100%;
    height: 1285px;
    display: flex;
    align-items: center;
    .sweep-body {
      margin-left: 210px;
      img {
        width: 644px;
      }
    }
    .ac {
      position: absolute;
      right: 0;
    }
    .blades-body {
      position: absolute;
      margin-top: 180px;
      top: 0;
      left: 280px;
      height: 100%;
      width: 100%;
      .blade {
        position: absolute;
      }
    }
    &.spin {
      transform: rotate(270deg);
    }
  }
}
#sweep-ud,
#sweep-lr {
  margin-top: 153px;
  position: absolute;
  left: 0;
  top: 0;
  * {
    background-color: transparent !important;
  }
}
#sweep-lr {
  top: 10px;
}
</style>
