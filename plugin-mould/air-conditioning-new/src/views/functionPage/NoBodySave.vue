<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-nobodysave">
      <gree-header>{{ $language('btn.UnmanedShutDown') }}</gree-header>
      <gree-list>
        <gree-list-item 
          title="无人节能" 
          footer="智能判断房间无人时节能">
          <gree-switch
            slot="after"
            v-model="isActive"
            @change="switchNobodySave(isActive)"
          ></gree-switch>
        </gree-list-item>
      </gree-list>
      <gree-radio-list
        :options="modes"
        :value="UnmanedOffTime"
        icon-size="md"
        @change="setNobodySave"
        v-show="isActive"
      ></gree-radio-list>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Radio, RadioList, Switch, List, Item } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import {
  showToast,
  hideLoading
} from '@PluginInterface';

export default {
  name: 'NoBodySave',
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
      UnmanedOffTime: state => state.dataObject.UnmanedOffTime,
      UnmanedShutDown(state) {
        this.isActive = Boolean(state.dataObject.UnmanedShutDown);
        return state.dataObject.UnmanedShutDown;
      },
    }),
    modes() {
      return [
        {
          value: 3,
          text: '1小时',
          disabled: !this.isActive,
        },
        {
          value: 2,
          text: '2小时',
          disabled: !this.isActive,
        },
        {
          value: 1,
          text: '4小时',
          disabled: !this.isActive,
        },
        {
          value: 0,
          text: '8小时',
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
    hideLoading();
    this.isActive = Boolean(this.UnmanedShutDown);
  },
  methods: {
    ...mapMutations({
      setDataObject: 'SET_DATA_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    switchNobodySave(active) {
      const setData = {UnmanedShutDown: Number(active)};
      if (active) {
        setData.UnmanedOffTime = 2;
      }
      this.setState({ ableSend: true });
      this.setDataObject(setData);
      this.sendCtrl(setData);
    },
    setNobodySave(option) {
      const setData = {UnmanedOffTime: option.value};
      this.setState({ ableSend: true });
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
