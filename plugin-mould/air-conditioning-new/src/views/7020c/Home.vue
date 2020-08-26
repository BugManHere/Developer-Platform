<template>
  <gree-view :bg-color="statusBarColor">
    <gree-page class="page-home">
      <gree-header
        :left-options="{preventGoBack: true}"
        @on-click-back="goBack"
        :right-options="{showMore: true}"
        @on-click-more="moreInfo"
      >{{ devname }}</gree-header>
      <div
        class="page-main"
        :class="{grayscale: RemoteStatus === 'OFF'}"
        :style="{backgroundColor: rgbaString}"
      >
        <div ref="picker"></div>
        <svg class="hidden">
          <defs>
            <g id="handle">
              <circle
                r="12"
                fill="none"
                stroke-width="2"
                stroke="#fff"
              />
              <circle
                r="11"
                fill="none"
                stroke-width="2"
                stroke="#fff"
              />
            </g>
          </defs>
        </svg>
      </div>
      <gree-block>
        <i class="light-off"></i>
        <vue-slider
          :disabled="sliderDisabled"
          v-model="light"
          :width="370"
          :height="7"
          :dot-size="24"
          :dot-options="dotOptions"
          :min="0"
          :max="100"
          :interval="1"
          :tooltip="'always'"
          :tooltip-placement="'top'"
          :tooltip-formatter="'{value}%'"
          :clickable="false"
          @dragging="sliderDragging"
          @drag-end="sliderDragEnd"
        ></vue-slider>
        <i class="light-on"></i>
      </gree-block>
    </gree-page>
    <!-- 底部按钮 -->
    <gree-toolbar
      position="bottom"
      no-hairline
    >
      <gree-row>
        <gree-col
          :width="25"
          v-for="(item, index) in FootList"
          :key="index"
          @click.native="setFunction(index)"
        >
          <div class="icon">
            <img :src="require('@/assets/img/' + item.ImgName + '.png')" />
          </div>
          <h3>{{ $language(item.Name) }}{{ item.Title }}</h3>
        </gree-col>
      </gree-row>
    </gree-toolbar>
  </gree-view>
</template>

<script>
import { Header, List, Item, Block, Row, Col, Icon, ToolBar } from 'gree-ui';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import { mapState, mapMutations, mapActions } from 'vuex';
import homeConfig from '@/mixins/config/7020c/home';
import iro from '@jaames/iro';
import { debounce } from 'lodash';
import {
  closePage,
  editDevice
} from '../../../../static/lib/PluginInterface.promise';

export default {
  components: {
    [Header.name]: Header,
    [List.name]: List,
    [Item.name]: Item,
    [Block.name]: Block,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [ToolBar.name]: ToolBar,
    VueSlider
  },
  mixins: [homeConfig],
  data() {
    return {
      statusBarColor: '#f4f4f4',
      colorPicker: null,
      rgbaString: '', // 展示的rgba背景颜色值
      color: {}, // 颜色值对象
      dotOptions: {
        style: {
          backgroundColor: '#ffba00',
          boxShadow: 'none'
        },
        focusStyle: {
          boxShadow: '0 0 0 5px rgba(255, 248, 229, 0.76)'
        }
      },
      light: 100, // 亮度
      alpha: 1, // 亮度值
      sliderDisabled: false
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      devname: state => state.deviceInfo.name,
      functype: state => state.functype,
      mac: state => state.mac,
      RemoteStatus: state => state.dataObject.RemoteStatus
    })
  },
  watch: {
    RemoteStatus: {
      handler(val) {
        this.sliderDisabled = Boolean(val === 'OFF');
      },
      immediate: true
    }
  },
  created() {
    this.light = this.dataObject.brightness;
  },
  mounted() {
    const { hue, saturation, light } = this.dataObject.color;
    this.colorPicker = new iro.ColorPicker(this.$refs.picker, {
      width: window.screen.width * 0.56,
      color: `hsl(${hue}, ${saturation}%, ${light}%)`,
      borderWidth: 0,
      padding: 0,
      handleSvg: '#handle',
      handleRadius: 10,
      sliderMargin: 135,
      sliderHeight: 12,
      wheelAngle: 240,
      wheelDirection: 'clockwise',
      wheelLightness: false,
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            borderColor: null
          }
        }
      ]
    });
    this.colorPicker.on('color:init', this.onColorInit);
    this.colorPicker.on('color:change', this.onColorChange);
    this.colorPicker.on('input:end', this.onColorInputEnd);
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
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
    // 初始颜色值触发一次
    onColorInit(color) {
      this.color = color;
      this.rgbaString = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    },
    // 颜色发生更改时触发
    onColorChange(color) {
      this.color = color;
      this.rgbaString = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${this.alpha})`;
    },
    // 停止交互时触发
    onColorInputEnd() {
      console.log(this.color.rgb);
    },
    // Slider拖拽回调
    sliderDragging(val) {
      if (Object.keys(this.color).length > 0) {
        this.alpha = parseFloat(val / 100);
        this.rgbaString = `rgba(${this.color.rgb.r}, ${this.color.rgb.g}, ${this.color.rgb.b}, ${this.alpha})`;
      }
    },
    // Slider拖拽结束回调
    sliderDragEnd() {
      console.log(this.alpha);
    },
    /**
     * @description 点击底部功能列表
     */
    /* eslint func-names: off */
    setFunction: debounce(function (val) {
      switch (val) {
        case 0:
          this.dataObject.RemoteStatus === 'ON'
            ? this.sendCtrl({ RemoteStatus: 'OFF' })
            : this.sendCtrl({ RemoteStatus: 'ON' });
          this.dataObject.RemoteStatus === 'ON'
            ? this.setDataObject({ RemoteStatus: 'OFF' })
            : this.setDataObject({ RemoteStatus: 'ON' });
          break;
        default:
          break;
      }
    }, 300)
  }
};
</script>
