<template>
  <gree-view :bg-color="colorChange">
    <gree-page no-navbar class="page-home">
      <!-- 头部 -->
      <div class="page-header" :style="headerBg">
        <gree-header
          theme="transparent"
          :left-options="{ preventGoBack: true }"
          :right-options="{ showMore: !functype }"
          @on-click-back="goBack"
          @on-click-more="moreInfo"
        >
          <span v-text="devname" @click="onTest" />
          <a class="save" slot="right" v-if="functype" @click="sceneSave">
            保存
          </a>
        </gree-header>
        <!-- 设备状态小图标 -->
        <div class="bar-top">
          <gree-row>
            <gree-col>
              <div class="mini-icon" v-for="(item, index) in miniIcon" :key="index">
                <img v-if="item.img" :src="item.img" />
              </div>
            </gree-col>
          </gree-row>
        </div>
        <div class="bar-co2" v-if="!functype && Air && identifierArr.includes('CO2') && hasAir">
          <img :src="co2Img" />
          <span v-text="'CO2浓度等级'" @click="showCO2" />
        </div>
        <!-- 模式滑轮 -->
        <modeSwiper v-if="Pow && !loading" key="modeSwiper" @modeKey="getModeName" />

        <!-- 故障提示 -->
        <gree-notice-bar scrollable v-show="errStatus" class="notice-bar" icon="warning" v-text="errMsg">
          <router-link to="/Error">
            <span class="err-detail">
              查看详情
            </span>
          </router-link>
        </gree-notice-bar>
      </div>
      <!-- 居中内容提示 -->
      <div class="page-main">
        <gree-notice-bar class="custom-notice-bar" v-if="Pow && warnningText">
          <gree-icon slot="left" name="bell"></gree-icon>
          {{ warnningText }}
        </gree-notice-bar>
        <div v-show="!Pow" v-text="$language(`${hasAir && Air ? 'btn.Air' : 'home.powerOff'}`)" class="poweroff-tip" />
        <!-- 温度滑轮 -->
        <temSwiper v-if="Pow && !loading" key="temSwiper" />
        <!-- 温度单位图标 -->
        <img :src="temImg" class="tem-unit" @click="changeTemUn" v-show="Pow && ![0, 5].includes(Mod)" />
        <!-- 室内温度 -->
        <div class="room-tem" v-text="`当前温度${TemSen - 40}℃`" v-if="hasTemSen" />
        <!-- 风档滑轮 -->
        <fanSwiper v-if="Pow && !loading" key="fanSwiper" :mode-key="modeKey" />
        <airFanSwiper v-else-if="hasAir && Air && !loading" key="airFanSwiper" />
      </div>
      <!-- 尾部 -->
      <div class="page-footer">
        <div class="item" v-for="(item, index) in functionList" :key="index">
          <img :src="item.url" @click="footerFunction(item.key)" />
          <span>{{ item.name }}</span>
        </div>
      </div>
      <!-- 底部弹框 -->
      <PopupBottom ref="PopupBottom" />
      <!-- 关机页面 -->
      <gree-power-off v-model="showPowOff" :style="backgroundStyle" />
      <!-- CO2浓度查看 -->
      <gree-dialog v-model="dialogOpen" :mask-closable="true" class="dialog-co2">
        <div class="dialog-co2-header">
          <img :src="currentCO2Img" />
          <span v-text="`CO2浓度 ${currentCO2}ppm`" />
        </div>
        <div class="dialog-co2-content">
          <span v-text="'优：CO2浓度较低，建议继续保持。'" />
          <span v-text="'中：CO2浓度中等，建议继续保持或升高风档。'" />
          <span v-text="'差：CO2浓度较高，建议升高风档，或适当打'" />
          <span v-text="'开门窗。'" />
        </div>
      </gree-dialog>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, PowerOff, Row, Col, NoticeBar, Icon, Dialog } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  closePage,
  editDevice,
  changeBarColor,
  getCCcmd,
  startVoiceMainActivity,
  showLoading,
  getCurrentMode
  // getMsg
} from '@PluginInterface';
import VConsole from 'vconsole/dist/vconsole.min.js';
import Carousel from '@/components/Carousel';
import PopupBottom from '@/components/PopupBottom';
import homeConfig from '@/mixins/config/home.js';
import LogicDefine from '@/logic/define';
import modeSwiper from '@/components/Swiper/mode';
import temSwiper from '@/components/Swiper/tem';
import fanSwiper from '@/components/Swiper/fan';
import airFanSwiper from '@/components/Swiper/airFan';
import errorConfig from '@/mixins/utils/error';

export default {
  components: {
    [Header.name]: Header,
    [PowerOff.name]: PowerOff,
    [Row.name]: Row,
    [Col.name]: Col,
    [NoticeBar.name]: NoticeBar,
    [Dialog.name]: Dialog,
    [Icon.name]: Icon,
    Carousel,
    PopupBottom,
    modeSwiper,
    temSwiper,
    fanSwiper,
    airFanSwiper
  },
  mixins: [homeConfig, LogicDefine, errorConfig],
  data() {
    return {
      onTestFlag: 0,
      dialogOpen: false,
      currentCO2: 0,
      currentCO2Level: 0,
      currentCO2Img: '',
      warnningText: false,
      modeKey: ''
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      devOptions: state => state.devOptions,
      identifierArr: state => state.devOptions.identifierArr,
      devname: state => state.deviceInfo.name,
      functype: state => state.dataObject.functype,
      mac: state => state.mac,
      loading: state => state.loading,
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
      SetTem: state => state.dataObject.SetTem,
      TemUn: state => state.dataObject.TemUn && 0,
      TemSen: state => state.dataObject.TemSen,
      WdSpd: state => state.dataObject.WdSpd,
      Air: state => state.dataObject.Air,
      CO2: state => state.dataObject.CO2,
      CO2Level: state => state.dataObject.CO2Level
    }),
    isB() {
      return ['10f04'].includes(this.devOptions.mid); // B分体特殊ui
    },
    headerBg() {
      if (!this.Pow) return {};
      const isB = this.isB;
      const backgroundImage = `url(${require(`@/assets/img/mode/${isB ? 'bg_b' : 'mode_bg'}.png`)})`;
      return {
        backgroundImage,
        'background-size': `${isB ? 1 : 5}00% 100%`,
        'background-position': `${isB ? 0 : (this.Mod % 5) * 25}% 0%`
      };
    },
    showPowOff() {
      return !this.Pow;
    },
    backgroundStyle() {
      const Hot = this.Mod === this.$store.state.ModHeat;
      return this.isB
        ? {
            backgroundImage: `url(${require('@/assets/img/mode/bg_b_off.png')})`
          }
        : {
            backgroundImage: `url(${require(`@/assets/img/bg_off_${Hot ? 'heat' : 'cool'}.png`)})`
          };
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
    // 二氧化碳浓度图片
    co2Img() {
      const CO2Level = this.dialogOpen ? this.currentCO2Level : this.CO2Level;
      switch (CO2Level) {
        case 1:
          return require('@/assets/img/good.png');
        case 2:
          return require('@/assets/img/medium.png');
        case 3:
          return require('@/assets/img/bad.png');
        default:
          return require('@/assets/img/good.png');
      }
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
        if (this.isB) {
          if (Pow) {
            color = Adv ? '#1B7BA0' : '#27B0E5';
          } else {
            color = Adv ? '#1E7C9E' : '#2BB2E3';
          }
        } else if (Pow) {
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
      return Boolean(!this.Pow && this.Air && this.hasAir);
    },
    hasAir() {
      return this.identifierArr.includes('Air') || this.identifierArr.includes('Air(base)');
    },
    hasTemSen() {
      const statueJson2 = JSON.parse(this.devOptions.statueJson2);
      return statueJson2.includes('TemSen');
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
      if (!this.$store.state.ableSend) return;
      if (newVal) {
        // 更新到localStorage
        window.storage.set('WdSpd', this.WdSpd);
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
      const removeJson = (inputArr, removeJsonArr) => {
        removeJsonArr.forEach(json => {
          const index = inputArr.indexOf(json);
          if (index !== -1) {
            inputArr.splice(index, 1);
          }
        });
      };
      const removeArr = ['AppTimer', 'vender'];
      const remarks = '...';
      const opt = JSON.parse(this.devOptions.statueJson2);
      removeJson(opt, removeArr);
      console.log(opt);
      const p = opt.map(item => {
        return this.dataObject[item] === undefined ? 0 : this.dataObject[item];
      });

      const json = JSON.stringify({ opt, p, t: 'cmd' });
      console.log(json);
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
          setData.Dazzling = !this.Pow - 0;
          if (this.hasAir) {
            if (this.Pow) {
              setData.Air = 0;
            } else {
              setData.Air = this.Air ? 1 : 3;
            }
          }
          this.changeData({ ...setData });
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
          this.$router
            .push({
              name: 'Electric'
            })
            .catch(err => {
              console.log(err);
            });
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
      this.$store.state.devOptions.statueJson2.includes('TemUn') && this.changeData({ TemUn: !this.TemUn - 0 });
    },
    // 显示CO2弹框
    showCO2() {
      this.currentCO2 = this.CO2;
      this.currentCO2Level = this.CO2Level;
      this.currentCO2Img = this.co2Img;
      this.dialogOpen = true;
    },
    getModeName(val) {
      this.modeKey = val;
    },
    // 点击10次进入调试模式
    onTest() {
      getCurrentMode().then(res => {
        if (![1, '1'].includes(res)) {
          this.onTestFlag += 1;
          this.onTestFlag === 5 && new VConsole();
          this.onTestFlag === 10 && this.$router.push({ name: 'Test' });
        }
      });
    }
  }
};
</script>
