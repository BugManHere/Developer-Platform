<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-smart-wind">
      <gree-header>{{ $language('btn.SmartWind') }}</gree-header>
      <gree-list>
        <gree-list-item title="智能送风" >
          <gree-switch
            slot="after"
            v-model="isActive"
            @change="switchSmartWind(isActive)"
          ></gree-switch>
        </gree-list-item>
      </gree-list>
      <gree-radio-list
        :options="modes"
        :value="SmartWind"
        icon-size="md"
        @change="setSmartWind"
        v-show="isActive"
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
  name: 'SmartWind',
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
      isActive: true,
    };
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      SmartWind(state) {
        this.isActive = Boolean(state.dataObject.SmartWind);
        return state.dataObject.SmartWind;
      },
    }),
    modes() {
      return [
        {
          value: 1,
          text: '智能',
          disabled: !this.isActive,
          brief: '自动进入风随人、风避人和环绕风'
        },
        {
          value: 2,
          text: '风随人',
          disabled: !this.isActive,
        },
        {
          value: 3,
          text: '风避人',
          disabled: !this.isActive,
        },
        {
          value: 4,
          text: '环绕风',
          disabled: !this.isActive,
        },
      ];
    }
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        this.$router.push({name: 'Home'}).catch(err => { err; });
        try {
          showToast('空调已被关闭，自动退出智能新风设置。', 1);
        } catch (e) {
          Toast({
            content: '空调已被关闭，自动退出智能新风设置。',
            position: 'bottom'
          });
        }
      }
    }
  },
  mounted() {
    this.isActive = Boolean(this.SmartWind);
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    switchSmartWind(active) {
      const setData = {SmartWind: Number(active)};
      this.setState(['ableSend', true]);
      this.setDataObject(setData);
      this.sendCtrl(setData);
    },
    setSmartWind(option) {
      const setData = {SmartWind: option.value};
      this.setState(['ableSend', true]);
      this.setDataObject(setData);
      this.sendCtrl(setData);
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
  .gree-switch {
    font-size: 50px;
  }
}
</style>
