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
        <CenterSlider />
      </div>
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
    </gree-page>
    <BottomBtn />
    <!-- 底部弹框 -->
    <FuncPopup ref="FuncPopup" />
    <ModPopup ref="ModPopup" />
    <FanSwiper ref="FanPopup" />
  </gree-view>
</template>

<script>
import { Header } from 'gree-ui';
import { mapState, mapGetters } from 'vuex';
import VConsole from 'vconsole/dist/vconsole.min.js';
import BottomBtn from '@/components/BottomBtn';
import FuncPopup from '@/components/BtnPopup/func';
import ModPopup from '@/components/BtnPopup/mod';
import FanSwiper from '@/components/FanSwiper';
import CenterSlider from '@/components/CenterSlider';
import { closePage, editDevice, getCurrentMode, getCCcmd } from '@PluginInterface';

export default {
  components: {
    [Header.name]: Header,
    BottomBtn,
    FuncPopup,
    ModPopup,
    FanSwiper,
    CenterSlider
  },
  data() {
    return {
      onTestFlag: 0
    };
  },
  computed: {
    ...mapState('control', {
      dataObject: state => state.dataObject,
      devname: state => state.deviceInfo.name,
      functype: state => state.dataObject.functype,
      mac: state => state.mac
    }),
    ...mapState('machine', {
      baseData: state => state.baseData,
      statueJson2: state => state.devOptions.statueJson2
    }),
    ...mapGetters('machine', ['funcDefine_active', 'statusMap']),
    iconClassList() {
      const iconMsg = require('@assets/iconfont/iconfont.json');
      const result = iconMsg.glyphs.map(icon => icon.font_class);
      return result;
    },
    miniIconList() {
      if (!this.funcDefine_active.filter(module => module.type === 'active-button').length) return [];
      const result = this.baseData.funcDefine.map(model => {
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
      const opt = JSON.parse(this.statueJson2);
      const p = opt.map(item => {
        return this.dataObject[item] === undefined ? 0 : this.dataObject[item];
      });
      const json = JSON.stringify({ opt, p, t: 'cmd' });
      getCCcmd(this.mac, json, remarks, JSON.stringify(p));
    },
    // 点击10次进入调试模式
    onTest() {
      getCurrentMode().then(res => {
        if (res === '0' || res === 0) {
          this.onTestFlag += 1;
          this.onTestFlag === 5 && new VConsole();
          if (this.onTestFlag === 10) {
            this.onTestFlag = 0;
            this.$router.push('Test');
          }
        }
      });
    }
  }
};
</script>
