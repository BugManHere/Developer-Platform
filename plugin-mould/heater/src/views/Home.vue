<template>
  <gree-view :bg-color="colorChange">
    <gree-page 
      no-navbar 
      class="page-home">
      <!-- 头部 -->
      <div 
        class="page-header" 
        :style="{backgroundImage: 'url(' + `${require('@/assets/img/mode/bg_head.png')}` + ')'}">
        <gree-header 
          theme="transparent"
          :left-options="{ preventGoBack: true }" 
          :right-options="{ showMore: !functype }" 
          @on-click-back="goBack" 
          @on-click-more="moreInfo">
          <span 
            v-text="devname" 
            @click="onTest('stepOne')"/>
          <a 
            class="save"
            slot="right" 
            v-if="functype"
            @click="sceneSave">
            保存
          </a>
        </gree-header>
        <!-- 设备状态小图标 -->
        <div 
          class="bar-top" 
          @click="onTest('stepTwo')">
          <gree-row>
            <gree-col>
              <div 
                class="mini-icon"
                v-for="(item, index) in miniIcon" 
                :key="index">
                <img 
                  v-if="item.img"
                  :src="item.img" />
              </div>
              <span v-text="timerTxt" class="timer-text"/>
            </gree-col>
          </gree-row>
        </div>
        <!-- 模式滑轮 -->
        <modeSwiper v-if="Pow && !loading" key="modeSwiper"/>
      </div>
      <!-- 居中内容提示 -->
      <div class="page-main">
        <div 
          v-show="!Pow"
          v-text="$language('home.powerOff')" 
          class="poweroff-tip"/>
        <!-- 温度滑轮 -->
        <temSwiper v-if="Pow && !loading" key="temSwiper"/>
        <!-- 温度单位图标 -->
        <img :src="temImg" class="tem-unit" @click="changeTemUn" v-show="Pow && Mod">
      </div>
      <!-- 尾部 -->
      <div class="page-footer">
        <div 
          class="item"
          v-for="(item, index) in functionList" 
          :key="index">
          <img
            :src="item.url"
            @click="footerFunction(item.key)" />
          <span>{{ item.name }}</span>
        </div>
      </div>
      <!-- 底部弹框 -->
      <PopupBottom ref="PopupBottom" />
      <!-- 关机页面 -->
      <gree-power-off
        v-model="showPowOff" 
        :style="{ backgroundImage: 'url(' + power_off_bg + ')' }" />
    </gree-page>
  </gree-view>
</template>

<script>

import { Header, PowerOff, Row, Col, NoticeBar, Icon } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { closePage, editDevice, changeBarColor, getCCcmd } from '@PluginInterface';
import VConsole from 'vconsole/dist/vconsole.min.js';
import Carousel from '@/components/Carousel';
import PopupBottom from '@/components/PopupBottom';
import homeConfig from '@/mixins/config/home.js';
import LogicDefine from '@/logic/define';
import modeSwiper from '@/components/Swiper/mode';
import temSwiper from '@/components/Swiper/tem';

export default {
  components: {
    [Header.name]: Header,
    [PowerOff.name]: PowerOff,
    [Row.name]: Row,
    [Col.name]: Col,
    [NoticeBar.name]: NoticeBar,
    [Icon.name]: Icon,
    Carousel,
    PopupBottom,
    modeSwiper,
    temSwiper,
  },
  mixins: [homeConfig, LogicDefine],
  data() {
    return {
      onTestFlag: 0,
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      devOptions: state => state.devOptions,
      devname: state => state.deviceInfo.name,
      functype: state => state.dataObject.functype,
      mac: state => state.mac,
      loading: state => state.loading,
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
      SetTem: state => state.dataObject.SetTem,
      TemUn: state => state.dataObject.TemUn,
      TmrOn: state => state.dataObject.TmrOn,
      TmrHour: state => state.dataObject.TmrHour,
      TmrMin: state => state.dataObject.TmrMin,
    }),
    showPowOff() {
      return !this.Pow;
    },
    power_off_bg() {
      return require('@/assets/img/bg_off.png');
    },
    /**
     * @description 摄氏度图片
     */
    temImg() {
      if (this.TemUn) return require('@/assets/img/f.png');
      return require('@/assets/img/c.png');
    },
    /**
     * @description 主页面下更新状态栏颜色
     */
    colorChange() {
      let color = '#fd9731';
      return color;
    },
    miniIcon() {
      const result = [];
      let timerImg = false; // 定时的图片
      this.g_funcDefine.forEach(item => {
        const id = item.identifier;
        if (!this.Pow && this.powHideArr.includes(id)) return;
        const statusName = this.g_statusMap[id].define.name;
        const map = {};
        const imgName = `${item.name}_${statusName}`;
        // 如果有图片就显示图片，没有图片就显示文字
        try {
          map.img = require(`@/assets/img/functionBtn/mini/${imgName}.png`);
          // 定时的小图标要单独显示
          ['Timer', 'TimerBtn'].includes(id) && (timerImg = map.img) && (map.img = false);
        } catch (err) {
          err;
        }
        map.img && result.push(map);
      });
      // 定时的小图标要单独显示
      timerImg && result.push({img: timerImg});
      return result;
    },
    timerTxt() {
      if (!this.TmrOn) return '';
      let hourTxt = this.TmrHour ? `${this.TmrHour}${this.$language('home.hour')}` : '';
      let minTxt = this.TmrMin ? `${this.TmrMin}${this.$language('home.min')}` : '';
      return `${hourTxt}${minTxt}${this.$language('home.close')}`;
    }
  },
  watch: {
    colorChange: {
      handler(newVal) {
        if (newVal && newVal !== '#000' && newVal !== '#000000') {
          changeBarColor(newVal);
        }
      },
      immediate: true
    },
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
      this.setState(['ableSend', true]);
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
    // 场景模式保存按钮
    sceneSave() {
      const remarks = '...';
      const opt = JSON.parse(
        this.devOptions.statueJson2
      );
      const p = opt.map(item => {
        return this.dataObject[item];
      });
      const json = JSON.stringify({ opt, p, t: 'cmd' });
      getCCcmd(this.mac, json, remarks, JSON.stringify(p));
    },
    /**
     * @description: 底部功能按钮的点击事件
     */
    footerFunction(key) {
      switch (key) {
        case 'Pow':
          this.changeData({Pow: !this.Pow - 0});
          break;
        case 'Func':
          this.$refs.PopupBottom.showPopup = true;
          break;
        case 'Timer':
          this.$router.push({
            name: 'Timer',
          }).catch(err => { console.log(err); });
          break;
        default:
          break;
      }
    },
    // 切换温度单位
    changeTemUn() {
      this.g_moreOption.temUnChange && this.changeData({TemUn: !this.TemUn - 0});
    },
    // 点击10次进入调试模式
    onTest(key) {
      switch (key) {
        case 'stepOne':
          this.onTestFlag >= 10 ? this.onTestFlag = 0 : (this.onTestFlag += 1);
          break;
        case 'stepTwo':
          this.onTestFlag < 10 ? this.onTestFlag = 0 : this.onTestFlag += 1;
          break;
        default:
          this.onTestFlag = 0;
          break;
      }
      if (this.onTestFlag === 20) {
        new VConsole();
      }
    },
  }
};
</script>
