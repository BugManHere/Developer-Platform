<template>
  <gree-view
    :bg-color="skinConfig && skinConfig.color"
    class="home-view"
    :style="{ 'background-size': `${bgWidth}px ${bgHeight}px`, 'background-color': skinConfig.color, 'background-image': `url(${skinConfig.homeBg})` }"
  >
    <!-- 头部 -->
    <div class="page-header">
      <gree-header theme="transparent" :left-options="{ preventGoBack: true }" :right-options="{ showMore: false }" @on-click-back="goBack">
        <gree-icon name="power" size="lg" class="header-pow" slot="right" @click="setPow" />
        <gree-icon name="more" size="lg" class="header-more" slot="right" @click="moreInfo" />
        <span v-text="devname" @click="onTest" />
        <a class="save" slot="right" v-if="functype" @click="sceneSave">
          保存
        </a>
      </gree-header>
    </div>
    <!-- 卡片标题，预留的吸顶位置 -->
    <!-- <div id="blank-box" v-show="isCeiling" /> -->
    <gree-page no-navbar class="page-home">
      <!-- 主要内容 -->
      <div class="page-main">
        <!-- 模式滑轮 -->
        <div class="tem-edit">
          <div class="power-on" v-if="Pow">
            <gree-icon name="move" size="xl" @click="setTem(-1)" />
            <div v-text="SetTem" class="tem-value" />
            <gree-icon name="add" size="xl" @click="setTem(1)" />
          </div>
          <div class="power-off" v-else>
            <span v-text="'已关机'" class="power-off-txt" />
          </div>
        </div>
        <!-- 卡片 -->
        <GrownCard />
      </div>
    </gree-page>
    <!-- 尾部 -->
    <BottomButton />
    <gree-overlay :absolute="true" v-show="authDialog === 1" z-index="998" />
    <div class="login-dialog" v-show="authDialog === 1">
      <div class="login-dialog-box">
        <div v-text="'智慧鸟需要你的云小微和酷狗账号授权，才能给您带来更丰富的内容'" class="login-dialog-box-msg" />
        <div v-text="'跳过，暂不授权 >'" class="login-dialog-box-cancel" @click="authCancel" />
        <gree-button round v-text="'去授权'" size="small" class="login-dialog-box-confirm" @click="authConfirm" />
      </div>
    </div>
  </gree-view>
</template>

<script>
import { Header, PowerOff, Row, Col, NoticeBar, Icon, Dialog, Overlay, Button } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  closePage,
  editDevice,
  changeBarColor,
  getCCcmd,
  getCurrentMode,
  toVoicePage
  // getMsg
} from '@PluginInterface';
import VConsole from 'vconsole/dist/vconsole.min.js';
import BottomButton from '@/components/BottomButton';
import GrownCard from '@/components/card/index';
import LogicWatch from '@logic/watch';

export default {
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Header.name]: Header,
    [PowerOff.name]: PowerOff,
    [Row.name]: Row,
    [Col.name]: Col,
    [NoticeBar.name]: NoticeBar,
    [Dialog.name]: Dialog,
    [Icon.name]: Icon,
    GrownCard,
    BottomButton
  },
  mixins: [LogicWatch],
  data() {
    return {
      onTestFlag: 0,
      dialogOpen: false,
      currentCO2: 0,
      currentCO2Level: 0,
      currentCO2Img: 0,
      warnningText: false,
      bgWidth: 0,
      bgHeight: 0
    };
  },
  computed: {
    ...mapState({
      skinConfig: (state, getters) => getters.skinConfig,
      authDialog: state => state.musicData.authDialog,
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
      CO2: state => state.dataObject.CO2,
      CO2Level: state => state.dataObject.CO2Level
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.setCheckObject(this.dataObject);
    });
    // 背景自适应
    this.bgWidth = document.body.clientWidth;
    this.bgHeight = this.bgWidth / 0.5625;
  },
  watch: {
    skinConfig: {
      handler(newVal) {
        newVal && changeBarColor(newVal.color);
      },
      immediate: true
    }
  },

  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA',
      setDataObject: 'SET_DATA_OBJECT',
      setCheckObject: 'SET_CHECK_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(val) {
      this.setState({ watchLock: false, ableSend: true });
      this.setDataObject(val);
      this.sendCtrl(val);
    },
    setTem(step) {
      const SetTem = this.SetTem + step;
      if (SetTem <= 30 && SetTem >= 16) {
        this.changeData({ SetTem: this.SetTem + step });
      }
    },
    setPow() {
      this.changeData({ Pow: Number(!this.Pow) });
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
      const opt = JSON.parse(this.devOptions.statueJson2);
      console.log(opt);
      const p = opt.map(item => {
        return this.dataObject[item] === undefined ? 0 : this.dataObject[item];
      });

      const json = JSON.stringify({
        opt,
        p,
        t: 'cmd'
      });
      console.log(json);
      getCCcmd(this.mac, json, remarks, JSON.stringify(p));
    },
    // 点击10次进入调试模式
    onTest() {
      getCurrentMode().then(res => {
        if (res === '0' || res === 0) {
          this.onTestFlag += 1;
          this.onTestFlag === 5 && new VConsole();
          this.onTestFlag === 10 &&
            this.$router.push({
              name: 'Test'
            });
        }
      });
    },
    authCancel() {
      this.setMusicData({ authDialog: 0 });
    },
    authConfirm() {
      this.setMusicData({ authDialog: 0 });
      toVoicePage(this.mac, 2);
    }
  }
};
</script>
