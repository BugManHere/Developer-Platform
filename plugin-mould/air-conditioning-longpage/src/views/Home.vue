<template>
  <gree-view>
    <gree-page class="page-home" bg-color="#F4F4F4">
      <gree-header :left-options="{ showBack: false }" :right-options="{ showMore: false }">
        <span v-text="devname" @click="onTest" />
        <i class="iconfont iconfont-fanhui" slot="overwrite-left" @click="goBack" />
        <span v-if="functype" v-text="'保存'" slot="right" @click="sceneSave" />
        <i v-else class="iconfont iconfont-gengduo" slot="right" @click="moreInfo" />
      </gree-header>
      <div class="page-main">
        <!-- 小图标 -->
        <div class="icons">
          <div class="col">
            <i
              v-show="iconClassList.includes(miniIcon.key) && miniIcon.key !== 'undefined'"
              class="iconfont mini-icon"
              :class="`iconfont-${miniIcon.key}`"
              v-for="(miniIcon, index) in miniIconList"
              :key="index"
            />
          </div>
        </div>
        <CenterSlider />
        <main-btn-list />
      </div>
    </gree-page>
    <!-- 底部弹框 -->
    <FuncPopup ref="FuncPopup" />
    <ModPopup ref="ModPopup" />
    <FanSwiper ref="FanPopup" />
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
import FuncPopup from '@/components/BtnPopup/func';
import ModPopup from '@/components/BtnPopup/mod';
import FanSwiper from '@/components/FanSwiper';
import CenterSlider from '@/components/CenterSlider';
import { closePage, editDevice, getCurrentMode, getCCcmd } from '@PluginInterface';
import { mapMutations } from 'vuex';

export default {
  components: {
    [Header.name]: Header,
    [InputItem.name]: InputItem,
    [Dialog.name]: Dialog,
    [MainBtn.name]: MainBtn,
    FuncPopup,
    ModPopup,
    FanSwiper,
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
      }
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
        if (!this.statusMap[identifier] || !model.statusDefine[statusName]) return {};
        const miniIcon = model.statusDefine[statusName].miniIcon;
        return miniIcon;
      });
      return result;
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
