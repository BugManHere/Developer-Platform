<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-nobodysave">
      <gree-header>{{ $language('btn.Dazzling') }}</gree-header>
      <gree-list>
        <gree-list-item title="炫光">
          <gree-switch slot="after" v-model="isActive" @change="switchDazzling(isActive)"></gree-switch>
        </gree-list-item>
      </gree-list>
      <gree-radio-list :options="modes" :value="DazzlingStatus" icon-size="md" @change="setDazzling" v-show="isActive"></gree-radio-list>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Radio, RadioList, Switch, List, Item } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { showToast, hideLoading } from '@PluginInterface';

export default {
  name: 'Dazzling',
  components: {
    [Header.name]: Header,
    [Radio.name]: Radio,
    [RadioList.name]: RadioList,
    [Switch.name]: Switch,
    [List.name]: List,
    [Item.name]: Item,
    [Toast.name]: Toast
  },
  data() {
    return {
      isActive: true
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      Dazzling: state => state.dataObject.Dazzling
    }),
    modes() {
      return [
        {
          value: 1,
          text: '炫光模式'
        },
        {
          value: 9,
          text: '流光模式'
        },
        {
          value: 10,
          text: '小夜灯模式'
        }
      ];
    },
    DazzlingStatus() {
      const Dazzling = this.Dazzling;
      switch (true) {
        case Dazzling === 0:
          return 0;
        case Dazzling <= 4:
          return 1;
        case Dazzling <= 8:
          return 5;
        case Dazzling === 9:
        case Dazzling === 10:
          return Dazzling;
        default:
          return 0;
      }
    }
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        this.$router.push({ name: 'Home' }).catch(err => {
          err;
        });
        try {
          showToast('空调已被关闭，自动退出炫光设置。', 1);
        } catch (e) {
          Toast({
            content: '空调已被关闭，自动退出炫光设置。',
            position: 'bottom'
          });
        }
      }
    }
  },
  mounted() {
    this.isActive = Boolean(this.Dazzling);
    hideLoading();
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    switchDazzling(active) {
      const setData = { Dazzling: Number(active) };
      this.setState(['ableSend', true]);
      this.setDataObject(setData);
      this.sendCtrl(setData);
    },
    setDazzling(option) {
      const setData = { Dazzling: option.value };
      this.setState(['ableSend', true]);
      this.setDataObject(setData);
      this.sendCtrl(setData);
    }
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
}
</style>
