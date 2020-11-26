<template>
  <div class="page-header">
    <gree-header theme="transparent" :left-options="{ preventGoBack: true }" :right-options="{ showMore: false }" @on-click-back="goBack">
      <gree-icon name="power" size="lg" class="header-pow" slot="right" @click="setPow" />
      <gree-icon name="more" size="lg" class="header-more" slot="right" @click="moreInfo" />
      <div v-if="isCenterTop" class="title-tem-control">
        <gree-icon name="move" size="md" />
        <span v-text="`${SetTem}`" class="title-tem-control-value" />
        <gree-icon name="add" size="md" />
      </div>
      <span v-text="devname" @click="onTest" v-else />
      <a class="save" slot="right" v-if="functype" @click="sceneSave">
        保存
      </a>
    </gree-header>
  </div>
</template>

<script>
import { Header, Icon } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { closePage, editDevice, getCCcmd, getCurrentMode } from '@PluginInterface';

export default {
  name: 'page-header',
  props: {
    isCenterTop: {
      type: Boolean,
      default: false
    }
  },
  components: {
    [Header.name]: Header,
    [Icon.name]: Icon
  },
  computed: {
    ...mapState({
      devname: state => state.deviceInfo.name,
      SetTem: state => state.dataObject.SetTem,
      functype: state => state.dataObject.functype,
      mac: state => state.mac,
      Pow: state => state.dataObject.Pow
    })
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
    setPow() {
      this.changeData({ Pow: Number(!this.Pow) });
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

<style lang="scss">
.page-header {
  .title-tem-control {
    width: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Roboto-Light';
    &-value {
      position: relative;
      font-size: 60px;
      padding: 0 50px;
      &::after {
        position: absolute;
        right: 24px;
        // top: -20px;
        // left: 10px;
        content: '°';
      }
    }
  }
}
</style>
