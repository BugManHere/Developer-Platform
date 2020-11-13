<template>
  <gree-view bg-color="#F4F4F4">
    <gree-page class="page-area">
      <!-- 标题 -->
      <gree-header>
        <!-- 标题 -->
        {{ $language('area.title') }}
        <!-- 返回按钮 -->
        <i class="iconfont iconfont-fanhui" slot="overwrite-left" @click="turnBack" />
        <!-- 保存按钮 -->
        <span v-text="$language('home.save')" slot="right" @click="saveBtn" v-if="isChange && isActive" />
      </gree-header>
      <gree-list>
        <!-- 开关 -->
        <gree-list-item :title="$language('area.title')">
          <gree-switch slot="after" v-model="isActive" @change="switchArea" size="20" />
        </gree-list-item>
        <gree-list-item :title="$language('area.title2')">
          <gree-switch slot="after" v-model="isActive2" @change="switchFbidBloPer" size="20" />
        </gree-list-item>
      </gree-list>
      <!-- 提示文案 -->
      <div v-text="$language('area.tip')" class="page-area-tip" v-show="isActive" />
      <!-- 选择区域 -->
      <div class="page-area-content" v-show="isActive">
        <!-- 空调 -->
        <div
          class="page-area-content-ac"
          @touchstart="startDrag"
          @touchmove="moveDrag"
          @touchend="finshDrag"
          :style="{ transform: `translateX(${ac.translateX + ac.currentPos}px)` }"
        />
        <!-- 九宫格 -->
        <div class="page-area-content-box">
          <div class="box-cube" v-for="i in 9" :key="i" @click="selectArea = i" :class="{ select: selectArea === i }" />
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, RadioList, List, Switch, Item, Slider, Block } from 'gree-ui';
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';

export default {
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
      isActive2: true,
      sliderImshow: false,
      minSilderVal: 22,
      maxSilderVal: 38,
      heatMod: 4,
      silderVal: 25,
      selectArea: 1,
      isSetting: false,
      moveMax: 0,
      ac: {
        startX: 0,
        translateX: 0,
        currentPos: 0,
        area: 0
      }
    };
  },
  computed: {
    ...mapState('control', {
      FbidBloPer: state => state.dataObject.FbidBloPer,
      ACStupPos: state => state.dataObject.ACStupPos,
      EnvAreaSt: state => {
        const dataObject = state.dataObject;
        return [
          dataObject.EnvArea1St,
          dataObject.EnvArea2St,
          dataObject.EnvArea3St,
          dataObject.EnvArea4St,
          dataObject.EnvArea5St,
          dataObject.EnvArea6St,
          dataObject.EnvArea7St,
          dataObject.EnvArea8St,
          dataObject.EnvArea9St
        ];
      }
    }),
    ...mapGetters(['modIdentifier']),
    // 当前模式的status
    modStatus() {
      return this.state_statusMap[this.modIdentifier];
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
    },
    isChange() {
      return !this.EnvAreaSt[this.selectArea - 1] || this.ac.area !== this.ACStupPos;
    }
  },
  async created() {
    const getTestData = () => {
      return new Promise(resolve => {
        setTimeout(() => {
          this.updateDataObject({
            EnvArea1St: 1,
            EnvArea2St: 0,
            EnvArea3St: 0,
            EnvArea4St: 0,
            EnvArea5St: 0,
            EnvArea6St: 0,
            EnvArea7St: 0,
            EnvArea8St: 0,
            EnvArea9St: 0,
            FbidBloPer: 0,
            ACStupPos: 0
          });
          resolve('ok');
        }, 0);
      });
    };
    if (process.env.NODE_ENV === 'development') {
      await getTestData();
    }
  },
  mounted() {
    // 给主页传入图标点击事件
    this.$emit('defaultFunction', this.switchArea);
    this.$nextTick(() => {
      const clientWidth = document.body.clientWidth;
      const acWidth = (186 / 1080) * clientWidth;
      const margin = 0.2 * clientWidth;
      this.moveMax = (clientWidth - margin - acWidth) / 2;
    });
  },
  watch: {
    FbidBloPer: {
      handler(newVal) {
        this.isActive2 = Boolean(newVal);
      },
      immediate: true
    },
    ACStupPos: {
      handler(newVal) {
        const jsonToImshow = {
          0: 0,
          1: -2,
          2: -1,
          3: 2,
          4: 1
        };
        const imshowPos = (jsonToImshow[newVal] * this.moveMax) / 2;
        if (!isNaN(imshowPos) && !this.isSetting) {
          this.$set(this.ac, 'currentPos', imshowPos);
          this.$set(this.ac, 'translateX', 0);
        }
        this.ac.area = newVal;
      },
      immediate: true
    },
    EnvAreaSt: {
      handler(newVal) {
        const selectArea = newVal.findIndex(item => item) + 1;
        if (!this.isSetting) {
          this.selectArea = selectArea;
          this.isActive = Boolean(selectArea);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapMutations('control', {
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions('control', {
      sendCtrl: 'SEND_CTRL',
      updateDataObject: 'UPDATE_DATAOBJECT'
    }),
    // 返回按钮
    turnBack() {
      this.$router.push({ name: 'Home' }).catch(err => {
        err;
      });
    },
    // 保存按钮
    saveBtn() {
      this.switchArea(true);
    },
    // 发送数据
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
    },
    // 开关区域送风
    switchArea(boolean = !this.isActive) {
      const sendData = {
        EnvArea1St: 0,
        EnvArea2St: 0,
        EnvArea3St: 0,
        EnvArea4St: 0,
        EnvArea5St: 0,
        EnvArea6St: 0,
        EnvArea7St: 0,
        EnvArea8St: 0,
        EnvArea9St: 0,
        FbidBloPer: 0
      };
      if (boolean) {
        const storage = window.storage;
        const funcData = storage.get('funcData') || {};
        if (!this.selectArea) {
          // 从关到开，复原到上次设置位置
          let num = 1;
          'EnvAreaSt' in funcData && (num = funcData.EnvAreaSt);
          const key = `EnvArea${num}St`;
          sendData[key] = 1;
        } else {
          // 按照设置的发送
          const key = `EnvArea${this.selectArea}St`;
          sendData[key] = 1;
          funcData.EnvAreaSt = this.selectArea;
          storage.set('funcData', funcData);
        }
        sendData.ACStupPos = this.ac.area;
      }
      this.changeData(sendData);
    },
    // 开关禁止吹人
    switchFbidBloPer(boolean = !this.isActive2) {
      this.changeData({ FbidBloPer: boolean });
    },
    // 拖动开始
    startDrag(e) {
      const touch = e.targetTouches[0];
      this.ac.startX = touch.clientX;
    },
    // 拖动中
    moveDrag(e) {
      const touch = e.targetTouches[0];
      const translateX = touch.clientX - this.ac.startX;
      if (this.fixAcPos(translateX)) {
        this.$set(this.ac, 'translateX', translateX);
      }
    },
    // 拖动结束
    finshDrag() {
      if (this.fixAcPos(this.ac.translateX)) {
        this.$set(this.ac, 'currentPos', this.ac.currentPos + this.ac.translateX);
        this.$set(this.ac, 'translateX', 0);
      }
    },
    // 修正空调位置
    fixAcPos(translateX) {
      const moveMax = this.moveMax;
      const imshowPos = this.ac.currentPos + translateX;
      // 超出范围时回弹
      if (Math.abs(imshowPos) > moveMax) {
        const fixPos = imshowPos > 0 ? moveMax - this.ac.currentPos : -moveMax - this.ac.currentPos;
        this.$set(this.ac, 'translateX', fixPos);
        return false;
      }
      // 计算所在区域
      const area = Math.round((imshowPos / moveMax) * 2);
      const imshowTojson = {
        '-2': 1,
        '-1': 2,
        0: 0,
        1: 4,
        2: 3
      }; // 转换为协议的数值
      this.ac.area = imshowTojson[area];
      return true;
    }
  }
};
</script>

<style lang="scss">
.page-area {
  $headerHeight: 128px;
  .gree-header {
    height: $headerHeight;
    background-color: #fdfdfd;
    border-bottom: 0.5px solid #eee;
  }
  &-tip {
    position: relative;
    font-size: 39px;
    height: 219px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(152, 152, 152, 1);
  }
  &-content {
    position: relative;
    height: 100%;
    width: 100%;
    // display: flex;
    // justify-content: center;
    // align-items: flex-start;
    &-ac {
      $acWidth: 186px;
      position: absolute;
      top: -30px;
      height: 129px;
      width: $acWidth;
      background-image: url('../../assets/img/functionBtn/Area/ac.png');
      background-size: 100% 100%;
      left: calc(50vw - #{$acWidth / 2});
      z-index: 999;
    }
    &-box {
      position: relative;
      height: auto;
      width: auto;
      background-image: url('../../assets/img/functionBtn/Area/bg.png');
      background-size: 870px 100%;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .box-cube {
        width: 290px;
        height: 290px;
        background-color: transparent;
        border: 0.5px solid rgba(255, 255, 255, 0.5);
        &.select {
          background-image: url('../../assets/img/functionBtn/Area/human.png');
          background-size: 165px 192px;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
    }
  }
}
</style>
