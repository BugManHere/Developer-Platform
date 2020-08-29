<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-timer">
      <gree-header>{{ $language('page.timer.name') }}
        <a 
          class="done" 
          @touchend="settingDone"
          slot="right" >
          {{ $language('page.timer.done') }}
        </a>
      </gree-header>
      <gree-picker
        ref="date-picker"
        :data="pickerData"
        :cols="2"
        :line-height="65"
        :default-index="pickerDefaultIndex"
        is-view
        is-cascade
        keep-index
        @change="getPickerValue"
      />
      <div class="timer-switch">
        <span v-text="$language('page.timer.switch.title')" class="switch-text"/>
        <span v-text="$language('page.timer.switch.btn')" class="switch-btn" />
      </div>
      <gree-button v-text="$language('page.timer.del')" class="timer-del" @click="timerDel"/>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Picker, Button, Toast } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    [Header.name]: Header,
    [Picker.name]: Picker,
    [Button.name]: Button,
    [Toast.name]: Toast,
  },
  data() {
    const Data = Array.from({length: 13}, (i, index) => {
      const result = { text: `${index < 10 ? `0${index}` : index}`, value: index };
      result.children = Array.from({length: index === 12 ? 1 : 60}, (v, cIndex) => {
        return { text: `${cIndex < 10 ? `0${cIndex}` : cIndex}`, value: cIndex };
      });
      return result;
    });
    return {
      pickerData: [Data],
      pickerDefaultIndex: [0, 0],
      value: {
        TmrHour: 0,
        TmrMin: 0,
      },
    };
  },
  computed: {
    ...mapState({
      TmrOn: state => state.dataObject.TmrOn,
      TmrHour: state => state.dataObject.TmrHour,
      TmrMin: state => state.dataObject.TmrMin,
    }),
  },
  mounted() {
    this.value = {
      TmrHour: this.TmrHour,
      TmrMin: this.TmrMin
    };
    this.pickerDefaultIndex = [
      this.TmrHour, this.TmrMin
    ];
    this.$refs['date-picker'].refresh();
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
    changeData(val) {
      this.setState(['watchLock', false]);
      this.setState(['ableSend', true]);
      this.setDataObject(val);
      this.sendCtrl(val);
    },
    getPickerValue(columnIndex, itemIndex, value) {
      if (columnIndex) {
        this.value.TmrMin = value.value;
      } else {
        this.value.TmrHour = value.value;
        value.value === 12 && (this.value.TmrMin = 0);
      }
    },
    settingDone() {
      if (!this.value.TmrHour && !this.value.TmrMin) {
        Toast({
          content: this.$language('page.timer.tip'),
          position: 'bottom',
          hasMask: false,
        });
      } else {
        this.changeData({
          TmrOn: 1,
          TmrHour: this.value.TmrHour || 0,
          TmrMin: this.value.TmrMin || 0
        });
        this.$router.push({
          name: 'Home',
        }).catch(err => { console.log(err); });
      }
    },
    timerDel() {
      this.changeData({
        TmrOn: 0,
        TmrHour: 0,
        TmrMin: 0
      });
      this.$router.push({
        name: 'Home',
      }).catch(err => { console.log(err); });  
    }
  },
};
</script>

<style lang="scss">
.page-timer {
  position: relative;
  height: 100%;
  .done {
    font-size: 48px;
    line-height: 48px;
    font-weight: 500;
  }
  .gree-picker {
    border-bottom: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    .gree-picker-column-list {
      .gree-picker-column-item {
        color: #fd9530 !important;
        font-size: 50px;
        &:nth-of-type(1)::after {
          content: '时';
          position: absolute;
          top: 49%;
          right: 100px;
        }
        &:nth-of-type(2)::after {
          content: '分钟后';
          position: absolute;
          top: 49%;
          right: 0;
        }
      }
    }
    .column-item {
      font-size: 120px !important;
      &.active {
        color: #fd9530 !important;
      }
    }
  }
  .timer-switch {
    width: 100%;
    height: 160px;
    margin-top: 100px;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5;
    border-top: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .switch-text {
      margin-left: 60px;
      font-size: 55px;
      color: #404657;
    }
    .switch-btn {
      text-align: center;
      width: 110px;
      height: 110px;
      line-height: 110px;
      border-radius: 20px;
      background: #fd9530;
      color: #fff;
      margin-right: 60px;
      font-size: 55px;
    }
  }
  .timer-del {
    position: absolute;
    bottom: 0px;
    &.gree-button:after {
      // border-bottom: 1px solid #e5e5e5;
      // border-top: 1px solid #e5e5e5;
      border-left: none;
      border-right: none;
    }
  }
}
</style>
