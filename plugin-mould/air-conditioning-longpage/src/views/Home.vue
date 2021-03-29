<template>
  <gree-view>
    <gree-page class="page-home" bg-color="#f3f7f8" :style="{ 'background-position': `0 ${roundBg * 100}%` }">
      <gree-header :left-options="{ showBack: false }" :right-options="{ showMore: false }">
        <span v-if="!isBlur" v-text="devname" @click="onTest" />
        <span v-else v-html="titleInfo" />
        <i class="iconfont iconfont-fanhui" slot="overwrite-left" @click="goBack" />
        <span v-if="functype" v-text="'保存'" slot="right" @click="sceneSave" />
        <i v-else class="iconfont iconfont-gengduo" slot="right" @click="moreInfo" />
      </gree-header>
      <!-- 小图标 -->
      <div class="icons" v-show="miniIconList.length">
        <div class="col" v-for="(miniIcon, index) in miniIconList" :key="index">
          <i class="iconfont mini-icon" :class="`iconfont-${miniIcon.key}`" />
          <span v-text="miniIcon.name" />
        </div>
      </div>
      <div class="page-main">
        <!-- 圆环 -->
        <CenterSlider :style="bgBlurStyle" :round-bg="roundBg" />
        <div class="page-main-drawer" ref="page-main-scroll">
          <!-- 引导箭头 -->
          <div class="page-main-drawer-direction-guide iconfont" ref="page-main-scroll-guide" :class="isScroll ? 'arrow' : 'line'" />
          <!-- 主要功能按钮 -->
          <main-btn-group />
          <!-- 弹出层 -->
          <main-popup />
          <!-- 高级功能按钮 -->
          <adv-btn-group />
          <!-- 功能卡片 -->
          <card-list />
        </div>
      </div>
    </gree-page>
    <!-- 细分码测试 -->
    <!-- <div class="vender-text-box" v-text="`当前细分码：${vender === '' ? 'default' : vender}`" draggable @click="changeVender" />
    <gree-dialog v-model="slotDialog.open" :btns="slotDialog.btns">
      <div class="dialog-banner" slot="default">
        <gree-input-item placeholder="请输入细分码" is-amount v-model="slotDialog.value" />
      </div>
    </gree-dialog> -->
  </gree-view>
</template>

<script>
import { Header, InputItem, Dialog } from 'gree-ui';
import { mapState, mapGetters } from 'vuex';
import VConsole from 'vconsole/dist/vconsole.min.js';
import MainBtn from '@/components/MainBtn';
import AdvBtn from '@/components/AdvBtn';
import Popups from '@/components/Popups';
import CardList from '@/components/CardList';
import CenterSlider from '@/components/CenterSlider';
import { closePage, editDevice, getCurrentMode, getCCcmd } from '@PluginInterface';
import { mapMutations } from 'vuex';
import { changeThemeColor, warmColors, coldColors } from '@/utils/themeColorReplacer';

export default {
  components: {
    [Header.name]: Header,
    [InputItem.name]: InputItem,
    [Dialog.name]: Dialog,
    [MainBtn.name]: MainBtn,
    [AdvBtn.name]: AdvBtn,
    [Popups.name]: Popups,
    [CardList.name]: CardList,
    CenterSlider
  },
  data() {
    return {
      onTestFlag: 0,
      slotDialog: {
        open: false,
        value: '',
        btns: [
          {
            text: '确定',
            handler: this.enterVender
          }
        ]
      },
      blurWeight: 0,
      isBlur: false,
      isScroll: false
    };
  },
  computed: {
    ...mapState('control', {
      dataObject: state => state.dataObject,
      devname: state => state.deviceInfo.name,
      functype: state => state.dataObject.functype,
      vender: state => state.dataObject.vender,
      opt: state => state.dataObject.opt,
      mac: state => state.mac,
      mainMac: state => state.mainMac
    }),
    ...mapState('machine', {
      statueJson2: state => state.devOptions.statueJson2,
      baseData: state => state.baseData,
      midTypeFunc: state => state.baseData.midTypeFunc
    }),
    ...mapGetters('machine', ['funcDefine', 'funcDefine_active', 'statusMap']),
    ...mapGetters(['imshowSlot2', 'temSetVal', 'modTextKey', 'modSwitchType', 'fanDefine', 'fanIdentifier', 'fanCurrentStatusName']),
    iconClassList() {
      const iconMsg = require('@assets/iconfont/iconfont.json');
      const result = iconMsg.glyphs.map(icon => icon.font_class);
      return result;
    },
    miniIconList() {
      if (!this.funcDefine_active.filter(module => module.type === 'active-button').length) return [];
      const result = this.funcDefine.map(model => {
        const identifier = model.identifier;
        const statusName = this.statusMap[identifier].statusName;
        // 取名称
        const defaultNameKey = `btn.${identifier}`;
        const status = this.statusMap[identifier].status;
        const statusNameText = status.name;
        const stateNameText = `${defaultNameKey}_${statusNameText}`;
        const name = stateNameText === this.$language(stateNameText) ? this.$language(defaultNameKey) : this.$language(stateNameText);
        if (!this.statusMap[identifier] || !model.statusDefine[statusName]) return {};
        const miniIcon = model.statusDefine[statusName].miniIcon;
        return { ...miniIcon, name };
      });
      return result.filter(icon => {
        return this.iconClassList.includes(icon.key) && icon.key !== 'undefined';
      });
    },
    bgBlurStyle() {
      return (
        this.blurWeight && {
          filter: `blur(${this.blurWeight}px)`
        }
      );
    },
    titleInfo() {
      const temText = this.imshowSlot2 ? '' : `${this.temSetVal}℃`;
      const fanText = this.$language(`fan.${this.fanIdentifier}_${this.fanDefine.statusDefine[this.fanCurrentStatusName].name}`);
      const modText = this.$language(this.modTextKey);
      let result = `${temText}&nbsp;${modText}模式&nbsp;${fanText}`;
      return result;
    },
    roundBg() {
      return this.modSwitchType === 'on' ? 1 : 0;
    }
  },
  mounted() {
    try {
      const el = document.getElementsByClassName('page-content')[0];
      const scrollEl = this.$refs['page-main-scroll'];
      const guideEl = this.$refs['page-main-scroll-guide'];
      const mainContent = document.getElementsByClassName('page-main')[0];

      const { offsetTop: scrollOffsetTop } = scrollEl;
      const { clientHeight: guideHeight } = guideEl;
      const { clientHeight: mainContentHeight } = mainContent;
      const targetHeight = scrollOffsetTop - mainContentHeight + guideHeight;

      const maxBlurWeight = 23;

      el.addEventListener('scroll', () => {
        this.isScroll = el.scrollTop - 10 > 0;
        const distance = el.scrollTop - targetHeight;
        if (distance > 0) {
          this.blurWeight = (distance / mainContentHeight) * maxBlurWeight;
          this.isBlur = true;
        } else {
          this.blurWeight = 0;
          this.isBlur = false;
        }
      });
    } catch (e) {
      e;
    }
  },
  watch: {
    modSwitchType: {
      handler(newVal) {
        console.log(newVal);
        if (newVal === 'on') {
          changeThemeColor(warmColors);
        } else {
          changeThemeColor(coldColors);
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('control', {
      setDataObject: 'SET_DATA_OBJECT'
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
    // 场景模式保存按钮
    sceneSave() {
      let { opt } = this;
      if (!opt || !opt.length) {
        const removeJson = (inputArr, removeJsonList) => {
          removeJsonList.forEach(json => {
            const index = inputArr.indexOf(json);
            if (index !== -1) {
              inputArr.splice(index, 1);
            }
          });
        };
        // 需要去除的字段
        const removeJsonList = ['AppTimer', 'SetDeciTem', 'CleanTime', 'CleanState', 'GetEr', 'MasSub', 'HumiEnable'];
        // 需要添加的字段
        const addJsonList = [];

        opt = JSON.parse(this.statueJson2);
        opt.push(...addJsonList);
        removeJson(opt, removeJsonList);
      }
      const remarks = '...';
      const sendMac = this.mainMac.length ? `${this.mac}@${this.mainMac}` : this.mac; // 查询包需要传入主mac及子mac
      const p = opt.map(item => {
        return this.dataObject[item] === undefined ? 0 : this.dataObject[item];
      });
      const json = JSON.stringify({ opt, p, t: 'cmd', sub: this.mac });
      getCCcmd(sendMac, json, remarks, JSON.stringify(p));
    },
    // 点击10次进入调试模式
    onTest() {
      getCurrentMode().then(res => {
        if (['0', 0, '1', 1].includes(res)) {
          this.onTestFlag += 1;
          this.onTestFlag === 5 && new VConsole();
          if (this.onTestFlag === 10) {
            this.onTestFlag = 0;
            this.$router.push('Test');
          }
        }
      });
    },
    changeVender() {
      this.slotDialog.open = true;
    },
    enterVender() {
      console.log(this.slotDialog.value);
      this.setDataObject({
        vender: this.slotDialog.value
      });
      this.slotDialog.open = false;
    }
  }
};
</script>
