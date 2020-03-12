<template>
  <gree-view bg-color="#f4f4f4">
    <gree-page class="page-smart-wind">
      <gree-header>{{ $language('btn.Air') }}</gree-header>
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
import LogicWatch from '@/logic/watch';

export default {
  name: 'Air',
  components: {
    [Header.name]: Header,
    [Radio.name]: Radio,
    [RadioList.name]: RadioList,
    [Switch.name]: Switch,
    [List.name]: List,
    [Item.name]: Item,
    [Toast.name]: Toast,
  },
  mixins: [LogicWatch],
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      Air: state => state.dataObject.Air,
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
          value: 3,
          text: '智能',
          brief: '根据环境自动开启，关闭新风',
          disabled: Boolean(!this.Pow)
        },
      ];
    },
    LigStatus() {
      return this.Air;
    }
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        this.$router.push({name: 'Home'}).catch(err => { err; });
        try {
          showToast('空调已被关闭，自动退出新风设置。', 1);
        } catch (e) {
          Toast({
            content: '空调已被关闭，自动退出新风设置。',
            position: 'bottom'
          });
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    setLig(option) {
      this.setState(['watchLock', false]);
      this.setState(['ableSend', true]);
      this.setDataObject({
        Air: option.value
      });
      this.sendCtrl({
        Air: option.value
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
