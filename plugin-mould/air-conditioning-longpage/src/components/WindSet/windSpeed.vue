<template>
  <!-- 风速设置 -->
  <div class="wind-speed-set wind-box">
    <!-- 标题 -->
    <div class="wind-box-header">
      <!-- 标题图标 -->
      <div class="wind-box-header-icon iconfont iconfont-fengsu" />
      <!-- 标题文本 -->
      <span class="wind-box-header-text" v-text="'风速'" />
    </div>
    <!-- 内容 -->
    <div class="wind-speed-set-content">
      <!-- 特殊风速调节 -->
      <div class="wind-special-set-content" v-if="specialFanData.length">
        <div
          class="wind-special-set-content-box"
          v-for="(spFan, spFanIndex) in specialFanData"
          :key="spFanIndex"
          :class="{ select: spFan.statusName === fanCurrentStatusName, gray: fanHideStatusNameList.includes(spFan.statusName) }"
          @click="fanHandler(spFan.statusName)"
        >
          <i class="iconfont" :class="`iconfont-${spFan.icon.key}`" />
          <span v-text="spFan.name" />
        </div>
      </div>
      <!-- 风速调节 -->
      <div class="wind-speed-set-content-slider" @touchstart="sliderDragStart" @touchmove="sliderDragging" @touchend="sliderDragEnd">
        <!-- 滑条 -->
        <div class="wind-speed-set-content-slider-content" :style="{ width: `${sliderProgress}%`, opacity: fanCurrentIndex === -1 && !isTouch ? 0.01 : 1 }">
          <!-- 滑条背景 -->
          <div class="wind-speed-set-content-slider-content-bar" ref="slider-bar" />
        </div>
        <!-- 滑块 -->
        <div class="wind-speed-set-content-slider-toucher" :style="{ width: `${sliderProgress}%`, opacity: fanCurrentIndex === -1 && !isTouch ? 0.01 : 1 }">
          <div ref="slider-block" class="wind-speed-set-content-slider-toucher-box">
            <i class="iconfont" :class="`iconfont-${fanCurrentInfo.icon && fanCurrentInfo.icon.key}`" />
          </div>
        </div>
        <!-- 背景 -->
        <div class="wind-speed-set-content-slider-bg">
          <div
            class="wind-speed-set-content-slider-bg-round"
            v-for="(fan, fanIndex) in fanData"
            :class="{ cover: fanDragIndex > fanIndex, gray: fanHideStatusNameList.includes(fan.statusName) }"
            :key="fanIndex"
            @click="fanHandler(fan.statusName)"
          >
            <i class="iconfont" :class="`iconfont-${fan.icon.key}`" />
          </div>
        </div>
      </div>
      <!-- 文本 -->
      <div class="wind-speed-set-content-text">
        <span v-text="fan.name" v-for="(fan, fanIndex) in fanData" :key="fanIndex" :class="{ gray: fanHideStatusNameList.includes(fan.statusName) }" />
      </div>
    </div>
  </div>
</template>

<script>
import { Row } from 'gree-ui';
import { mapGetters } from 'vuex';
import { glyphs } from '@assets/iconfont/iconfont.json';

export default {
  name: 'wind-speed',
  components: {
    [Row.name]: Row
  },
  data() {
    return {
      fanStatusNameList: [], // 风档的顺序
      specialFanStatusNameList: [], // 特殊风档的顺序
      sliderProgress: 60, // 滑条进度
      slderWidth: 0, // 滑动区域
      sliderBarWidth: 0, // 滑条宽度
      sliderToucherWidth: 0, // 滑块宽度
      sliderStart: 0, // 滑条开始滑动位置
      isTouch: false // 是否滑动中
    };
  },
  computed: {
    ...mapGetters('machine', ['hideStateNameArr']),
    ...mapGetters(['fanDefine', 'fanIdentifier', 'fanCurrentStatusName', 'fanAbleSet', 'fanLoop']),
    fanData() {
      const result = this.fanStatusNameList.map(fanStatusName => {
        // status定义
        const status = this.fanDefine.statusDefine[fanStatusName];
        // 名称
        const statusNameText = status.name;
        const stateNameText = this.$language(`fan.${this.fanIdentifier}_${statusNameText}`);
        // 图标
        const icon = glyphs.some(item => item.font_class === status.icon.key) ? status.icon : { key: 'undefined', type: 'off' };
        return { name: stateNameText, statusName: fanStatusName, icon };
      });
      return result;
    },
    specialFanData() {
      const result = this.specialFanStatusNameList.map(fanStatusName => {
        // status定义
        const status = this.fanDefine.statusDefine[fanStatusName];
        // 名称
        const statusNameText = status.name;
        const stateNameText = this.$language(`fan.${this.fanIdentifier}_${statusNameText}`);
        // 图标
        const icon = glyphs.some(item => item.font_class === status.icon.key) ? status.icon : { key: 'undefined', type: 'off' };
        return { name: stateNameText, statusName: fanStatusName, icon };
      });
      return result;
    },
    fanCurrentIndex() {
      return this.fanData.findIndex(fan => {
        return fan.statusName === this.fanCurrentStatusName;
      });
    },
    fanDragIndex() {
      // 减去圆所占进度
      const progress = this.fixProgress(this.sliderProgress, true);
      const { sliderStep } = this;
      // 获取正数
      const dec = progress % sliderStep;
      // 获取小数
      const int = Math.floor(progress / sliderStep);
      // 图标下标上限
      const len = this.fanData.legnth - 1;
      // 计算进度条对应的位置
      let index = int + (dec >= sliderStep / 2 ? 1 : 0);
      // 越界处理
      index = index < 0 ? 0 : index;
      index = index > len ? len : index;
      return index;
    },
    fanCurrentInfo() {
      if (!this.fanData || !this.fanData[this.fanDragIndex] || !this.fanData[this.fanDragIndex].icon) {
        return {};
      }
      return this.fanData[this.fanDragIndex];
    },
    sliderStep() {
      return Math.round(100 / (this.fanData.length - 1));
    },
    fanHideStatusNameList() {
      const { fanIdentifier } = this;
      const result = [];
      const reg = new RegExp(`^${fanIdentifier}_`);
      this.hideStateNameArr.forEach(stateName => {
        reg.test(stateName) && result.push(RegExp.rightContext);
      });
      return result;
    }
  },
  mounted() {
    this.init();
    this.getSliderWidth();
    this.getFanOrder();
  },
  watch: {
    fanAbleSet(newVal) {
      newVal || (this.showPopup = false);
    },
    fanLoop() {
      this.init();
    },
    fanCurrentStatusName() {
      this.init();
    },
    fanCurrentIndex: {
      handler(newVal) {
        this.setSliderPos(newVal);
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.updateFanLoop();
    },
    updateFanLoop() {
      const [specialFanStatusNameList, fanStatusNameList] = this.getFanOrder();
      this.fanStatusNameList = fanStatusNameList;
      this.specialFanStatusNameList = specialFanStatusNameList;
    },
    // 采用自底向上递归方法获取风档排列, 0: 普通风档, 1: 特殊风档
    getFanOrder() {
      const { map } = this.fanDefine;
      const filpMap = {}; // 映射对象
      const endPoints = []; // 指向'undefined'的状态为结束状态，作为递归的起始点

      // 填充映射对象
      for (const key in map) {
        if (Object.hasOwnProperty.call(map, key)) {
          // 获取映射关系
          filpMap[map[key]] = filpMap[map[key]] ? [...filpMap[map[key]], key] : [key];
          // 获取结束状态
          map[key] === 'undefined' && endPoints.push(key);
        }
      }

      // 根据结束状态获取完整状态排列
      const getList = (list, key) => {
        // 排列的起始点
        list.length || list.push(key);
        // 找到指向源并记录
        const points = filpMap[key];
        if (!points || !points.length) return list; // 如果没有指向源，退出
        let point = filpMap[key][0];
        if (point === 'undefined') return list; // 如果指向源为'undefined'状态，退出
        point && !list.includes(point) && list.push(point) && getList(list, point); // 递归表达式
        return list;
      };
      // 根据结束状态向上递归得出状态排列顺序，再反转
      const result = endPoints.map(startPoint => getList([], startPoint).reverse());
      // 包含'default'状态的排列在首位
      result.sort(points => {
        return points.includes('default') ? -1 : 1;
      });

      return result;
    },
    getSliderWidth() {
      try {
        // 屏幕宽度
        const width = document.body.clientWidth;
        // 记录滑条宽度
        this.sliderBarWidth = this.$refs['slider-bar'].clientWidth;
        // 记录滑块宽度
        this.sliderToucherWidth = this.$refs['slider-block'].clientWidth;
        // 记录滑动区域宽度 = 滑条宽度 - 滑块宽度
        this.slderWidth = this.sliderBarWidth - this.sliderToucherWidth;
        //  滑条开始滑动位置 = (屏幕宽度 - 滑动区域宽度) / 2  这里+1是因为大多数情况下需要向上取整
        this.sliderStart = (width - this.slderWidth) / 2 + 1;
      } catch (e) {
        e;
      }
    },
    // 开始拖动滑条
    sliderDragStart(e) {
      // 如果之前没有记录过宽度，则记录
      if (!this.sliderStart) {
        this.getSliderWidth();
      }
      this.sliderDragging(e);
      this.isTouch = true;
    },
    // 滑条拖动中
    sliderDragging(e) {
      const toucher = e.touches[0];
      // 获取手指在屏幕上的位置
      const { clientX } = toucher;
      // 将手指在屏幕上的位置转化为在滑条上的位置
      const dragX = clientX - this.sliderStart;
      // 增加圆所占进度
      const sliderProgress = this.fixProgress((dragX / this.slderWidth) * 100, false);
      // 越界处理
      this.sliderProgress = this.progressOutHandler(sliderProgress);
    },
    // 滑条拖动结束
    sliderDragEnd() {
      let index = this.fanDragIndex;
      // 设置滑块位置
      this.setSliderPos(index);
      // 获取对应model的statusName
      const { statusName } = this.fanData[index];
      // 给状态机处理
      this.fanHandler(statusName);
      this.isTouch = false;
    },
    // 进度条减去/增加圆环部分; hasRound: 是否包含圆环
    fixProgress(progress, hasRound = true) {
      // 计算圆/半圆所占的进度条
      const fix = (this.sliderToucherWidth / this.sliderBarWidth) * 100;
      // 如果进度条已经包括圆环
      if (hasRound) {
        // 减去圆环所占进度
        return ((progress - fix) / (100 - fix)) * 100;
      }
      // 如果不包括圆环，增加圆环所占进度
      return (progress / 100) * (100 - fix) + fix;
    },
    // 设置滑块位置
    setSliderPos(index) {
      const { sliderStep } = this;
      // 增加圆所占进度
      let val = this.fixProgress(index * sliderStep, false);
      // 越界处理
      this.sliderProgress = this.progressOutHandler(val);
    },
    // 越界处理
    progressOutHandler(progress) {
      let result = progress;
      result = result > 100 ? 100 : result;
      result = result < 0 ? 0 : result;
      return result;
    },
    // 滑条事件
    fanHandler(statusName) {
      this.fanHideStatusNameList.includes(statusName) || this.$stateMachine.toStatus(this.fanIdentifier, statusName);
      this.setSliderPos(this.fanCurrentIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
.wind-box-header {
  margin-bottom: 84px;
}
.wind-speed-set {
  padding: 0 52px;
  &-content {
    $contentWidth: 924px;
    position: relative;
    width: $contentWidth;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    &-slider {
      $sliderHeight: 100px;
      $sliderRadius: 48px;
      $roundHeight: 68px;
      $roundMargin: ($sliderHeight - $roundHeight) / 2;
      background-color: rgba(152, 152, 152, 0.1);
      position: relative;
      width: 100%;
      border-radius: $sliderRadius;
      margin-bottom: 36px;
      z-index: 1;
      &-content {
        position: absolute;
        min-width: $roundHeight + $roundMargin * 2;
        max-width: 100%;
        top: 0;
        border-radius: $sliderRadius;
        height: $sliderHeight;
        // transition: all 0.5s;
        overflow: hidden;
        z-index: 2;
        &-bar {
          transform: scale(1);
          width: $contentWidth;
          height: 100%;
          background: linear-gradient(to right, #8dbffd, #6ca1e2);
          z-index: 3;
        }
      }
      &-toucher {
        position: absolute;
        height: 100%;
        top: 0;
        left: 0;
        min-width: $roundHeight + $roundMargin * 2;
        max-width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        // transition: all 0.5s;
        z-index: 3;
        &-box {
          position: absolute;
          padding: $roundMargin;
          .iconfont {
            height: $roundHeight;
            width: $roundHeight;
            border-radius: 50%;
            font-size: 40px;
            background-color: #fff;
            color: #4a91e8;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      &-bg {
        position: relative;
        width: 100%;
        height: $sliderHeight;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        background-color: transparent;
        z-index: 2;
        &-round {
          display: flex;
          justify-content: center;
          align-items: center;
          height: $roundHeight;
          width: $roundHeight;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.05);
          margin: 0 $roundMargin;
          z-index: 1;
          &.cover {
            z-index: 3;
            background-color: #9ec9fc;
            color: #4a91e8;
          }
          .iconfont {
            font-size: 40px;
          }
        }
      }
    }
    &-text {
      width: calc(100% - 30px);
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      padding: 0 16px;
      font-size: 36px;
      margin-bottom: 74px;
    }
    .wind-special-set-content {
      width: 100%;
      height: 82px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: nowrap;
      margin-bottom: 60px;
      &-box {
        width: 226px;
        height: 100%;
        background-color: rgba(152, 152, 152, 0.15);
        border-radius: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont {
          font-size: 40px;
          padding-right: 18px;
        }
        span {
          font-size: 42px;
        }
        &.select {
          color: #fff;
          background: linear-gradient(180deg, #8dbffd, rgb(119, 167, 224));
        }
      }
    }
  }
  .gray {
    background-color: transparent;
    color: rgba(64, 70, 87, 0.3);
    &.wind-special-set-content-box {
      background-color: rgba(152, 152, 152, 0.045);
    }
  }
}
</style>
