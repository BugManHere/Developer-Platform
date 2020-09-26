<template>
  <gree-popup v-model="showPopup" position="bottom">
    <div class="fan-swiper-box" v-if="showSwiper">
      <div v-text="title" class="swiper-title" />
      <swiper ref="fanSwiper" :options="swiperOption" class="fan-swiper-main" @slideChange="setFan" @touchMove="isTouch = true" @touchEnd="clearTouch">
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
import { mapState, mapMutations, mapActions } from 'vuex';
import WorkLogin from '@logic/work';

export default {
  mixins: [WorkLogin],
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
        slidesPerView: 5
      },
      fanStatusList: [], // 风档的顺序
      currentStatus: '' // 当前状态
    };
  },
  computed: {
    ...mapState({
      FanPopup: state => state.dataObject.FanPopup
    }),
    // 风速的id
    fanId() {
      if (this.work_fanDefine) return this.work_fanDefine.identifier;
      return 'Fan';
    },
    swiper() {
      return this.$refs.fanSwiper.$swiper;
    },
    disableSwiper() {
      return this.g_hideStateArr.some(state => state.includes('FanPopup'));
    },
    fanData() {
      const result = this.fanStatusList.map((fanStatus, value) => {
        // status定义
        const statusDefine = this.work_fanDefine.statusDefine[fanStatus];
        // 定义key
        const key = fanStatus;
        // 名称
        const statusName = statusDefine.name;
        const stateName = `${this.fanId}_${statusName}`;
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
    disableSwiper(newVal) {
      newVal && (this.showPopup = false);
    },
    g_statusLoop: {
      handler(newVal) {
        const startStatus = 'default';
        const fanLoop = newVal[this.fanId];
        if (fanLoop) {
          const result = JSON.parse(JSON.stringify(newVal[this.fanId]));
          const length = result.length;
          let i = 0;
          while (result[0] !== startStatus && i < length) {
            result.push(result.shift());
            i += 1;
          }
          this.fanStatusList = result;
        }
      },
      deep: true,
      immediate: true
    },
    g_statusMap: {
      handler(newVal) {
        const statusMap = newVal[this.fanId];
        if (statusMap) this.currentStatus = statusMap.status;
        this.updateIndex();
      },
      immediate: true,
      deep: true
    }
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
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    // 更新到对应位置
    updateIndex() {
      // 已显示picker且没有在滑动
      if (this.showSwiper && this.swiper) {
        const index = this.fanData.findIndex(fan => fan.key === this.currentStatus);
        this.swiper.slideTo(index, 500);
      }
    },
    setFan() {
      if (!this.isTouch) return;
      const status = this.fanData[this.swiper.activeIndex].key;
      const funcDefine = this.work_fanDefine;
      const statusDefine = funcDefine.statusDefine[status];
      const identifier = funcDefine.identifier;
      const currentStatus = this.currentStatus;
      const customize = statusDefine.customize;
      // 执行自定义函数 'before'
      switch (customize) {
        case 'replace':
          this.customizeFunc(identifier, currentStatus, status);
          return;
        case 'before':
          this.customizeFunc(identifier, currentStatus, status);
          break;
        case 'after':
          setTimeout(() => {
            this.customizeFunc(identifier, currentStatus, status);
          }, 0);
          break;
        default:
          break;
      }
      const moreCommand = statusDefine.moreCommand;
      const json = funcDefine.json;
      const value = statusDefine.value;
      let setData = moreCommand || {};
      setData[json] = value;
      this.changeData(setData);
    },
    clearTouch() {
      this.$nextTick(() => {
        this.isTouch = false;
      });
    }
  }
};
</script>

<style></style>
