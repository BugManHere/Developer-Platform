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
import { Header, List, Item, Row, Col, Button } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import VConsole from 'vconsole/dist/vconsole.min.js';
import BottomBtn from '@/components/BottomBtn';
import FuncPopup from '@/components/BtnPopup/func';
import ModPopup from '@/components/BtnPopup/mod';
import FanSwiper from '@/components/FanSwiper';
import CenterSlider from '@/components/CenterSlider';
import { closePage, editDevice, getCurrentMode, getCCcmd } from '@PluginInterface';
import LogicWatch from '@logic/watch';

export default {
  mixins: [LogicWatch],
  components: {
    [Header.name]: Header,
    [List.name]: List,
    [Item.name]: Item,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
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
    ...mapState({
      statueJson2: state => state.devOptions.statueJson2,
      dataObject: state => state.dataObject,
      work_fanKey: state => state.work_fanKey,
      Mod: state => state.dataObject.Mod,
      WdSpd: state => state.dataObject.WdSpd,
      SetTem: state => state.dataObject.SetTem,
      TemSen: state => state.dataObject.TemSen,
      devname: state => state.deviceInfo.name,
      functype: state => state.dataObject.functype,
      mac: state => state.mac
    }),
    iconClassList() {
      const iconMsg = require('@assets/iconfont/iconfont.json');
      const result = iconMsg.glyphs.map(icon => icon.font_class);
      return result;
    },
    miniIconList() {
      if (!this.g_funcDefine_active.filter(module => module.type === 'active-button').length) return [];
      const result = this.g_funcDefine.map(func => {
        const id = func.identifier;
        const statusName = this.g_statusMap[id].status;
        const miniIcon = func.statusDefine[statusName].miniIcon;
        return miniIcon;
      });
      return result;
    }
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
    changeData(map) {
      this.setState({ watchLock: false });
      this.setState({ ableSend: true });
      this.setDataObject(map);
      this.sendCtrl(map);
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
    showPopUp(key, able) {
      able && (this.$refs[key].showPopup = true);
    },
    goPage(name) {
      if (name === 'Sleep') {
        this.$router.push({
          name,
          params: {
            id: 2
          }
        });
      }
    },
    // 场景模式保存按钮
    sceneSave() {
      const remarks = '...';
      const opt = JSON.parse(this.devOptions.statueJson2);
      const p = opt.map(item => {
        return this.dataObject[item] === undefined ? 0 : this.dataObject[item];
      });
      const json = JSON.stringify({ opt, p, t: 'cmd' });
      getCCcmd(this.mac, json, remarks, JSON.stringify(p));
    },
    // 点击10次进入调试模式
    onTest() {
      // const testUrl = () => {
      //   const isIos = Boolean(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));
      //   const statueJson2 = JSON.parse(this.statueJson2);
      //   let data = '%5B';
      //   statueJson2.forEach(json => {
      //     data += `${this.dataObject[json] || 0},`;
      //   });
      //   data = data.replace(/.$/, '%5D');
      //   const url = `http://192.168.31.94:8081/?mac=${this.mac}&data=${data}&functype=0#/Home`;
      //   isIos ? (window.location.href = url) : newPage(url);
      // };
      getCurrentMode().then(res => {
        if (res === '0' || res === 0) {
          this.onTestFlag += 1;
          this.onTestFlag === 5 && new VConsole();
          // this.onTestFlag === 10 && this.$router.push('Test');
          if (this.onTestFlag === 10) {
            this.onTestFlag = 0;
            this.$router.push('Test');
            // testUrl();
          }
        }
      });
    }
  }
};
</script>
