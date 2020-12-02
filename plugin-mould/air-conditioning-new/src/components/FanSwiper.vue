<template>
  <gree-popup v-model="showPopup" position="bottom">
    <div class="fan-swiper-box" v-if="showSwiper">
      <div v-text="title" class="swiper-title" />
      <swiper ref="fanSwiper" :options="swiperOption" class="fan-swiper-main" @slideChange="setFan" @touchMove="moveTouch" @touchEnd="clearTouch">
        <swiper-slide v-for="(fan, index) in fanData" :key="index">
          <div v-text="fan.text" class="slide-text" />
        </swiper-slide>
      </swiper>
    </div>
  </gree-popup>
</template>

<script>
import { Popup } from 'gree-ui';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    [Popup.name]: Popup,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      title: '风速',
      showPopup: false,
      showSwiper: false,
      isTouch: false,
      swiperOption: {
        direction: 'vertical',
        centeredSlides: true,
        roundLengths: true,
        slidesPerView: 5,
        touchRatio: 0.5,
        observer: true
      },
      fanStatusNameList: [] // 风档的顺序
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState('control', {
      FanPopup: state => state.dataObject.FanPopup
    }),
    ...mapGetters(['fanDefine', 'fanIdentifier', 'fanCurrentStatusName', 'fanAbleSet', 'fanLoop']),
    swiper() {
      return this.$refs.fanSwiper.$swiper;
    },
    fanData() {
      const result = this.fanStatusNameList.map((fanStatus, value) => {
        // status定义
        const statusDefine = this.fanDefine.statusDefine[fanStatus];
        // 定义key
        const key = fanStatus;
        // 名称
        const statusName = statusDefine.name;
        const stateName = `${this.fanIdentifier}_${statusName}`;
        const text = this.$language(`fan.${stateName}`);
        return { text, key, value };
      });
      return result;
    }
  },
  watch: {
    showPopup(newVal) {
      if (!newVal) {
        this.setDataObject({ FanPopup: 0 });
      } else {
        this.$nextTick(() => {
          this.showSwiper = true;
          this.$nextTick(() => {
            this.updateIndex();
          });
        });
      }
    },
    FanPopup(newVal) {
      if (newVal) {
        this.showPopup = true;
      } else {
        this.showPopup = false;
      }
    },
    fanAbleSet(newVal) {
      newVal || (this.showPopup = false);
    },
    fanLoop() {
      this.init();
    },
    fanCurrentStatusName() {
      this.init();
    }
  },
  methods: {
    ...mapMutations('control', {
      setDataObject: 'SET_DATA_OBJECT'
    }),
    init() {
      this.updateStatusNameList();
      this.updateIndex();
    },
    // 更新到对应位置
    updateIndex() {
      // 已显示picker且没有在滑动
      if (this.showSwiper && this.swiper) {
        const index = this.fanData.findIndex(fan => fan.key === this.fanCurrentStatusName);
        this.swiper.slideTo(index, 500);
        this.imshowSelect(-1);
      }
    },
    setFan() {
      if (!this.isTouch) return;
      const statusName = this.fanData[this.swiper.activeIndex].key;
      this.$stateMachine.toStatus(this.fanIdentifier, statusName);
    },
    // 亮起当前滑动项
    imshowSelect(index) {
      this.swiper.slides.forEach((slide, slideIndex) => {
        let className = this.swiper.slides[slideIndex].className;
        if (slideIndex === index) {
          className = className.replace(' slide-select', '');
          className += ' slide-select';
        } else {
          className = className.replace(' slide-select', '');
        }
        this.swiper.slides[slideIndex].className = className;
      });
    },
    clearTouch() {
      this.$nextTick(() => {
        this.isTouch = false;
        this.updateIndex();
      });
    },
    moveTouch() {
      this.$nextTick(() => {
        const progress = this.swiper.progress;
        const len = this.swiper.slides.length - 1;
        let index = Math.round(progress / (1 / len));
        index > len && (index = len);
        index < 0 && (index = 0);
        this.imshowSelect(index);
        this.isTouch = true;
      });
    },
    updateStatusNameList() {
      let startStatus = 'default';
      if (this.fanLoop) {
        const fanStatusNameList = [...this.fanLoop];
        if (!fanStatusNameList.includes(startStatus)) {
          fanStatusNameList.sort((statusNameA, statusNameB) => {
            return statusNameA[statusNameA.length - 1] - statusNameB[statusNameB.length - 1];
          });
          startStatus = fanStatusNameList[0];
        }
        const length = fanStatusNameList.length;
        let i = 0;
        while (fanStatusNameList[0] !== startStatus && i < length) {
          fanStatusNameList.push(fanStatusNameList.shift());
          i += 1;
        }
        this.fanStatusNameList = fanStatusNameList;
      }
    }
  }
};
</script>
