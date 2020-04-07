<template>
  <div>
    <Swiper
      :ref="ref"
      class="fan-swiper"
      :slides-data="options" 
      @realIndex="swiperChange"
      @activeIndex="setFanName"/>
    <div class="fan-name">
      <span v-text="fanName"/>
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
      ref: 'fanSwiper',
      itemList: [],
      swiperIndex: 3,
      leftLen: 3, // 按下滑轮后左边可供显示的元素数目（为了性能考虑，不全显示）
      rightLen: 3,
      fanName: 'auto',
    };
  },
  computed: {
    ...mapState({
      WdSpd: state => state.dataObject.WdSpd,
      Mod: state => state.dataObject.Mod,
      Tur: state => state.dataObject.Tur,
      Quiet: state => state.dataObject.Quiet
    }),
    imgList() {
      if (this.Mod === 2) {
        return [
          {img: require('@/assets/img/fan/n_low.png'), name: this.$language('fan.low'), index: 1},
          {img: require('@/assets/img/fan/n_low.png'), name: this.$language('fan.low'), index: 1},
          {img: require('@/assets/img/fan/n_low.png'), name: this.$language('fan.low'), index: 1},
          {img: require('@/assets/img/fan/n_low.png'), name: this.$language('fan.low'), index: 1},
          {img: require('@/assets/img/fan/n_low.png'), name: this.$language('fan.low'), index: 1}];
      }
      const list = [
        {img: require('@/assets/img/fan/n_auto.png'), name: this.$language('fan.auto'), index: 0},
        {img: require('@/assets/img/fan/n_low.png'), name: this.$language('fan.low'), index: 1},
        {img: require('@/assets/img/fan/n_medium_low.png'), name: this.$language('fan.medium_low'), index: 2},
        {img: require('@/assets/img/fan/n_medium.png'), name: this.$language('fan.medium'), index: 3},
        {img: require('@/assets/img/fan/n_medium_high.png'), name: this.$language('fan.medium_high'), index: 4},
        {img: require('@/assets/img/fan/n_high.png'), name: this.$language('fan.high'), index: 5}
      ];
      const hasTur = !this.g_hideFuncArr.includes('Fan_tur');
      const hasQuiet = !this.g_hideFuncArr.includes('Fan_quiet');
      hasTur && (list.push({img: require('@/assets/img/fan/n_turbo.png'), name: this.$language('fan.turbo'), index: 6}));
      hasQuiet && (list.push({img: require('@/assets/img/fan/n_quiet.png'), name: this.$language('fan.quiet'), index: 7}));
      return list;
    },
    options() {
      return {
        key: 'fan',
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
      if (this.Tur) return 6;
      if (this.Quiet) return 7;
      return this.WdSpd;
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
    'imgList.length'() {
      this.initSwiper();
    },
    Mod: {
      handler(newVal) {
        this.$nextTick(() => {
          if (newVal === 2) {
            this.$refs[this.ref].banTouch(true);
          } else {
            this.$refs[this.ref].banTouch(false);
          }
          this.initSwiper();
        });
      },
      immediate: true
    }
  },
  mounted() {
    this.setList();
    this.setFanName();
    this.updateSwiper();
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
    // 初始化
    initSwiper() {
      setTimeout(() => {
        this.removeAllSlide();
        this.insertAllSlide();
        this.$nextTick(() => {
          this.updateSwiper();
          // setTimeout(() => {
          this.$refs[this.ref].updateSwiper();
          this.setFanName();
          // }, 0);
        });
      }, 0);
    },
    // 给滑轮赋予初始区间
    setList() {
      this.swiperIndex = this.currentIndex;
      const list = [];
      for (let i = -this.leftLen; i <= this.rightLen; i += 1) {
        const index = this.countIndex(this.swiperIndex, i);
        list.push(this.imgList[index]); 
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
      const maxLen = this.imgList.length;
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
        this.$refs[this.ref][funcName](`<div class="swiper-slide"><img src=${this.imgList[toIndex].img}></div>`);
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
    // 移除所有slide
    removeAllSlide() {
      // const index = this.imgList.map((item, index) => index);
      // index.splice(this.leftLen, 1);
      // this.$refs[this.ref].removeSlide(index);
      this.$refs[this.ref].removeAllSlides();
    },
    // 根据情况填充slide 
    insertAllSlide() {
      for (let i = -this.leftLen; i <= this.rightLen; i += 1) {
        const funcName = 'appendSlide';
        const moveLen = i;
        const toIndex = this.countIndex(this.swiperIndex, moveLen);
        this.$refs[this.ref][funcName](`<div class="swiper-slide"><img src=${this.imgList[toIndex].img}></div>`);
      }
    },
    // 滑动事件
    swiperChange(index) {
      if (index === this.leftLen) return;
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      switch (this.imgList[toIndex].index) {
        case 6: 
          this.changeData({Tur: 1, Quiet: 0});
          break;
        case 7:
          this.changeData({Tur: 0, Quiet: 2});
          break;
        default:
          this.changeData({Tur: 0, Quiet: 0, WdSpd: toIndex});
          localStorage.WdSpd = toIndex;
          break; 
      }
      this.updateList(index);
    },
    setFanName(index) {
      if (index === undefined) {
        this.fanName = this.imgList[this.swiperIndex].name;
        return;
      }
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      this.fanName = this.imgList[toIndex].name;
    }
  }
};
</script>
