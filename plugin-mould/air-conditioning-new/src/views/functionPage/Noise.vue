<template>
  <gree-view bg-color="#fdfdfd">
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
import { mapState, mapMutations, mapActions } from 'vuex';
import WorkLogin from '@logic/work';

export default {
  mixins: [WorkLogin],
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
      heatMod: 4,
      isActive: true,
      sliderImshow: false,
      silderVal: 25,
      minSilderVal: 22,
      maxSilderVal: 38
    };
  },
  mounted() {
    window.testFunc = this.changeStatus;
  },
  watch: {
    silderType: {
      handler(newVal) {
        if (newVal) {
          const { key } = newVal; //
          this.silderVal = this[key]; // 赋值
          this.minSilderVal = newVal.min; // 赋予最小值
          this.maxSilderVal = newVal.max; // 赋予最大值
          this.sliderImshow = false;
          this.$nextTick(() => {
            this.sliderImshow = true;
          });
        }
      },
      immediate: true,
      deep: true
    },
    NoiseSet: {
      handler(newVal) {
        this.isActive = Boolean(newVal);
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      NoiseSet: state => state.dataObject.NoiseSet,
      CoolNoise: state => state.dataObject.CoolNoise || 25,
      HeatNoise: state => state.dataObject.HeatNoise || 32
    }),
    // 当前模式的status
    modStatus() {
      return this.g_statusMap[this.work_modIdentifier];
    },
    // 制热和制冷不一样的配置
    silderType() {
      const value = this.modStatus ? this.modStatus.define.value : undefined;
      // 如果是制热
      return value === this.heatMod
        ? {
            key: 'HeatNoise',
            default: 32,
            min: 29,
            max: 39
          }
        : {
            key: 'CoolNoise',
            default: 25,
            min: 22,
            max: 38
          };
    },
    options() {
      return [
        {
          value: 1,
          text: this.$language('noise.text')
        }
      ];
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
    // 发送数据
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    // 返回按钮
    turnBack() {
      this.$router.push({ name: 'Home' }).catch(err => {
        err;
      });
    },
    // 保存按钮
    saveBtn() {},
    // 开关噪声
    switchStatus(boolean) {
      this.changeStatus('', Number(boolean));
    },
    // 设置噪声
    changeStatus(e, NoiseSet = 1) {
      const { key } = this.silderType;
      this.changeData({ NoiseSet, [key]: this.silderVal });
    },
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
