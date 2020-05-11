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
            </gree-col>
          </gree-row>
        </div>
        <!-- 模式滑轮 -->
        <modeSwiper v-if="Pow && !loading" key="modeSwiper"/>
      </div>
      <!-- 居中内容提示 -->
      <div class="page-main">
        <gree-notice-bar class="custom-notice-bar" v-if="Pow && PctCle">
          <gree-icon slot="left" name="bell"></gree-icon>
          {{ $language('warn.dirty') }}
        </gree-notice-bar>
        <div 
          v-show="!Pow"
          v-text="$language(`${Air? 'btn.Air' : 'home.powerOff'}`)" 
          class="poweroff-tip"/>
        <!-- 温度滑轮 -->
        <temSwiper v-if="Pow && !loading" key="temSwiper"/>
        <!-- 温度单位图标 -->
        <img :src="temImg" class="tem-unit" @click="changeTemUn" v-show="Pow && Mod">
        <!-- 风档滑轮 -->
        <fanSwiper v-if="Pow && !loading" key="fanSwiper"/>
        <airFanSwiper v-else-if="Air && !loading" key="airFanSwiper"/>
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
import { closePage, editDevice, changeBarColor, getCCcmd, startVoiceMainActivity, showLoading } from '@PluginInterface';
import VConsole from 'vconsole/dist/vconsole.min.js';
import Carousel from '@/components/Carousel';
import PopupBottom from '@/components/PopupBottom';
import homeConfig from '@/mixins/config/home.js';
import LogicDefine from '@/logic/define';
import modeSwiper from '@/components/Swiper/mode';
import temSwiper from '@/components/Swiper/tem';
import fanSwiper from '@/components/Swiper/fan';
import airFanSwiper from '@/components/Swiper/airFan';

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
    fanSwiper,
    airFanSwiper,
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
      WdSpd: state => state.dataObject.WdSpd,
      Air: state => state.dataObject.Air,
      PctCle: state => state.dataObject.PctCle,
    }),
    showPowOff() {
      return !this.Pow;
    },
    power_off_bg() {
      const Hot = this.Mod === this.$store.state.ModHeat;
      return Hot ? require('@/assets/img/bg_off_heat.png') : require('@/assets/img/bg_off_cool.png');
    },
    modName() {
      return this.modeNameList[this.Mod];
    },
    fanName() {
      return this.fanNameList[this.WdSpd];
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
          color = Adv ? '#366BA6' : '#4D99ED';
        }
      }
      return color;
    },
    // 左上角小图标
    miniIcon() {
      const result = [];
      // 从所有功能里面搜索
      this.g_funcDefine.forEach(item => {
        const id = item.identifier;
        // 不处于隐藏状态则显示图标
        if (this.g_hideFuncArr.includes(id)) return;
        const statusName = this.g_statusMap[id].define.name;
        const map = {};
        const imgName = `${item.name}_${statusName}`;
        // 如果有图片就显示图片，没有图片就显示文字
        try {
          map.img = require(`@/assets/img/functionBtn/mini/${imgName}.png`);
        } catch (err) {
          err;
        }
        map.img && result.push(map);
      });
      return result;
    },
    airFanShow() {
      return Boolean(!this.Pow && this.Air);
    },
    hasAir() {
      return this.devOptions.statueJson2.includes('Air');
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
    airFanShow(newVal) {
      if (newVal) {
        // 更新到localStorage
        window.storage.set('WdSpd', this.WdSpd);
        console.log(this.WdSpd);
        console.log(window.storage.get('WdSpd'));
        if (window.storage.get('AirWdSpd') === undefined) {
          this.setState(['watchLock', false]);
          this.setDataObject({ WdSpd: 1 });
          this.sendCtrl({ WdSpd: 1 });
        } else {
          this.setState(['watchLock', false]);
          this.setDataObject({ WdSpd: Number(window.storage.get('AirWdSpd')) });
          this.sendCtrl({ WdSpd: Number(window.storage.get('AirWdSpd')) });
        }
      } else {
        window.storage.set('AirWdSpd', this.WdSpd);
        if (window.storage.get('WdSpd') === undefined) {
          this.setState(['watchLock', false]);
          this.setDataObject({ WdSpd: 0 });
          this.sendCtrl({ WdSpd: 0 });
        } else {
          this.setState(['watchLock', false]);
          this.setDataObject({ WdSpd: Number(window.storage.get('WdSpd')) });
          this.sendCtrl({ WdSpd: Number(window.storage.get('WdSpd')) });
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setCheckObject(this.dataObject);
    });
    if (!this.Pow && this.Air) {
      window.storage.set('AirWdSpd', this.WdSpd);
    } else {
      window.storage.set('WdSpd', this.WdSpd);
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
        this.devOptions.statueJson2
      );
      const p = opt.map(item => {
        return this.dataObject[item];
      });
      const json = JSON.stringify({ opt, p, t: 'cmd' });
      // console.log(p);
      getCCcmd(this.mac, json, remarks, JSON.stringify(p));
    },
    /**
     * @description: 底部功能按钮的点击事件
     */
    footerFunction(key) {
      const setData = {};
      switch (key) {
        case 'Pow':
          setData.Pow = !this.Pow - 0;
          if (this.hasAir) {
            if (this.Pow) {
              setData.Air = 0;
            } else {
              setData.Air = this.Air ? 1 : 3;
            }
          }
          // setData.SwhSlp = 0;
          // setData.SlpMod = 0;
          this.changeData({...setData});
          break;
        case 'Func':
          this.$refs.PopupBottom.showPopup = true;
          break;
        case 'Voice':
          try {
            startVoiceMainActivity(this.mac);
          } catch (e) {
            console.log('%c running startVoiceMainActivity()', 'color: blue');
          }
          break;
        case 'ElcEn':
          this.$router.push({
            name: 'Electric',
          }).catch(err => { console.log(err); });
          try {
            showLoading();
          } catch (e) {
            e;
          }
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
