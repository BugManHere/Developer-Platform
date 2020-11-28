<template>
  <div>
    <Swiper :ref="ref" class="fan-swiper" :slides-data="options" @realIndex="swiperChange" @activeIndex="setFanName" @swiper-show-toast="swiperShowDisable" />
    <div class="fan-name">
      <span v-text="fanName" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { showToast } from '@PluginInterface';
import LogicDefine from '@/logic/define';
import Swiper from './index';

export default {
  components: {
    Swiper
  },
  mixins: [LogicDefine],
  props: {
    modeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ref: 'fanSwiper',
      itemList: [],
      swiperIndex: 3,
      leftLen: 3, // 按下滑轮后左边可供显示的元素数目（为了性能考虑，不全显示）
      rightLen: 3,
      fanName: 'auto'
    };
  },
  computed: {
    ...mapState({
      mac: state => state.mac,
      WdSpd: state => state.dataObject.WdSpd,
      Mod: state => state.dataObject.Mod,
      Tur: state => state.dataObject.Tur,
      Quiet: state => state.dataObject.Quiet,
      SwhSlp: state => state.dataObject.SwhSlp
    }),
    fanList() {
      const result = [
        {
          img: require('@/assets/img/fan/n_auto.png'),
          name: this.$language('fan.auto'),
          value: 0,
          key: 'Fan_auto'
        },
        {
          img: require('@/assets/img/fan/n_low.png'),
          name: this.$language('fan.low'),
          value: 1,
          key: 'Fan_low'
        },
        {
          img: require('@/assets/img/fan/n_low.png'),
          name: this.$language('fan.low'),
          value: 1,
          key: 'Fan_low_b'
        },
        {
          img: require('@/assets/img/fan/n_medium_low.png'),
          name: this.$language('fan.medium_low'),
          value: 2,
          key: 'Fan_medium_low'
        },
        {
          img: require('@/assets/img/fan/n_medium.png'),
          name: this.$language('fan.medium'),
          value: 3,
          key: 'Fan_medium'
        },
        {
          img: require('@/assets/img/fan/n_medium.png'),
          name: this.$language('fan.medium'),
          value: 2,
          key: 'Fan_medium_b'
        },
        {
          img: require('@/assets/img/fan/n_medium_high.png'),
          name: this.$language('fan.medium_high'),
          value: 4,
          key: 'Fan_medium_high'
        },
        {
          img: require('@/assets/img/fan/n_high.png'),
          name: this.$language('fan.high'),
          value: 5,
          key: 'Fan_high'
        },
        {
          img: require('@/assets/img/fan/n_high.png'),
          name: this.$language('fan.high'),
          value: 3,
          key: 'Fan_high_b'
        },
        {
          img: require('@/assets/img/fan/n_quiet.png'),
          name: this.$language('fan.quiet'),
          value: 7,
          key: 'Fan_quiet'
        }
      ];
      // 如果开启智眠，则不能开启强劲档
      const len = result.length;
      (this.g_identifierArr.includes('SmartSleep') && this.SwhSlp) ||
        result.splice(len - 1, 0, {
          img: require('@/assets/img/fan/n_turbo.png'),
          name: this.$language('fan.turbo'),
          value: 6,
          key: 'Fan_tur'
        });
      return result;
    },
    imshowList() {
      const result = this.fanList.filter(item => {
        return !this.g_hideFuncArr.includes(item.key) && this.g_identifierArr.includes(item.key);
      });
      result.length ||
        result.push({
          img: require('@/assets/img/pow.png'),
          name: '无内容',
          value: 0
        });
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
      return this.getSwiperIndex(this.WdSpd);
    },
    hideState() {
      return this.g_hideStateArr.includes('WdSpd_default');
    },
    ableControl() {
      return !this.hideState && this.imshowList.length !== 1;
    }
  },
  watch: {
    currentIndex(newVal) {
      const moveLen = newVal - this.swiperIndex;
      const toIndex = this.leftLen + moveLen;
      this.setFanName(toIndex);
      this.swiperChange(toIndex);
      this.updateSwiper();
    },
    'imshowList.length': {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          if (newVal === 1) {
            oldVal === undefined || this.swiperChange(this.currentIndex);
          }
          this.initSwiper();
        });
      },
      immediate: true
    },
    ableControl: {
      handler(newVal) {
        this.$nextTick(() => {
          this.$refs[this.ref].banTouch(!newVal);
        });
      },
      immediate: true
    }
  },
  mounted() {
    this.setList();
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
    // 初始化
    initSwiper() {
      this.$refs[this.ref].updateSwiper(this.leftLen);
      setTimeout(() => {
        this.removeAllSlide();
        this.insertAllSlide();
        this.$nextTick(() => {
          this.$refs[this.ref].updateSwiper(this.leftLen);
          this.setFanName();
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
      const maxLen = this.imshowList.length;
      let moveLen = index - this.leftLen;
      if (moveLen > this.rightLen) {
        moveLen -= maxLen;
      } else if (moveLen < -this.leftLen) {
        moveLen += maxLen;
      }
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
      const removeLen = Math.abs(moveLen) <= this.swiperLen ? Math.abs(moveLen) : this.swiperLen;
      const funcName = direction === 1 ? 'appendSlide' : 'prependSlide';
      for (let i = 1; i <= Math.abs(removeLen); i += 1) {
        const startIndex = this.swiperIndex + direction * (direction ? this.rightLen : this.leftLen);
        const toIndex = this.countIndex(startIndex, i * direction);
        this.$refs[this.ref][funcName](`<div class="swiper-slide"><img src=${this.imshowList[toIndex].img}></div>`);
      }
    },
    removeSlide(moveLen) {
      const direction = moveLen <= 0; // false：往右滑，true：往左滑
      const removeLen = Math.abs(moveLen) <= this.swiperLen ? Math.abs(moveLen) : this.swiperLen;
      const removeIndexList = Array.from({ length: removeLen }, (item, index) => {
        return direction ? this.leftLen + this.rightLen - index : index;
      }); // 需要移除的slide的Index
      this.$refs[this.ref].removeSlide(removeIndexList);
    },
    // 移除所有slide
    removeAllSlide() {
      this.$refs[this.ref].removeAllSlides();
    },
    // 根据情况填充slide
    insertAllSlide() {
      let swiperNum = this.$refs[this.ref].$el.getElementsByClassName('swiper-wrapper')[0].childNodes.length;
      if (swiperNum >= this.leftLen + this.rightLen + 1) return;
      for (let i = this.leftLen; i >= -this.rightLen; i -= 1) {
        const funcName = 'prependSlide';
        const moveLen = i;
        const toIndex = this.countIndex(this.swiperIndex, moveLen);
        this.$refs[this.ref][funcName](`<div class="swiper-slide"><img src=${this.imshowList[toIndex].img}></div>`);
      }

      // 如果slide数量大于限定数量，则删掉
      swiperNum = this.$refs[this.ref].$el.getElementsByClassName('swiper-wrapper')[0].childNodes.length;
      let maxLen = this.leftLen + this.rightLen + 1;
      if (swiperNum >= maxLen) {
        const removeList = [];
        for (let index = maxLen; index < swiperNum; index += 1) {
          removeList.push(index);
        }
        setTimeout(() => {
          this.$refs[this.ref].removeSlide(removeList);
        }, 0);
      }
    },
    // 滑动事件
    swiperChange(index) {
      if (index === this.leftLen) return;
      const toIndex = this.countIndex(this.swiperIndex, index - this.leftLen);
      const value = this.imshowList[toIndex].value;
      switch (value) {
        case 6:
          this.changeData({ Tur: 1, Quiet: 0, WdSpd: 5 });
          break;
        case 7:
          this.changeData({ Tur: 0, Quiet: 2, WdSpd: 1 });
          break;
        default:
          this.changeData({ Tur: 0, Quiet: 0, WdSpd: value });
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
    },
    swiperShowDisable() {
      showToast(`${this.modeName}模式下不可滑动`, 1);
    },
    getSwiperIndex(value) {
      const turIndex = this.imshowList.findIndex(item => item.value === 6);
      if (this.Tur && turIndex !== -1) return turIndex;
      const QuietIndex = this.imshowList.findIndex(item => item.value === 7);
      if (this.Quiet && QuietIndex !== -1) return QuietIndex;
      const result = this.imshowList.findIndex(item => item.value === value);
      if (result !== -1) return result;
      return 0;
    }
  }
};
</script>
