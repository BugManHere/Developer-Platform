<template>
  <gree-view bg-color="#F4F4F4">
    <gree-page class="page-noise">
      <!-- 标题 -->
      <gree-header>
        {{ $language('noise.title') }}
        <i class="iconfont iconfont-fanhui" slot="overwrite-left" @click="turnBack" />
        <span v-text="$language('home.save')" slot="right" @click="saveBtn" v-if="isActive" />
      </gree-header>
      <!-- 开关 -->
      <gree-list>
        <gree-list-item :title="$language('noise.title')">
          <gree-switch slot="after" v-model="isActive" @change="switchStatus" size="20" />
        </gree-list-item>
        <div class="page-list-item" v-if="sliderImshow && isActive">
          <div class="page-list-item-text" v-text="$language('noise.text')" />
          <div class="page-list-item-text page-list-item-slider">
            <span v-text="`${minSilderVal}db`" style="color: #FF989898" />
            <gree-slider v-model="silderVal" :min="minSilderVal" :max="maxSilderVal" :show-label-always="true" :format="silderFormat" />
            <span v-text="`${maxSilderVal}db`" style="color: #FF989898" />
          </div>
        </div>
      </gree-list>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, RadioList, List, Switch, Item, Slider, Block } from 'gree-ui';
import NoiseConfig from './Noise';

export default {
  mixins: [NoiseConfig],
  components: {
    [Header.name]: Header,
    [Block.name]: Block,
    [RadioList.name]: RadioList,
    [List.name]: List,
    [Switch.name]: Switch,
    [Item.name]: Item,
    [Slider.name]: Slider
  },
  data() {
    return {
      isActive: true,
      sliderImshow: false,
      minSilderVal: 22,
      maxSilderVal: 38
    };
  },
  computed: {
    options() {
      return [
        {
          value: 1,
          text: this.$language('noise.text')
        }
      ];
    }
  },
  watch: {
    NoiseSet: {
      handler(newVal) {
        this.isActive = Boolean(newVal);
      },
      immediate: true
    }
  },
  methods: {
    // 返回按钮
    turnBack() {
      this.$router.push({ name: 'Home' }).catch(err => {
        err;
      });
    },
    // 保存按钮
    saveBtn() {},
    // 标签文字
    silderFormat(val) {
      return `${val}db`;
    }
  }
};
</script>

<style lang="scss">
.page-noise {
  .list {
    margin: 0;
    border-bottom: 1px solid #eee;
    .page-list-item {
      &-text {
        min-height: 122px;
        padding-left: 55px;
        font-size: 42px;
        display: flex;
        align-items: center;
      }
      &-slider {
        padding: 30px 24px 20px 24px;
        display: flex;
        justify-content: space-between;
        font-size: 32px;
      }
    }
    .gree-slider {
      z-index: 5;
      width: 800px;
      touch-action: none;
      .gree-slider-label {
        color: rgba(97, 156, 231, 1);
        margin: 0;
        background-color: transparent;
      }
    }
  }
  .gree-header {
    background-color: #fdfdfd;
    border-bottom: 0.5px solid #eee;
  }
}
</style>
