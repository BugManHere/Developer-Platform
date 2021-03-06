<template>
  <gree-popup v-model="isShow" position="bottom">
    <div class="timer-picker-popup">
      <!-- 标题 -->
      <div class="timer-picker-popup-title" v-text="getTargetTime()" />
      <!-- 选择器 -->
      <gree-picker ref="timer-picker" :data="timerPickerData" :cols="3" :line-height="36" :default-index="pickerDefaultIndex" is-view />
      <!-- 底部 -->
      <div class="timer-picker-popup-footer">
        <!-- 小标题 -->
        <span class="timer-picker-popup-footer-title" v-html="`重复 &nbsp;&nbsp;&nbsp; ${weekLoopText}`" />
        <!-- 日期按钮组 -->
        <div class="timer-picker-popup-footer-week">
          <!-- 按钮 -->
          <div
            class="timer-picker-popup-footer-week-btn"
            :class="{ select: week.select }"
            v-for="(week, weekIndex) in weekList"
            :key="weekIndex"
            v-text="week.text"
            @click="clickWeekBtn(weekIndex)"
          />
        </div>
        <!-- 确认框 -->
        <div class="timer-picker-popup-footer-box">
          <!-- 取消 -->
          <div class="timer-picker-popup-footer-box-cancel" v-text="'取消'" @click="hidePopup" />
          <!-- 确定 -->
          <div class="timer-picker-popup-footer-box-confirm" v-text="'确定'" @click="confirmSet" />
        </div>
      </div>
    </div>
  </gree-popup>
</template>

<script>
import { Popup, Picker } from 'gree-ui';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'timer-picker-popup',
  components: {
    [Popup.name]: Popup,
    [Picker.name]: Picker
  },
  props: {
    timerTaskTime: {
      type: Object,
      default: () => {
        return {};
      }
    },
    timerTaskWeeks: {
      type: Array,
      default: () => {
        return [];
      }
    },
    timerID: {
      type: Number,
      default: 0
    }
  },
  data() {
    const createSwiperList = num => {
      return Array.from({ length: num }, (v, i) => {
        return { text: String(i), value: i };
      });
    };
    const hourList = createSwiperList(24);
    const minusList = createSwiperList(60);
    const weekList = ['一', '二', '三', '四', '五', '六', '日'].map((value, index) => {
      return { text: `周${value}`, index: String(index + 1), select: false };
    });
    const typeList = [
      {
        text: '开机',
        value: 0
      },
      {
        text: '关机',
        value: 1
      }
    ];
    const timerPickerData = [hourList, minusList, typeList];
    return {
      isShow: false,
      timerPickerData,
      weekList,
      pickerDefaultIndex: [2, 2, 0],
      selectData: {
        hour: 0,
        minus: 0,
        type: 1
      }
    };
  },
  computed: {
    ...mapState('control', {
      timerPicker: state => state.popup.timerPicker
    }),
    weekLoopText() {
      let result = '';
      let loop = false;
      let allSelect = true;
      this.weekList.forEach(week => {
        allSelect = allSelect && week.select;
        loop = loop || week.select;
        week.select && (result += `${week.text}&nbsp;&nbsp;`);
      });
      allSelect && (result = '每天');
      loop || (result = '仅一次');
      return result;
    }
  },
  watch: {
    timerPicker: {
      handler(newVal) {
        this.isShow = newVal;
      },
      immediate: true
    },
    isShow(newVal) {
      if (newVal) {
        this.getSelectData();
        setTimeout(() => {
          this.$refs['timer-picker'].refresh();
        }, 10);
      } else {
        this.SetPopup({ timerPicker: false });
      }
    }
  },
  methods: {
    ...mapMutations('control', {
      SetPopup: 'SET_POPUP'
    }),
    getSelectData() {
      // 如果有传值，使用传过来的值
      if ('type' in this.timerTaskTime) {
        this.selectData = { ...this.timerTaskTime };
      } else {
        const now = new Date();
        this.selectData = {
          hour: now.getHours(),
          minus: now.getMinutes(),
          type: 0
        };
      }

      this.weekList.forEach(week => {
        week.select = this.timerTaskWeeks.includes(week.index);
      });
      this.pickerDefaultIndex = [this.selectData.hour, this.selectData.minus, this.selectData.type];
    },
    // 获取定时执行时间
    getTargetTime() {
      const dayText = '';
      return dayText;
    },
    clickWeekBtn(weekIndex) {
      this.weekList[weekIndex].select = !this.weekList[weekIndex].select;
    },
    hidePopup() {
      this.SetPopup({ timerPicker: false });
    },
    confirmSet() {
      this.$emit('timer-picker-data', [this.$refs['timer-picker'].getColumnValues(), this.weekList, this.timerID]);
      this.hidePopup();
    }
  }
};
</script>

<style lang="scss">
.timer-picker-popup {
  width: 100%;
  background-color: #fff;
  &-title {
    height: 156px;
    line-height: 156px;
    width: 100%;
    text-align: center;
    font-size: 52px;
  }
  &-footer {
    height: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    border-top: 1px solid #f0f0f0;
    margin-top: 120px;
    &-title {
      font-size: 36px;
      padding: 48px 0 0 64px;
      color: #404657;
      &.select {
        background-color: #619ce7;
        color: #619ce7;
      }
    }
    &-week {
      $roundWidth: 120px;
      $padding: 52px;
      width: calc(100vw - #{$padding} * 2);
      height: auto;
      margin-top: 48px;
      padding: 0 $padding;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      &-btn {
        transform: scale(1);
        height: $roundWidth;
        width: $roundWidth;
        line-height: $roundWidth;
        border-radius: 50%;
        text-align: center;
        color: rgb(140, 144, 154);
        border: 1px solid rgba(140, 144, 154, 0.15);
        &.select {
          background-color: #619ce7;
          color: #fff;
        }
      }
    }
    &-box {
      $confirmHeight: 180px;
      height: $confirmHeight;
      width: 100%;
      margin-top: 48px;
      border-top: 1px solid #f0f0f0;
      color: #71acf1;
      font-size: 44px;
      display: flex;
      justify-content: space-between;
      &-cancel {
        color: #404657;
        border-right: 1px solid #f0f0f0;
      }
      &-confirm {
        color: #619ce7;
      }
      div {
        width: 50%;
        height: 100%;
        text-align: center;
        line-height: $confirmHeight;
      }
    }
  }
}
</style>
