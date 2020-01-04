setState<template>
  <gree-view>
    <gree-page 
      no-navbar 
      class="page-home">
      <!-- 头部 -->
      <div
        class="page-header"
        :style="{ backgroundImage: 'url(' + head_bg + ')' }"
      >
        <gree-header
          theme="transparent"
          :left-options="{ preventGoBack: true }"
          :right-options="{ showMore: true }"
          @on-click-back="goBack"
          @on-click-more="moreInfo"
        >{{ devname }}</gree-header
        >
        <!-- 设备状态小图标 -->
        <div class="bar-top">
          <gree-row>
            <gree-col>
              <div 
                class="mini-icon"
                v-for="(item, index) in miniIcon" 
                :key="index">
                <img 
                  v-if="item.img"
                  :src="item.img"/>
              </div>
            </gree-col>
          </gree-row>
        </div>
        <!-- 模式滑轮 -->
        <div 
          class="mod-carousel-holder" 
          :class="{ hidden: !Pow }">
          <Carousel
            ref="modCarousel"
            @currentChange="setMod"
            :prop-data="modImgList"
            :options="modOptions"
          />
          <span class="mod-text">{{ modName }}</span>
        </div>
      </div>
      <!-- 居中内容提示 -->
      <div class="page-main">
        <!-- 温度滑轮 -->
        <div 
          class="tem-carousel-holder" 
          :class="{ hidden: !Pow }">
          <div v-if="Mod">
            <Carousel
              ref="temCarousel"
              class="tem-carousel-pos"
              @currentChange="setTemperature"
              :prop-data="temData"
              :options="temOptions"
            ></Carousel>
            <img 
              :src="temImg"
              class="tem-unit" />
          </div>
          <span
            class="auto-text"
            v-show="!Mod">
            <span>{{ $language("mode.mode_auto") }}</span>
          </span>
        </div>
        <!-- 风档滑轮 -->
        <div 
          class="fan-carousel-holder"
          :class="{ hidden: !Pow }">
          <Carousel
            keep-alive
            ref="fanCarousel"
            @currentChange="setFan"
            @touchstart.native="showTip"
            :prop-data="fanImgList"
            :options="fanOptions"
          />
          <span class="rotate-fan">{{ fanName }}</span>
        </div>
      </div>
      <!-- 尾部 -->
      <div class="page-footer">
        <div 
          class="item"
          v-for="(item, index) in functionList" 
          :key="index">
          <img
            :src="item.url"
            @click="footerFunction(index)" />
          <span>{{ item.name }}</span>
        </div>
      </div>
      <!-- 底部弹框 -->
      <PopupBottom ref="PopupBottom" />
      <!-- 关机页面 -->
      <gree-power-off
        v-model="showPowOff"
        text="已关机"
        :style="{ backgroundImage: 'url(' + power_off_bg + ')' }"
      ></gree-power-off>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, PowerOff, Row, Col } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  closePage,
  editDevice,
  showToast
} from '@/../../static/lib/PluginInterface.promise';
import Carousel from '@/components/Carousel';
import PopupBottom from '@/components/PopupBottom';
import CarouselConfig from '@/mixins/config/carousel.js';
import homeConfig from '@/mixins/config/home.js';
import LogicDefine from '@/logic/define';

export default {
  components: {
    [Header.name]: Header,
    [PowerOff.name]: PowerOff,
    [Row.name]: Row,
    [Col.name]: Col,
    Carousel,
    PopupBottom
  },
  mixins: [homeConfig, CarouselConfig, LogicDefine],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      devname: state => state.deviceInfo.name,
      functype: state => state.functype,
      mac: state => state.mac,
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
      SetTem: state => state.dataObject.SetTem,
      WdSpd: state => state.dataObject.WdSpd
    }),
    showPowOff() {
      return !this.Pow;
    },
    head_bg() {
      return require('@/assets/img/bg_header_on.png');
    },
    power_off_bg() {
      return require('@/assets/img/bg_off.png');
    },
    modName() {
      return this.modeNameList[this.Mod];
    },
    fanName() {
      return this.fanNameList[this.WdSpd];
    },
    /**
     * @description 摄氏度图片（可添加华氏度）
     */
    temImg() {
      return require('@/assets/img/c.png');
    },
    miniIcon() {
      const result = [];
      this.g_funcDefine.forEach(item => {
        const id = item.identifier;
        const statusName = this.g_statusMap[id].define.name;
        const map = {};
        const imgName = `${item.name}_${statusName}`;
        // 如果有图片就显示图片，没有图片就显示文字
        try {
          map.img = require(`@/assets/img/functionBtn/mini/${imgName}.png`);
        } catch (err) {
          err;
        }
        result.push(map);
      });
      return result;
    }
  },
  watch: {
    Mod: {
      handler(newVal) {
        this.$nextTick(() => {
          this.$refs.modCarousel.setId(newVal);
        });
      },
      immediate: true
    },
    SetTem: {
      handler(newVal) {
        const num = this.temData.indexOf(newVal);
        this.$nextTick(() => {
          if (this.Mod) {
            this.$refs.temCarousel.setId(num);
          }
        });
      },
      immediate: true
    },
    WdSpd: {
      handler(newVal) {
        this.$nextTick(() => {
          this.$refs.fanCarousel.setId(newVal);
        });
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setCheckObject(this.dataObject);
    });
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setCheckObject: 'SET_CHECK_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(val) {
      this.setState(['watchLock', false]);
      this.setDataObject(val);
      this.sendCtrl(val);
    },
    /**
     * @description 返回键
     */
    goBack() {
      closePage();
    },
    /**
     * @description 编辑设备名称
     */
    moreInfo() {
      editDevice(this.mac);
    },
    /**
     * @description: 底部功能按钮的点击事件
     */
    footerFunction(index) {
      switch (index) {
        case 0:
          this.changeData({ Pow: !this.Pow - 0 });
          break;
        case 1:
          this.$refs.PopupBottom.showPopup = true;
          break;
        case 2:
          break;
        default:
          break;
      }
    },
    /**
     * @description 滑轮不可滑动时弹出提示
     */
    showTip() {
      if (this.fanOptions.controlAble === false) {
        const tip = `mode.fan_${this.fanNameList[this.Mod]}_tips`.toLowerCase();
        showToast(this.$language(tip), 0);
      }
    },
    /**
     * @description 循环滑轮设置
     */
    setMod(val) {
      this.changeData({ Mod: val });
    },
    /**
     * @description 温度滑轮设置
     */
    setTemperature(val) {
      const temNum = this.temData[val];
      const set05 = val % 2;
      const setData = {};
      if (temNum !== this.SetTem || (set05 !== this.Add05 && this.Has05)) {
        setData.SetTem = temNum;
        this.Has05 ? (setData.Add05 = set05) : '';
        this.changeData(setData);
      }
    },
    /**
     * @description 风速滑轮设置
     */
    setFan(val) {
      const setData = {};
      for (let i = 0; i < this.fanData[val][0].length; i += 1) {
        const state = this.fanData[val][0][i];
        const num = this.fanData[val][1][i];
        setData[state] = num;
      }
      this.changeData(setData);
    }
  }
};
</script>
