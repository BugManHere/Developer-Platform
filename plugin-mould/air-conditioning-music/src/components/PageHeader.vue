<template>
  <div class="page-header">
    <gree-header theme="transparent" :left-options="{ preventGoBack: true }" :right-options="{ showMore: false }" @on-click-back="goBack">
      <gree-icon name="power" size="lg" class="header-pow" slot="right" @click="setPow" />
      <gree-icon name="more" size="lg" class="header-more" slot="right" @click="moreInfo" />
      <div v-if="isCenterTop && Mod && Pow" class="title-tem-control">
        <gree-icon name="move" size="md" @click="setTem(-1)" />
        <div class="title-tem-control-value">
          <gree-animated-number :value="currentTem" :precision="1" :duration="200" transition />
        </div>
        <gree-icon name="add" size="md" @click="setTem(1)" />
      </div>
      <span v-text="devname" @click="onTest" v-else />
      <a class="save" slot="right" v-if="functype" @click="sceneSave">
        保存
      </a>
    </gree-header>
  </div>
</template>

<script>
import { Header, Icon, AnimatedNumber } from 'gree-ui';
import { mapState } from 'vuex';
import { closePage, editDevice, getCCcmd, getCurrentMode } from '@PluginInterface';
import temConfig from '@/mixins/utils/tem';

export default {
  name: 'page-header',
  mixins: [temConfig],
  props: {
    isCenterTop: {
      type: Boolean,
      default: false
    }
  },
  components: {
    [Header.name]: Header,
    [AnimatedNumber.name]: AnimatedNumber,
    [Icon.name]: Icon
  },
  computed: {
    ...mapState({
      devname: state => state.deviceInfo.name,
      functype: state => state.dataObject.functype,
      mac: state => state.mac,
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod
    })
  },
  methods: {
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
      font-size: 64px;
      padding: 0 50px;
      min-width: 180px;
      span {
        position: relative;
        left: 12px;
        &::after {
          right: 0;
          content: '°';
        }
      }
    }
    .gree-icon {
      font-weight: bolder;
    }
  }
}
</style>
