<template>
  <div>
    <Swiper
      :ref="ref"
      class="mode-swiper"
      :slides-data="options" 
      @realIndex="swiperChange"
      @activeIndex="setFanName"/>
    <div class="mode-name">
      <span v-text="modeName"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import LogicDefine from '@/logic/define';
import Swiper from './index';

export default {
  components: {
    Swiper
  },
  mixins: [LogicDefine],
  data() {
    return {
      ref: 'modeSwiper',
      itemList: [],
      swiperIndex: 3,
      leftLen: 3, // 按下滑轮后左边可供显示的元素数目（为了性能考虑，不全显示）
      rightLen: 3,
      modeList: [
        {img: require('@/assets/img/mode/hot_low.png'), name: this.$language('hot.low'), key: 'Level_low', type: 'Level', value: 1},
        {img: require('@/assets/img/mode/hot_mid.png'), name: this.$language('hot.mid'), key: 'Level_mid', type: 'Level', value: 2},
        {img: require('@/assets/img/mode/hot_high.png'), name: this.$language('hot.high'), key: 'Level_high', type: 'Level', value: 3},
        {img: require('@/assets/img/mode/hot_low.png'), name: this.$language('hot.low'), key: 'Mode_low', type: 'Mode', value: 1},
        {img: require('@/assets/img/mode/hot_mid.png'), name: this.$language('hot.mid'), key: 'Mode_mid', type: 'Mode', value: 2},
        {img: require('@/assets/img/mode/hot_high.png'), name: this.$language('hot.high'), key: 'Mode_high', type: 'Mode', value: 3},
        {img: require('@/assets/img/mode/hot_wind.png'), name: this.$language('hot.wind'), key: 'Mode_wind', type: 'Mode', value: 4},
        {img: require('@/assets/img/mode/hot_1.png'), name: this.$language('hot.one'), key: 'Level_1', type: 'Level', value: 1},
        {img: require('@/assets/img/mode/hot_2.png'), name: this.$language('hot.two'), key: 'Level_2', type: 'Level', value: 2},
        {img: require('@/assets/img/mode/hot_3.png'), name: this.$language('hot.three'), key: 'Level_3', type: 'Level', value: 3},
        {img: require('@/assets/img/mode/hot_4.png'), name: this.$language('hot.four'), key: 'Level_4', type: 'Level', value: 4},
      ],
      modeName: 'auto'
    };
  },
  computed: {
    ...mapState({
      HeatMode: state => state.dataObject.HeatMode,
      HeatLevel: state => state.dataObject.HeatLevel,
    }),
    imshowList() {
      const result = this.modeList.filter(item => {
        return !this.g_hideFuncArr.includes(item.key) && this.g_identifierArr.includes(item.key);
      });
      result.length || result.push({img: require('@/assets/img/pow.png'), name: '无内容'});
      return result;
    },
    options() {
      return {
        key: 'mode',
        list: this.itemList,
        isNumber: false
      };
    },
    // swiper显示的slide总数
    swiperLen() {
      return this.leftLen + this.rightLen + 1;
    },
    // 实际index
    currentIndex() {
      const LevelIndex = this.imshowList.findIndex(item => (item.value === this.HeatLevel && item.type === 'Level'));
      if (this.HeatLevel && LevelIndex !== -1) return LevelIndex;
      const ModeIndex = this.imshowList.findIndex(item => item.value === this.HeatMode && item.type === 'Mode');
      if (this.HeatMode && ModeIndex !== -1) return ModeIndex;
      return 0;
    },
  },
  watch: {
    currentIndex(newVal) {
      const moveLen = newVal - this.swiperIndex;
      const toIndex = this.leftLen + moveLen;
      this.setFanName(toIndex);
      this.swiperChange(toIndex);
      this.updateSwiper();
    },
  },
  mounted() {
    this.setList();
    this.updateSwiper();
    this.setFanName();
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(map) {
      this.setState(['watchLock', false]);
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    // 给滑轮赋予初始区间
    setList() {
      this.swiperIndex = this.currentIndex;
      const list = [];
      for (let i = -this.leftLen; i <= this.rightLen; i += 1) {
        const index = this.countIndex(this.swiperIndex, i);
        list.push(this.imshowList[index]);  
      }
      this.itemList = list;
    },
    // 更新滑轮的显示区间
    updateList(index) {
      const moveLen = index - this.leftLen;
      this.removeSlide(moveLen);
      this.insertSlide(moveLen);
      this.swiperIndex = this.currentIndex;
    },
    // 滑轮定位到当前位置
    updateSwiper() {
      this.$nextTick(() => {
        this.$refs[this.ref].setIndex(this.leftLen); // 定位到中间
      });
    },
    // 计算滑轮向左（右）滑动moveLen个元素后的值                                                                                                              
    countIndex(fromIndex, moveLen) {
      let toIndex = fromIndex + moveLen;
      const maxLen = this.imshowList.length;
      while (toIndex < 0) {
        toIndex += maxLen;
      } 
      while (toIndex >= maxLen) {
        toIndex -= maxLen;
      }
      return toIndex;
    },
    insertSlide(moveLen) {
      const direction = moveLen / Math.abs(moveLen); // 1：往右，-1：往左
      const funcName = direction === 1 ? 'appendSlide' : 'prependSlide';
      for (let i = 1; i <= Math.abs(moveLen); i += 1) {
        const startIndex = this.swiperIndex + direction * (direction ? this.rightLen : this.leftLen);
        const toIndex = this.countIndex(startIndex, i * direction);
        this.$refs[this.ref][funcName](`<div class="swiper-slide"><img src=${this.imshowList[toIndex].img}></div>`);
      }
    },
    removeSlide(moveLen) {
      const direction = moveLen <= 0; // false：往右滑，true：往左滑
      const removeLen = Math.abs(moveLen) <= this.swiperLen ? Math.abs(moveLen) : this.swiperLen;
      const removeIndexList = Array.from({ length: removeLen }, (item, index) => {
        return direction ? (this.leftLen + this.rightLen) - index : index;
      }); // 需要移除的slide的Index
      this.$refs[this.ref].removeSlide(removeIndexList);
    },
    // 滑动事件
    swiperChange(index) {
      if (index === this.leftLen) return;
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      console.log(toIndex);
      const sendData = {};
      switch (this.imshowList[toIndex].type) {
        case 'Level':
          sendData.HeatLevel = this.imshowList[toIndex].value;
          break;
        case 'Mode':
          sendData.HeatMode = this.imshowList[toIndex].value;
          break;
        default:
          break;
      }
      this.changeData(sendData);
      this.updateList(index);
    },
    setFanName(index) {
      if (index === undefined) {
        this.modeName = this.imshowList[this.swiperIndex].name;
        return;
      }
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      this.modeName = this.imshowList[toIndex].name;
    }
  }
};
</script>
