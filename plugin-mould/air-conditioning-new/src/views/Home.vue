<template>
  <gree-view>
    <gree-page class="page-home">
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
    <!-- 底部按钮 -->
    <gree-toolbar position="bottom" no-hairline>
      <gree-row>
        <div class="pow-button" :class="{ off: !Pow - 0 }" @click="changeData({ Pow: !Pow - 0 })">
          <span class="iconfont iconfont-kaiguan" />
          <div class="button-boder" />
          <div class="ripple" v-show="!Pow" />
        </div>
        <gree-col @click.native="showPopUp('ModPopup', Pow)" :class="{ gray: !Pow }">
          <i class="iconfont iconfont-moshi" />
          <h3>模式</h3>
        </gree-col>
        <gree-col @click.native="showPopUp('FanPopup', Pow && fanSetAble)" :class="{ gray: !Pow || !fanSetAble }">
          <i class="iconfont iconfont-fengsu" />
          <h3>风速</h3>
        </gree-col>
        <gree-col :class="{ gray: !Pow, on: SwhSlp }">
          <i class="iconfont iconfont-Sleep" @click="Pow && changeData({ SwhSlp: !SwhSlp - 0, SlpMod: !SwhSlp - 0 })" />
          <h3>睡眠</h3>
        </gree-col>
        <gree-col @click.native="showPopUp('FuncPopup', true)">
          <i class="iconfont iconfont-gaoji" />
          <h3>高级</h3>
        </gree-col>
      </gree-row>
    </gree-toolbar>
    <!-- 底部弹框 -->
    <FuncPopup ref="FuncPopup" />
    <ModPopup ref="ModPopup" />
    <FanPopup ref="FanPopup" />
  </gree-view>
</template>

<script>
import { Header, List, Item, Row, Col, Button, Icon, ToolBar } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import FuncPopup from '@/components/BtnPopup/func';
import ModPopup from '@/components/BtnPopup/mod';
import FanPopup from '@/components/FanPopup';
import CenterSlider from '@/components/CenterSlider';
import { closePage, editDevice, getCurrentMode } from '@PluginInterface';
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
    [Icon.name]: Icon,
    [ToolBar.name]: ToolBar,
    FuncPopup,
    ModPopup,
    FanPopup,
    CenterSlider
  },
  data() {
    return {
      onTestFlag: 0
    };
  },
  computed: {
    ...mapState({
      dataObject: state => state.dataObject,
      fanKey: state => state.fanKey,
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
      WdSpd: state => state.dataObject.WdSpd,
      SwhSlp: state => state.dataObject.SwhSlp,
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
      if (!this.g_funcDefine_btn) return [];
      const result = this.g_funcDefine_btn.map(func => {
        const id = func.identifier;
        const statusName = this.g_statusMap[id].status;
        const miniIcon = func.statusDefine[statusName].miniIcon;
        return miniIcon;
      });
      return result;
    },
    fanSetAble() {
      return !this.g_noDirectionFuncArr.includes(this.fanKey);
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
      console.log(opt);
      const p = opt.map(item => {
        return this.dataObject[item] === undefined ? 0 : this.dataObject[item];
      });
      const json = JSON.stringify({ opt, p, t: 'cmd' });
      console.log(json);
      getCCcmd(this.mac, json, remarks, JSON.stringify(p));
    },
    // 点击10次进入调试模式
    onTest() {
      getCurrentMode().then(res => {
        console.log('-------');
        console.log(res);
        if (res === '0' || res === 0) {
          this.onTestFlag += 1;
          this.onTestFlag === 5 && new VConsole();
          this.onTestFlag === 10 && this.$router.push('Test');
        }
      });
    }
  }
};
</script>
