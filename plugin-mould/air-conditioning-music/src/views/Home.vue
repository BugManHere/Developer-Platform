<template>
  <gree-view
    bg-color="#f4f4f4"
    class="home-view"
    :style="{ 'background-size': `${bgWidth}px ${bgHeight}px`, 'background-color': skinConfig.color, 'background-image': `url(${skinConfig.homeBg})` }"
  >
    <!-- 头部 -->
    <div class="page-header">
      <gree-header theme="transparent" :left-options="{ preventGoBack: true }" :right-options="{ showMore: false }" @on-click-back="goBack">
        <gree-icon name="power" size="lg" class="header-pow" slot="right" @click="moreInfo" />
        <gree-icon name="more" size="lg" class="header-more" slot="right" @click="moreInfo" />
        <span v-text="devname" @click="onTest" />
        <a class="save" slot="right" v-if="functype" @click="sceneSave">
          保存
        </a>
      </gree-header>
    </div>
    <!-- 卡片标题，预留的吸顶位置 -->
    <div id="blank-box" style="width: auto; height:auto" />
    <!-- <CardHeader v-show="cardHeaderShow" /> -->
    <gree-page no-navbar class="page-home">
      <!-- 主要内容 -->
      <div class="page-main">
        <!-- 模式滑轮 -->
        <div class="tem-edit">
          <gree-icon name="move" size="xl" />
          <div v-text="SetTem" class="tem-value" />
          <gree-icon name="add" size="xl" />
        </div>
        <!-- 卡片 -->
        <GrownCard />
      </div>
    </gree-page>
    <!-- 尾部 -->
    <BottomButton />
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
  getCurrentMode
  // getMsg
} from '@PluginInterface';
import VConsole from 'vconsole/dist/vconsole.min.js';
import LogicDefine from '@/logic/define';
import BottomButton from '@/components/BottomButton';
import GrownCard from '@/components/card/index';

export default {
  components: {
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
  mixins: [LogicDefine],
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
    colorChange: {
      handler(newVal) {
        if (newVal && newVal !== '#000' && newVal !== '#000000') {
          changeBarColor(newVal);
        }
      },
      immediate: true
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
      this.setState({ watchLock: false, ableSend: true });
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
    }
  }
};
</script>
