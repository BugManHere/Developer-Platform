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
      fanList: [
        {img: require('@/assets/img/fan/n_auto.png'), name: this.$language('fan.auto'), index: 0, key: 'Fan_auto'},
        {img: require('@/assets/img/fan/n_low.png'), name: this.$language('fan.low'), index: 1, key: 'Fan_low'},
        {img: require('@/assets/img/fan/n_medium_low.png'), name: this.$language('fan.medium_low'), index: 2, key: 'Fan_medium_low'},
        {img: require('@/assets/img/fan/n_medium.png'), name: this.$language('fan.medium'), index: 3, key: 'Fan_medium'},
        {img: require('@/assets/img/fan/n_medium_high.png'), name: this.$language('fan.medium_high'), index: 4, key: 'Fan_medium_high'},
        {img: require('@/assets/img/fan/n_high.png'), name: this.$language('fan.high'), index: 5, key: 'Fan_high'},
        {img: require('@/assets/img/fan/n_turbo.png'), name: this.$language('fan.turbo'), index: 6, key: 'Fan_tur'},
        {img: require('@/assets/img/fan/n_quiet.png'), name: this.$language('fan.quiet'), index: 7, key: 'Fan_quiet'}
      ]
    };
  },
  computed: {
    ...mapState({
      mac: state => state.mac,
      WdSpd: state => state.dataObject.WdSpd,
      Mod: state => state.dataObject.Mod,
      Tur: state => state.dataObject.Tur,
      Quiet: state => state.dataObject.Quiet,
    }),
    imshowList() {
      const result = this.fanList.filter(item => {
        return !this.g_hideFuncArr.includes(item.key) && this.g_identifierArr.includes(item.key);
      });
      result.length || result.push({img: require('@/assets/img/pow.png'), name: '无内容', index: 0});
      return result;
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
      const turIndex = this.imshowList.findIndex(item => item.index === 6);
      if (this.Tur && turIndex !== -1) return turIndex;
      const QuietIndex = this.imshowList.findIndex(item => item.index === 7);
      if (this.Quiet && QuietIndex !== -1) return QuietIndex;
      const index = this.imshowList.findIndex(item => item.index === this.WdSpd);
      if (index !== -1) return index;
      return 0;
    },
  },
  watch: {
    currentIndex(newVal) {
      const moveLen = newVal - this.swiperIndex;
      const toIndex = this.leftLen + moveLen;
      // this.initSwiper();
      this.setFanName(toIndex);
      this.swiperChange(toIndex);
      this.updateSwiper();
    },
    'imshowList.length': {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          if (newVal === 1) {
            this.$refs[this.ref].banTouch(true);
            oldVal === undefined || this.swiperChange(this.imshowList[0].index);
          } else { 
            this.$refs[this.ref].banTouch(false);
          }
          this.initSwiper();
        });
      },
      immediate: true
    },
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
    // 移除所有slide
    removeAllSlide() {
      this.$refs[this.ref].removeAllSlides();
    },
    // 根据情况填充slide 
    insertAllSlide() {
      for (let i = -this.leftLen; i <= this.rightLen; i += 1) {
        const funcName = 'appendSlide';
        const moveLen = i;
        const toIndex = this.countIndex(this.swiperIndex, moveLen);
        this.$refs[this.ref][funcName](`<div class="swiper-slide"><img src=${this.imshowList[toIndex].img}></div>`);
      }
    },
    // 滑动事件
    swiperChange(index) {
      if (index === this.leftLen) return;
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      const realIndex = this.imshowList[toIndex].index;
      switch (realIndex) {
        case 6: 
          this.changeData({Tur: 1, Quiet: 0});
          break;
        case 7:
          this.changeData({Tur: 0, Quiet: 2});
          break;
        default:
          this.changeData({Tur: 0, Quiet: 0, WdSpd: realIndex});
          // 更新到localStorage
          window.storage.set('WdSpd', realIndex);
          break; 
      }
      this.updateList(index);
    },
    setFanName(index) {
      if (index === undefined) {
        this.fanName = this.imshowList[this.swiperIndex].name;
        return;
      }
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      this.fanName = this.imshowList[toIndex].name;
    }
  }
};
</script>
