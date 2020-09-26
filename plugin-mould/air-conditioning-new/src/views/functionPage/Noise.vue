<template>
  <gree-view bg-color="#fdfdfd">
    <gree-page class="page-noise">
      <!-- 标题 -->
      <gree-header>
        {{ $language('noise.title') }}
        <i class="iconfont iconfont-fanhui" slot="overwrite-left" @click="turnBack" />
      </gree-header>
      <!-- 开关 -->
      <gree-list>
        <gree-list-item :title="$language('noise.title')">
          <gree-switch slot="after" v-model="isActive" @change="switchStatus" size="20" />
        </gree-list-item>
        <div class="page-list-item">
          <div class="page-list-item-text" v-text="$language('noise.text')" />
          <div class="page-list-item-text page-list-item-slider">
            <span v-text="`${minSilderVal}db`" style="color: #FF989898" />
            <gree-slider v-model="silderVal" :min="minSilderVal" :max="maxSilderVal" />
            <span v-text="`${maxSilderVal}db`" style="color: #FF989898" />
          </div>
        </div>
      </gree-list>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, RadioList, List, Switch, Item, Slider, Block } from 'gree-ui';
import { mapState } from 'vuex';
// import { showToast, hideLoading } from '@PluginInterface';
import LogicDefine from '@logic/define';

export default {
  mixins: [LogicDefine],
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
      silderVal: 25,
      minSilderVal: 22,
      maxSilderVal: 39
    };
  },
  mounted() {
    console.log(this.g_funcDefine_inertia);
  },
  computed: {
    ...mapState({
      NoiseSet: state => state.dataObject.NoiseSet
    }),
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
    turnBack() {
      this.$router.push({ name: 'Home' }).catch(err => {
        err;
      });
    },
    switchStatus(e) {
      console.log(e);
    },
    changeStatus(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="scss" scoped>
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
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        font-size: 32px;
      }
    }
    .gree-slider {
      z-index: 5;
      width: 800px;
    }
  }
  .gree-header {
    background-color: #fdfdfd;
    border-bottom: 0.5px solid #eee;
  }
}
</style>
