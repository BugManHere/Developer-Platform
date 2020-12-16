<template>
  <gree-view bg-color="#F4F4F4">
    <gree-page class="page-svst">
      <!-- 标题 -->
      <gree-header>
        <!-- 标题 -->
        {{ $language('svst.title') }}
        <!-- 返回按钮 -->
        <i class="iconfont iconfont-fanhui" slot="overwrite-left" @click="turnBack" />
        <!-- 保存按钮 -->
        <span v-text="$language('home.save')" slot="right" @click="saveBtn" v-if="isActive" />
      </gree-header>
      <gree-list>
        <!-- 开关 -->
        <gree-list-item :title="$language('svst.title')">
          <gree-switch slot="after" v-model="isActive" @change="switchStatus" size="20" />
        </gree-list-item>
      </gree-list>
      <!-- 内容 -->
      <div class="page-svst-content" v-show="pickerImshow">
        <div class="page-svst-content-text">
          <span v-text="svstText[0]" />
          <span v-text="silderType.text" class="blue" />
          <span v-text="svstText[1]" />
          <span v-text="silderType.text" />
          <span v-text="svstText[2]" />
        </div>
        <swiper
          ref="svstSwiper"
          :options="swiperOption"
          class="page-svst-swiper"
          @slideChange="changeTem"
          @touchMove="setTouch(true)"
          @touchEnd="setTouch(false)"
        >
          <swiper-slide v-for="(item, index) in silderList" :key="index">
            <div v-text="item.text" class="page-svst-swiper-text" />
          </swiper-slide>
        </swiper>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { Header, List, Switch, Item, Picker } from 'gree-ui';
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import { showToast } from '@PluginInterface';
import { types } from '@/store/types';

export default {
  components: {
    [Header.name]: Header,
    [List.name]: List,
    [Switch.name]: Switch,
    [Picker.name]: Picker,
    [Item.name]: Item,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      isActive: true,
      selectTem: 18,
      coolMod: 1,
      dryMod: 2,
      heatMod: 4,
      isTouch: false,
      swiperOption: {
        direction: 'vertical',
        centeredSlides: true,
        roundLengths: true,
        slidesPerView: 3,
        touchRatio: 0.5,
        observer: true
      }
    };
  },
  computed: {
    ...mapState('control', {
      SvSt: state => state.dataObject.SvSt,
      CoolSvStTemMin: state => state.dataObject.CoolSvStTemMin || 18,
      HumiSvStTemMin: state => state.dataObject.HumiSvStTemMin || 18,
      HeatSvStTemMax: state => state.dataObject.HeatSvStTemMax || 18
    }),
    ...mapGetters(['modIdentifier', 'temSetVal', 'temSetJson', 'temMinVal', 'temMaxVal']),
    ...mapGetters('machine', ['statusMap']),
    swiper() {
      return this.$refs.svstSwiper.$swiper;
    },
    // 当前模式的status
    modStatus() {
      return this.statusMap[this.modIdentifier];
    },
    // 制热和制冷不一样的配置
    silderType() {
      const value = this.modStatus ? this.modStatus.status.value : undefined;
      let result;
      if (value) {
        switch (value) {
          case this.coolMod:
            result = {
              type: 'cool',
              text: '制冷',
              min: 16,
              max: 30,
              default: 18,
              json: 'CoolSvStTemMin'
            };
            break;
          case this.dryMod:
            result = {
              type: 'dry',
              text: '除湿',
              min: 16,
              max: 30,
              default: 18,
              json: 'HumiSvStTemMin'
            };
            break;
          case this.heatMod:
            result = {
              type: 'heat',
              text: '制热',
              min: 16,
              max: 30,
              default: 18,
              json: 'HeatSvStTemMax'
            };
            break;
          default:
            break;
        }
      }
      return result;
    },
    // 当前设置温度
    currentTem() {
      const json = this.silderType.json;
      return this[json] || 18;
    },
    pickerImshow() {
      return Boolean(this.isActive && this.silderType.type);
    },
    // 文案
    svstText() {
      return ['当前模式为', '，请选择', '温度下限'];
    },
    // 滑轮配置
    silderList() {
      if (!this.silderType.type) return [[]];
      const { min, max } = this.silderType;
      const result = [];
      for (let i = min; i <= max; i += 1) {
        result.push({
          text: `${i}`,
          value: i
        });
      }
      return result;
    }
  },
  mounted() {
    this.selectTem = this.currentTem;
    // 给主页传入图标点击事件
    this.$emit('defaultFunction', this.switchStatus);
  },
  watch: {
    SvSt: {
      handler(newVal) {
        this.isActive = Boolean(newVal);
      },
      immediate: true
    },
    pickerImshow: {
      handler(newVal) {
        if (newVal) {
          try {
            this.updateSwiper();
          } catch (e) {
            e;
          }
        }
      },
      immediate: true
    },
    currentTem: {
      handler() {
        try {
          this.updateSwiper();
        } catch (e) {
          e;
        }
      },
      immediate: true
    },
    temMinVal(newVal) {
      newVal > this.temSetVal && this.sendData({ [this.temSetJson]: newVal });
    },
    temMaxVal(newVal) {
      newVal < this.temSetVal && this.sendData({ [this.temSetJson]: newVal });
    }
  },
  methods: {
    ...mapMutations({
      setDataObject: types.SET_DATA_OBJECT,
      setState: types.CONTROL_SET_STATE
    }),
    ...mapActions({
      sendCtrl: types.SEND_CTRL,
      sendData: types.SEND_DATA
    }),
    // 返回按钮
    turnBack() {
      this.$router.push({ name: 'Home' }).catch(err => {
        err;
      });
    },
    // 保存按钮
    saveBtn() {
      showToast('保存成功');
      this.switchStatus(true);
      this.turnBack();
    },
    // 开关
    switchStatus(boolean = !this.isActive) {
      const sendData = { SvSt: Number(boolean) };
      const json = this.silderType.json;
      const value = this.selectTem;
      sendData[json] = value;
      this.sendData(sendData);
    },
    // 改变温度
    changeTem(el) {
      if (!this.isTouch) return;
      const value = this.silderList[el.activeIndex].value;
      this.selectTem = value;
    },
    // 更新滑轮
    updateSwiper() {
      const value = this.currentTem;
      const index = this.silderList.findIndex(slider => {
        return slider.value === value;
      });
      this.$nextTick(() => {
        this.swiper.slideTo(index, 500);
        this.selectTem = this.currentTem;
      });
    },
    setTouch(value) {
      this.$nextTick(() => {
        this.isTouch = value;
      });
    }
  }
};
</script>

<style lang="scss">
.page-svst {
  .list {
    margin: 0;
    border-bottom: 1px solid #eee;
  }
  .gree-header {
    background-color: #fdfdfd;
    border-bottom: 0.5px solid #eee;
  }
  .page-svst-content {
    position: relative;
    margin-top: 60px;
    background-color: #fff;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    &-text {
      padding: 24px 0 0 54px;
      font-size: 40px;
      color: rgba(152, 152, 152, 1);
      .blue {
        color: rgba(97, 156, 231, 1);
      }
    }
    .page-svst-swiper {
      height: 450px;
      width: 100%;
      overflow: hidden;
      margin: 100px 0;
      .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        &-active {
          > div {
            font-size: 96px !important;
            &::after {
              font-size: 72px;
              content: '℃';
            }
          }
          color: rgba(97, 156, 231, 1);
        }
      }
      &-text {
        width: 100%;
        font-size: 52px;
        text-align: center;
      }
    }
  }
}
</style>
