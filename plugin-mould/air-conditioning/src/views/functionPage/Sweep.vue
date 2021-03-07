<template>
  <!-- 扫风页 -->
  <gree-view :bg-color="`#404040`">
    <gree-page class="page-sweep">
      <gree-header>{{ $language(`sweep.${['speedTitle', 'advance_leftright', 'advance_updown'][touchId]}`) }}</gree-header>
<<<<<<< HEAD
      <gree-sweep-select
        canvas-id="sweep-lr"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
        :origin="originLr"
        :select-default="selectSwingLfRig"
        @change="sweepLrChangeHandler"
        v-if="touchId === 1"
      ></gree-sweep-select>
      <gree-sweep-select
        canvas-id="sweep-ud"
        :canvas-width="canvasWidth"
        :canvas-height="canvasHeight"
        :origin="originUd"
        :select-default="selectSwUpDn"
        @change="sweepUdChangeHandler"
        v-else-if="touchId === 2"
      ></gree-sweep-select>
      <div class="point-text">
        <p>{{ $language('sweep.Stage_tips') }}</p>
        <p v-html="$language('sweep.sweep_txt2')"></p>
=======
      <div v-if="oppositeType.show" class="opposite" @touchend.prevent="clickOpposite" :class="oppositeType.type">
        <span v-html="oppositeType.text" />
        <!-- <img :src="oppositeType.img" v-if="oppositeType.show" /> -->
      </div>
      <div class="sweep-body">
        <gree-sweep-select
          canvas-id="sweep-lr"
          :canvas-width="canvasWidth"
          :canvas-height="canvasHeight"
          :origin="originLr"
          :select-default="selectSwingLfRig"
          @change="sweepLrChangeHandler"
          v-if="touchId === 1"
        >
        </gree-sweep-select>
        <gree-sweep-select
          canvas-id="sweep-ud"
          :canvas-width="canvasWidth"
          :canvas-height="canvasHeight"
          :origin="originUd"
          :select-default="selectSwUpDn"
          @change="sweepUdChangeHandler"
          v-else-if="touchId === 2"
        ></gree-sweep-select>
        <div class="point-text">
          <p>{{ $language('sweep.Stage_tips') }}</p>
          <p v-html="$language('sweep.sweep_txt2')"></p>
        </div>
>>>>>>> 5a44fac... feat(all):  零零散散的更新
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
<<<<<<< HEAD
=======
    },
    oppositeType() {
      return {
        text: this.$language('sweep.opposite'),
        type: this.SwingLfRig === 8 ? 'on' : 'off',
        show: this.touchId === 1
      };
>>>>>>> 5a44fac... feat(all):  零零散散的更新
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
        this.setState(['ableSend', true]);
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
        this.setState(['ableSend', true]);
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
    }
  }
};
</script>
<<<<<<< HEAD
=======

<style lang="scss" scoped>
.sweep-body {
  height: 100%;
  width: 100%;
}
.opposite {
  position: absolute;
  height: 156px;
  width: 156px;
  top: 200px;
  right: 100px;
  z-index: 999;
  border-radius: 50%;
  border: 1px solid #bbb;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #404657;
  &.on {
    background-color: rgb(35, 151, 243);
    color: #fff;
  }
}
</style>
>>>>>>> 5a44fac... feat(all):  零零散散的更新
