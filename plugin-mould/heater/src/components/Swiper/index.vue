<template>
  <div>
    <swiper
      :ref="slidesData.key"
      class="gr-swiper"
      :options="swiperOption"
      @touch-start="setSwiperHold(slidesData.key)"
      @touch-end="clearSwiperHold(slidesData.key)"
      @touch-move="setSwiperHold(slidesData.key)"
      :class="{'swiper-no-swiping': noSwiping}"
      v-show="!isShowText"
    >
      <swiper-slide 
        v-for="(item, index) in slidesData.list" 
        :key="index">
        <!-- 图片 -->
        <template v-if="item.img">
          <img :src="item.img">
        </template>
        <!-- 温度数字 -->
        <template v-else>
          <!-- 温度：正数 -->
          <p v-text="item.integer" />
          <!-- 温度：小数点 -->
          <span 
            v-show="item.decimal" 
            v-text="`.${item.decimal}`" />
        </template>
      </swiper-slide>
    </swiper>
    <!-- 文字 -->
    <div 
      class="swiper-text"
      :class="{isNumber}">
      <nobr
        v-if="isShowText"
        v-text="textContent" />
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
        observeParents: true
      },
      noSwiping: false,
      swiperPerView: {},
      currentIndex: NaN,
      isShowText: false,
      textContent: '',
      initTimer: null,
      initTime: 0,
      isNumber: false,
    };
  },
  computed: {
    ...mapState({
      swiperHold: state => state.swiperHold,
      Pow: state => state.dataObject.Pow,
    }),
  },
  watch: {
    Pow() {
      setTimeout(() => {
        this.$forceUpdate();
      }, 20);
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
          modifier: 3.2,
        },
      });
    }
  },
  mounted() {
    const init = () => {
      this.initTime += 1;
      this.initTime >= 3 && (clearInterval(this.initTimer));
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
        !this.swiperHold && this.setState(['swiperHold', true]);
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
    emitIndex() {
      this.$nextTick(() => {
        this.$emit('realIndex', this.$refs[this.slidesData.key].swiper.realIndex);
        this.$emit('activeIndex', this.$refs[this.slidesData.key].swiper.activeIndex);
      });
      this.setState(['ableSend', true]);
    },
    updateSwiper() {
      this.$refs[this.slidesData.key].swiper.update();
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
    }
  }
};
</script>
