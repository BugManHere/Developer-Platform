<template>
  <gree-view :bg-color="colorChange">
    <gree-page 
      no-navbar 
      class="page-home">
      <!-- 头部 -->
      <div 
        class="page-header">
        <gree-header 
          theme="transparent"
          :left-options="{ preventGoBack: true }" 
          :right-options="{ showMore: false }" 
          @on-click-back="goBack">
          <gree-icon name="power" size="lg" class="header-pow" slot="right" @click="moreInfo"/>
          <gree-icon name="more" size="lg" class="header-more" slot="right" @click="moreInfo"/>
          <span
            v-text="devname" 
            @click="onTest"/>
          <a 
            class="save"
            slot="right" 
            v-if="functype"
            @click="sceneSave">
            保存
          </a>
        </gree-header>
        <!-- 模式滑轮 -->
        <div class="tem-edit">
          <gree-icon name="move" size="lg"/>
          <div v-text="SetTem" class="tem-value"/>
          <gree-icon name="add" size="lg"/>
        </div>
      </div>
      <!-- 主要内容 -->
      <div class="page-main">
        <musicCard />
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
  getCurrentMode, 
  // getMsg 
} from '@PluginInterface';
import VConsole from 'vconsole/dist/vconsole.min.js';
import homeConfig from '@/mixins/config/home.js';
import LogicDefine from '@/logic/define';
import musicCard from '@components/Card/music/index';

export default {
  components: {
    [Header.name]: Header,
    [PowerOff.name]: PowerOff,
    [Row.name]: Row,
    [Col.name]: Col,
    [NoticeBar.name]: NoticeBar,
    [Dialog.name]: Dialog,
    [Icon.name]: Icon,
    musicCard
  },
  mixins: [homeConfig, LogicDefine],
  data() {
    return {
      onTestFlag: 0,
      dialogOpen: false, 
      currentCO2: 0,
      currentCO2Level: 0,
      currentCO2Img: 0,
      warnningText: false,
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
      CO2: state => state.dataObject.CO2,
      CO2Level: state => state.dataObject.CO2Level,
    }),
    isB() {
      return ['10f04'].includes(this.devOptions.mid); // B分体特殊ui
    },
    // headerBg() {
    //   if (!this.Pow) return {};
    //   const isB = this.isB;
    //   const backgroundImage = `url(${require(`@/assets/img/mode/${isB ? 'bg_b' : 'mode_bg'}.png`)})`;
    //   return {
    //     backgroundImage,
    //     'background-size': `${isB ? 1 : 5}00% 100%`,
    //     'background-position': `${isB ? 0 : (this.Mod % 5) * 25}% 0%`
    //   };
    // },
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
      const opt = JSON.parse(this.devOptions.statueJson2);
      console.log(opt);
      const p = opt.map(item => {
        return this.dataObject[item] === undefined ? 0 : this.dataObject[item];
      });

      const json = JSON.stringify({ opt, p, t: 'cmd' });
      console.log(json);
      getCCcmd(this.mac, json, remarks, JSON.stringify(p));
    },
    // 显示CO2弹框
    showCO2() {
      this.currentCO2 = this.CO2;
      this.currentCO2Level = this.CO2Level;
      this.currentCO2Img = this.co2Img;
      this.dialogOpen = true;
    },
    // 点击10次进入调试模式
    onTest() {
      getCurrentMode().then(res => {
        if (res === '0' || res === 0) {
          this.onTestFlag += 1;
          this.onTestFlag === 5 && new VConsole();
          this.onTestFlag === 10 && this.$router.push({name: 'Test'});
        }
      });
    },
  }
};
</script>
