<template>
  <gree-view bg-color="#f4f4f4">
    <gree-page class="page-smart-wind">
      <gree-header>{{ $language('btn.Lig') }}</gree-header>
      <gree-radio-list
        :options="modes"
        icon-size="md"
        :value="LigStatus"
        @change="setLig"
      ></gree-radio-list>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Radio, RadioList, Switch, List, Item } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  showToast
} from '@PluginInterface';

export default {
  name: 'Lig',
  components: {
    [Header.name]: Header,
    [Radio.name]: Radio,
    [RadioList.name]: RadioList,
    [Switch.name]: Switch,
    [List.name]: List,
    [Item.name]: Item,
    [Toast.name]: Toast,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      Lig: state => state.dataObject.Lig,
      LigSen: state => state.dataObject.LigSen,
    }),
    modes() {
      return [
        {
          value: 1,
          text: '开',
        },
        {
          value: 0,
          text: '关',
        },
        {
          value: 2,
          text: '自动',
          brief: '根据环境的亮度自动开启，关闭空调面板灯光'
        },
      ];
    },
    LigStatus() {
      return [0, 0, 2, 1][this.Lig * 2 + this.LigSen];
    }
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        this.$router.push({name: 'Home'});
        try {
          showToast('空调已被关闭，自动退出灯光设置。', 1);
        } catch (e) {
          Toast({
            content: '空调已被关闭，自动退出灯光设置。',
            position: 'bottom'
          });
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    setLig(option) {
      let Lig = 0;
      let LigSen = 0;
      switch (option.value) {
        case 0:
          LigSen = 1;
          break;
        case 1:
          Lig = 1;
          LigSen = 1;
          break;
        case 2:
          Lig = 1;
          break;
        default:
          break;
      }
      this.setDataObject({
        Lig,
        LigSen
      });
      this.sendCtrl({
        Lig,
        LigSen
      });
    }
  }
};
</script>

<style lang="scss">
.page-smart-wind {
  .list {
    margin-top: 0;
    margin-bottom: 0.1rem;
  }
}
</style>
