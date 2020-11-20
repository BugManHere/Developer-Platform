<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-nobodysave">
      <gree-header>{{ $language('btn.UDFanPort') }}</gree-header>
      <gree-list>
        <gree-list-item :title="$language('btn.UDFanPort')">
          <gree-switch slot="after" v-model="isActive" @change="switchUDFanPort(isActive)"></gree-switch>
        </gree-list-item>
      </gree-list>
      <gree-radio-list :options="modes" :value="UDFanPort" icon-size="md" @change="setUDFanPort" v-show="isActive"></gree-radio-list>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Radio, RadioList, Switch, List, Item } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { showToast, hideLoading } from '@PluginInterface';

export default {
  name: 'UDFanPort',
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
      UDFanPort: state => state.dataObject.UDFanPort
    }),
    modes() {
      return [
        {
          value: 0,
          text: '自动',
          brief: '根据温差自动开启或关闭下出风口'
        },
        {
          value: 2,
          text: '常开'
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
    hideLoading();
    this.isActive = this.UDFanPort !== 1;
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    switchUDFanPort(active) {
      const setData = { UDFanPort: active + 1 };
      this.setState(['ableSend', true]);
      this.setDataObject(setData);
      this.sendCtrl(setData);
    },
    setUDFanPort(option) {
      const setData = { UDFanPort: option.value };
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
