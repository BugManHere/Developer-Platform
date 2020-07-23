<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-nobodysave">
      <gree-header>{{ $language('btn.LoopMod') }}</gree-header>

      <div class="Loop-btn-block"> 
        <gree-row v-for="(item, index) in LoopModList" :key="index">
          <gree-col>
            <gree-button round :type="LoopMod === index + 1 ? 'primary' : 'default'" @click="changeLoopMod(index)">{{ item }}</gree-button>
          </gree-col>
        </gree-row>
      </div>
      <div style="display:none">{{errStatus}}</div>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Radio, RadioList, Switch, List, Item, Button, Row, Col } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  showToast
} from '@PluginInterface';
import errorConfig from '@/mixins/utils/error'

export default {
  name: 'Dazzling',
  components: {
    [Header.name]: Header,
    [Radio.name]: Radio,
    [RadioList.name]: RadioList,
    [Switch.name]: Switch,
    [List.name]: List,
    [Item.name]: Item,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [Row.name]: Row,
    [Col.name]: Col,
  },
  mixins: [errorConfig],
  data() {
    return {
      LoopModList: ['全新风', '混合风'],
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod,
      LoopMod: state => state.dataObject.LoopMod,
      Dazzling: state => state.dataObject.Dazzling,
      OutHome: state => state.dataObject.OutHome,
    }),
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        try {
          showToast('设备已被关闭，自动退出循环模式设定。', 1);
        } catch (e) {
          Toast({
            content: '设备已被关闭，自动退出循环模式设定。',
            position: 'bottom'
          });
        }
        this.$router.push({name: 'Home'}).catch(err => { err; });
      }
    },

    Mod(newVal) {
      if (newVal === 5) {
        try {
          showToast('设备被设定为自动模式，自动退出循环模式设定。', 1);
        } catch (e) {
          Toast({
            content: '设备被设定为自动模式，自动退出循环模式设定。',
            position: 'bottom'
          });
        }
        this.$router.push({name: 'Home'}).catch(err => { err; });
      }
    },

    OutHome(newVal) {
      if (newVal) {
        try {
          showToast('外出模式开启,不可设置。', 1);
        } catch (e) {
          Toast({
            content: '外出模式开启,不可设置。',
            position: 'bottom'
          });
        }
        this.$router.push({name: 'Home'}).catch(err => { err; });
      }
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    
    changeLoopMod(index) {
      const obj = {LoopMod: index + 1};
      this.setState(['ableSend', true]);
      this.setDataObject(obj);
      this.sendCtrl(obj);
    },
  }
};
</script>

<style lang="scss">
.page-nobodysave {
  .list {
    margin-top: 0;
    margin-bottom: 0.1rem;
  }
  .gree-switch {
    font-size: 50px;
  }
  .Loop-btn-block{
    margin-top: 110px;
    text-align: center;    
    .gree-button{
      width: 478px;
      height: 160px;
      font-size: 56px;
    }
    .gree-button:nth-of-type(1){
        margin-top: 110px;
    }
    .gree-button__text{
      font-size: 40px !important;
      color: #000 !important;
    }
  }
}
</style>
