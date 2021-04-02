<template>
  <div>
    <swiper
      :ref="slidesData.key"
      class="gr-swiper"
      :options="swiperOption"
      @touch-start="setSwiperHold(slidesData.key)"
      @touch-end="clearSwiperHold(slidesData.key)"
      @touch-move="setSwiperHold(slidesData.key)"
      @touchcancel.native="cancelSwiperHold(slidesData.key)"
      @touchstart.native="swiperShowDisable"
      v-show="!isShowText"
    >
      <!-- :class="{'swiper-no-swiping': noSwiping}" -->
      <swiper-slide v-for="(item, index) in slidesData.list" :key="index">
        <!-- 图片 -->
        <template v-if="item.img">
          <img :src="item.img" />
        </template>
        <!-- 温度数字 -->
        <template v-else>
          <!-- 温度：正数 -->
          <p v-text="item.integer" />
          <!-- 温度：小数点 -->
          <span v-show="item.decimal" v-text="`.${item.decimal}`" />
        </template>
      </swiper-slide>
    </swiper>
    <!-- 文字 -->
    <div class="swiper-text" :class="{ isNumber }">
      <nobr @touchend="textShowToast" v-if="isShowText" v-text="textContent" />
    </div>
  </div>
</template>

<script>
/* eslint import/no-extraneous-dependencies: off */
import { mapState, mapMutations } from 'vuex';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    slidesData: {
      type: Object,
      default() {
        return {
          list: [1, 2, 3],
          key: 'SwiperDemo',
          has05: false, // 是否存在0.5度
          has01: false
        };
      }
    }
  },
  data() {
    return {
      swiperOption: {
        effect: 'coverflow',
        slidesPerView: 4,
        centeredSlides: true,
        speed: 0,
        spaceBetween: 15,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          slideShadows: false
        },
        observer: true,
        observeParents: true,
        touchAngle: 90
      },
      noSwiping: false,
      swiperPerView: {},
      currentIndex: NaN,
      isShowText: false,
      textContent: '',
      initTimer: null,
      initTime: 0,
      isNumber: false,
      checkTimer: null // 检查手指是否松开
    };
  },
  computed: {
    ...mapState({
      swiperHold: state => state.swiperHold,
      Pow: state => state.dataObject.Pow
    }),
    addDisableClass() {
      return this.noSwiping || (this.swiperHold && this.swiperHold !== this.slidesData.key);
    }
  },
  watch: {
    Pow() {
      setTimeout(() => {
        this.$forceUpdate();
      }, 20);
    },
    swiperHold(newVal) {
      const key = this.slidesData.key;
      if (newVal) return;
      if (this.swiperPerView[key] && this.swiperPerView[key].length) {
        while (this.swiperPerView[key].length) {
          const swiper = this.swiperPerView[key].pop();
          swiper && (swiper.style.visibility = 'hidden');
        }
      }
    },
    // 兼容格力2代
    addDisableClass(newVal) {
      const key = this.slidesData.key;
      const ref = this.$refs[key];
      if (newVal) {
        ref.$el.className += ' swiper-no-swiping';
      } else {
        const classVal = ref.$el.className.replace(' swiper-no-swiping', '');
        ref.$el.className = classVal;
      }
    }
  },
  created() {
    if (this.slidesData.isNumber) {
      this.swiperOption = Object.assign(this.swiperOption, {
        slidesPerView: 2,
        speed: 0,
        spaceBetween: 80,
        preloadImages: true,
        updateOnImagesReady: true,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          slideShadows: false,
          depth: Math.floor(document.body.clientWidth / 6.5 / 10) * 10,
          modifier: 3.2
        }
      });
    }
  },
  mounted() {
    const init = () => {
      this.initTime += 1;
      this.initTime >= 3 && clearInterval(this.initTimer);
      this.$refs[this.slidesData.key] && this.$refs[this.slidesData.key].swiper.update();
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    };
    init();
    this.initTimer = setInterval(() => {
      init();
    }, 150);
  },
  methods: {
    ...mapMutations({
      setState: 'SET_STATE'
    }),
    setSwiperHold(key) {
      this.$nextTick(() => {
        this.setState(['swiperHold', key]);
        const ref = this.$refs[key];
        this.$emit('activeIndex', this.$refs[this.slidesData.key].swiper.activeIndex);
        const realIndex = ref.swiper.realIndex;
        if (this.currentIndex === realIndex) {
          return;
        }
        this.currentIndex = realIndex;
        !this.swiperPerView[key] && (this.swiperPerView[key] = []);
        ['active', 'prev', 'next'].forEach(item => {
          try {
            const dom = ref.$el.getElementsByClassName(`swiper-slide-${item}`)[0];
            // !this.swiperPerView[key].includes(dom) && this.swiperPerView[key].push(dom) && (dom.style.opacity = 1);
            !this.swiperPerView[key].includes(dom) && this.swiperPerView[key].push(dom) && (dom.style.visibility = 'visible');
          } catch (err) {
            err;
          }
        });
      });
    },
    clearSwiperHold(key) {
      this.$nextTick(() => {
        this.setState(['swiperHold', false]);
        if (!this.swiperPerView[key]) return;
        while (this.swiperPerView[key].length) {
          const swiper = this.swiperPerView[key].pop();
          // swiper && (swiper.style.opacity = 0);
          swiper && (swiper.style.visibility = 'hidden');
        }
        this.currentIndex = NaN;
        this.emitIndex();
      });
    },
    // 特殊奇葩操作，滑到一版手机息屏。需要设置值，再清除
    cancelSwiperHold(key) {
      this.clearSwiperHold(key);
      this.$nextTick(() => {
        this.$refs[this.slidesData.key].swiper.update();
      });
    },
    emitIndex() {
      this.$nextTick(() => {
        this.$emit('realIndex', this.$refs[this.slidesData.key].swiper.realIndex);
        this.$emit('activeIndex', this.$refs[this.slidesData.key].swiper.activeIndex);
      });
      this.setState(['ableSend', true]);
    },
    updateSwiper(index) {
      this.$nextTick(() => {
        this.setIndex(index); // 定位到中间
        this.$refs[this.slidesData.key].swiper.update();
      });
      setTimeout(() => {
        this.$refs[this.slidesData.key].swiper.update();
        this.setIndex(index); // 定位到中间
      }, 0);
    },
    setIndex(index) {
      this.$refs[this.slidesData.key].swiper.slideTo(index);
    },
    appendSlide(dom) {
      this.$refs[this.slidesData.key].swiper.appendSlide(dom);
    },
    prependSlide(dom) {
      this.$refs[this.slidesData.key].swiper.prependSlide(dom);
    },
    removeSlide(index) {
      this.$refs[this.slidesData.key].swiper.removeSlide(index);
    },
    removeAllSlides() {
      this.$refs[this.slidesData.key].swiper.removeAllSlides();
    },
    showText(able, text = '', isNumber = false) {
      this.textContent = text;
      this.isShowText = able;
      this.isNumber = isNumber;
      this.$forceUpdate();
    },
    banTouch(val) {
      this.noSwiping = val;
    },
    textShowToast() {
      this.$emit('text-show-toast');
    },
    swiperShowDisable() {
      if (!this.noSwiping) return;
      this.$emit('swiper-show-toast');
    }
  }
};
</script>
