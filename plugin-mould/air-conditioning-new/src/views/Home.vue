<template>
  <gree-view class="test">
    <gree-page class="page-home">
      <gree-header :left-options="{ preventGoBack: true }" @on-click-back="goBack" :right-options="{ showMore: true }" @on-click-more="moreInfo">
        空调
      </gree-header>
      <div class="page-main">
        <div v-show="Pow">
          <div id="slider"></div>
          <div class="layer" :style="{ width: lottieRadius / 1.88 + 'px', height: lottieRadius / 1.88 + 'px' }">
            <div class="rotate -one"></div>
            <div class="rotate -two"></div>
            <div class="play"></div>
          </div>
          <article>
            <gree-block>
              <div class="left">
                <span>{{['自动','制冷','除湿','送风','制热'][Mod]}}</span>
              </div>
              <div class="bar"/>
              <div class="right">
                <span>{{['自动风','低风','中低风','中风','中高风','高风','强风','静音'][WdSpd]}}</span>
              </div>
            </gree-block>
            <h3>{{ circleVal }}</h3>
          </article>
        </div>
        <div class="pow-off" v-show="!Pow" :style="{ width: svgRadius + 40 + 'px', height: svgRadius + 40 + 'px' }">
          <img src="@assets/img/off_bg.png">
          <h3 v-text="'已关机'"/>
        </div>
      </div>
      <gree-block>
        <gree-row>
          <gree-col>
            <gree-icon name="bulb" color="black" size="lg" svg />
          </gree-col>
          <gree-col>
            <gree-icon name="tree" color="black" size="lg" svg />
          </gree-col>
          <gree-col>
            <gree-icon name="bugle" color="black" size="lg" svg />
          </gree-col>
        </gree-row>
      </gree-block>
    </gree-page>
    <!-- 底部按钮 -->
    <gree-toolbar position="bottom" no-hairline>
      <gree-row>
        <div class="pow-button" :class="{off: !Pow - 0}" @click="changeData({Pow: !Pow - 0})">
          <span class="iconfont icon-kaiguan" />
          <div class="button-boder"/>
          <div class="ripple" v-show="!Pow"/>
        </div>
        <gree-col @click.native="showPopUp('ModPopup', Pow)" :class="{gray: !Pow}">
            <gree-icon name="mode" color="black" size="lg" svg />
          <h3>模式</h3>
        </gree-col>
        <gree-col @click.native="showPopUp('FanPopup', Pow)" :class="{gray: !Pow}">
            <gree-icon name="wind-speed" color="black" size="lg" svg />
          <h3>风速</h3>
        </gree-col>
        <gree-col>
            <gree-icon name="subscribe" color="black" size="lg" svg />
          <h3>预约</h3>
        </gree-col>
        <gree-col @click.native="showPopUp('FuncPopup', true)">
            <gree-icon name="advanced" color="black" size="lg" svg />
          <h3>高级</h3>
        </gree-col>
      </gree-row>
      <!-- <gree-row>
      </gree-row> -->
    </gree-toolbar>
    <!-- 底部弹框 -->
    <FuncPopup ref="FuncPopup" />
    <ModPopup ref="ModPopup" />
    <FanPopup ref="FanPopup" />
  </gree-view>
</template>

<script>
import { Header, List, Item, Block, Row, Col, Button, Icon, ToolBar } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import FuncPopup from '@/components/FuncPopup';
import ModPopup from '@/components/ModPopup';
import FanPopup from '@/components/FanPopup';
import '@assets/icons/voice.svg';
import '@assets/icons/snow.svg';
import '@assets/icons/high-wind.svg';
import '@assets/icons/bulb.svg';
import '@assets/icons/tree.svg';
import '@assets/icons/bugle.svg';
import '@assets/icons/mode.svg';
import '@assets/icons/wind-speed.svg';
import '@assets/icons/subscribe.svg';
import '@assets/icons/advanced.svg';
import { closePage, editDevice } from '@PluginInterface';

export default {
  components: {
    [Header.name]: Header,
    [List.name]: List,
    [Item.name]: Item,
    [Block.name]: Block,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [ToolBar.name]: ToolBar,
    FuncPopup,
    ModPopup,
    FanPopup,
  },
  data() {
    return {
      svgRadius: 0,
      lottieRadius: 0,
      circleVal: 26
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
      WdSpd: state => state.dataObject.WdSpd,
      devname: state => state.deviceInfo.name,
      functype: state => state.functype,
      mac: state => state.mac
    })
  },
  created() {
    this.svgRadius = window.screen.width * 0.7;
    this.lottieRadius = this.svgRadius * 1.8;
  },
  mounted() {
    this.$nextTick(() => {
      this.setCheckObject(this.dataObject);
    });
    // init circular slider
    this.circleObj = $('#slider').roundSlider({
      min: 16,
      max: 30,
      step: 1,
      value: this.circleVal,
      radius: this.svgRadius / 2 + 20,
      width: 2,
      handleSize: '+46',
      keyboardAction: false,
      startAngle: -60,
      endAngle: '+300',
      sliderType: 'min-range',
      circleShape: 'full',
      handleShape: 'dot',
      start: () => {
        $('span.rs-block').css('padding', '4px');
      },
      stop: () => {
        $('span.rs-block').css('padding', '2px');
      },
      drag: e => {
        this.circleVal = e.value;
      },
      change: e => {
        this.circleVal = e.value;
      }
    });
  },
  methods: {
    ...mapMutations({
      setCheckObject: 'SET_CHECK_OBJECT',
      setDataObject: 'SET_DATA_OBJECT'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(obj) {
      this.setDataObject(obj);
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
    showPopUp(key, able) {
      able && (this.$refs[key].showPopup = true);
    }
  }
};
</script>
