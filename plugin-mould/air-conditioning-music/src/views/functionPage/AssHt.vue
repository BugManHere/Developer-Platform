<template>
  <gree-view bg-color="#F4F4F4">
    <gree-page class="page-smart-wind">
      <gree-header>{{ $language('btn.AssHt') }}</gree-header>
      <gree-radio-list :options="modes" icon-size="md" :value="AssHt" @change="setAssHt"></gree-radio-list>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Radio, RadioList, Switch, List, Item } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { showToast, hideLoading } from '@PluginInterface';
import { types } from '@/store/types';

export default {
  name: 'AssHt',
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
    return {};
  },
  computed: {
    ...mapState('control', {
      Pow: state => state.dataObject.Pow,
      AssHt: state => state.dataObject.AssHt,
      mid: state => state.devOptions.mid
    }),
    modes() {
      return [
        {
          value: this.g_identifierArr.includes('AssHt(Final)') ? 1 : 0,
          text: '开'
        },
        {
          value: this.g_identifierArr.includes('AssHt(Final)') ? 0 : 1,
          text: '关'
        },
        {
          value: 2,
          text: '自动',
          brief: '根据环境温度自动开启、关闭辅热，提高制热效率'
        }
      ];
    }
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        this.$router.push({ name: 'Home' }).catch(err => {
          err;
        });
        try {
          showToast('空调已被关闭，自动退出辅热设置。', 1);
        } catch (e) {
          Toast({
            content: '空调已被关闭，自动退出辅热设置。',
            position: 'bottom'
          });
        }
      }
    }
  },
  mounted() {
    hideLoading();
  },
  methods: {
    ...mapMutations({
      setDataObject: types.SET_DATA_OBJECT,
      setState: types.CONTROL_SET_STATE
    }),
    ...mapActions({
      sendCtrl: types.SEND_CTRL
    }),
    setAssHt(option) {
      this.setState(['ableSend', true]);
      this.setDataObject({ AssHt: option.value });
      this.sendCtrl({ AssHt: option.value });
    }
  }
};
</script>

<style lang="scss">
.page-smart-wind {
  .gree-header {
    &-left {
      height: 100%;
      display: flex !important;
      align-items: center !important;
    }
  }
  .list {
    margin-top: 0;
    margin-bottom: 0.1rem;
  }
}
</style>
