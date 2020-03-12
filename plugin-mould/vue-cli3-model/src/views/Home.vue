<template>
  <gree-view :bg-color="colorChange">
    <gree-page 
      no-navbar 
      class="page-home">
      <!-- 头部 -->
      <div 
        class="page-header" 
        :style="{backgroundImage: 'url(' + `${require('@/assets/img/mode/mode_bg.png')}` + ')', 'background-size': '500% 100%', 'background-position': `${Mod * 25}% 0%`}">
        <gree-header 
          theme="transparent"
          :left-options="{ preventGoBack: true }" 
          :right-options="{ showMore: !functype }" 
          @on-click-back="goBack" 
          @on-click-more="moreInfo">
          {{ devname }}
          <a 
            class="save"
            slot="right" 
            v-if="functype"
            @click="sceneSave">
            保存
          </a>
        </gree-header>
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
                  :src="item.img" />
              </div>
            </gree-col>
          </gree-row>
        </div>
        <!-- 模式滑轮 -->
        <modeSwiper v-if="Pow" />
      </div>
      <!-- 居中内容提示 -->
      <div class="page-main">
        <div 
          v-show="!Pow"
          v-text="$language(`${Air? 'btn.Air' : 'home.powerOff'}`)" 
          class="poweroff-tip"/>
        <!-- 温度滑轮 -->
        <temSwiper v-if="Pow"/>
        <!-- 风档滑轮 -->
        <fanSwiper v-if="Pow" />
        <airFanSwiper v-else-if="Air" />
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
        :style="{ backgroundImage: 'url(' + power_off_bg + ')' }" />
    </gree-page>
  </gree-view>
</template>

<script>

import { Header, PowerOff, Row, Col } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { closePage, editDevice, showToast, changeBarColor, getCCcmd } from '@PluginInterface';
import Carousel from '@/components/Carousel';
import PopupBottom from '@/components/PopupBottom';
import homeConfig from '@/mixins/config/home.js';
import LogicDefine from '@/logic/define';
import modeSwiper from '@/components/Swiper/mode';
import temSwiper from '@/components/Swiper/tem';
import fanSwiper from '@/components/Swiper/fan';
import airFanSwiper from '@/components/Swiper/airFan';

const imgList = [
  require('@/assets/img/mode/bg_auto.png'),
  require('@/assets/img/mode/bg_cool.png'),
  require('@/assets/img/mode/bg_dry.png'),
  require('@/assets/img/mode/bg_fan.png'),
  require('@/assets/img/mode/bg_heat.png')
];

export default {
  components: {
    [Header.name]: Header,
    [PowerOff.name]: PowerOff,
    [Row.name]: Row,
    [Col.name]: Col,
    Carousel,
    PopupBottom,
    modeSwiper,
    temSwiper,
    fanSwiper,
    airFanSwiper,
  },
  mixins: [homeConfig, LogicDefine],
  data() {
    return {
      imgList
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      devname: state => state.deviceInfo.name,
      functype: state => state.dataObject.functype,
      mac: state => state.mac,
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
      SetTem: state => state.dataObject.SetTem,
      WdSpd: state => state.dataObject.WdSpd,
      Air: state => state.dataObject.Air,
    }),
    showPowOff() {
      return !this.Pow;
    },
    head_bg() {
      return imgList[this.Mod];
    },
    power_off_bg() {
      const Hot = this.Mod === this.$store.state.ModHeat;
      return Hot ? require('@/assets/img/bg_off_heat.png') : require('@/assets/img/bg_off.png');
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
    /**
     * @description 主页面下更新状态栏颜色
     */
    colorChange() {
      const Pow = this.Pow;
      const Hot = this.Mod === this.$store.state.ModHeat;
      const Adv = this.$refs.PopupBottom ? this.$refs.PopupBottom.showPopup : false;
      let color = '#000';
      if (this.$route.name === 'Home') {
        if (Pow) {
          if (Hot) {
            color = Adv ? '#AE7022' : '#f9a130';
          } else {
            color = Adv ? '#4C719E' : '#6da2e2';
          }
        } else if (Hot) {
          color = Adv ? '#AC6502' : '#f78d00';
        } else {
          color = Adv ? '#4C719E' : '#6ba0e2';
        }
      }
      changeBarColor(color);
      return color;
    },
    miniIcon() {
      const result = [];
      this.g_funcDefine.forEach(item => {
        const id = item.identifier;
        if (!this.Pow && this.powHideArr.includes(id)) return;
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
    },
    airFanShow() {
      return Boolean(!this.Pow && this.Air);
    }
  },
  watch: {
    airFanShow(newVal) {
      if (newVal) {
        localStorage.WdSpd = this.WdSpd;
        if (localStorage.AirWdSpd === undefined) {
          this.setState(['watchLock', false]);
          this.setDataObject({ WdSpd: 1 });
          this.sendCtrl({ WdSpd: 1 });
        } else {
          this.setState(['watchLock', false]);
          this.setDataObject({ WdSpd: Number(localStorage.AirWdSpd) });
          this.sendCtrl({ WdSpd: Number(localStorage.AirWdSpd) });
        }
      } else {
        localStorage.AirWdSpd = this.WdSpd;
        if (localStorage.WdSpd === undefined) {
          this.setState(['watchLock', false]);
          this.setDataObject({ WdSpd: 0 });
          this.sendCtrl({ WdSpd: 0 });
        } else {
          this.setState(['watchLock', false]);
          this.setDataObject({ WdSpd: Number(localStorage.WdSpd) });
          this.sendCtrl({ WdSpd: Number(localStorage.WdSpd) });
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setCheckObject(this.dataObject);
    });
    if (!this.Pow && this.Air) {
      localStorage.AirWdSpd = this.WdSpd;
    } else {
      localStorage.WdSpd = this.WdSpd;
    }
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
        process.env.VUE_APP_JSON
      );
      const p = opt.map(item => {
        return this.dataObject[item];
      });
      const json = JSON.stringify({ opt, p, t: 'cmd' });
      console.log(json);
      getCCcmd(this.mac, json, remarks, JSON.stringify(p));
    },
    /**
     * @description: 底部功能按钮的点击事件
     */
    footerFunction(index) {
      const setData = {};
      switch (index) {
        case 0:
          setData.Pow = !this.Pow - 0;
          if (this.Pow) {
            setData.Air = 0;
          } else {
            setData.Air = this.Air ? 1 : 3;
          }
          this.changeData(setData);
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
    setTemperature(even) {
      console.log(even);
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
    },
  }
};
</script>
