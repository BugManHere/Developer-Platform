<template>
  <gree-view bg-color="#404040">
    <gree-page class="page-smart-wind">
      <gree-header>{{ $language('btn.Air') }}</gree-header>
      <gree-radio-list :options="modes" icon-size="md" :value="LigStatus" @change="setLig"></gree-radio-list>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Toast, Radio, RadioList, Switch, List, Item } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';
import { showToast, hideLoading } from '@PluginInterface';
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
    [Toast.name]: Toast
  },
  mixins: [LogicWatch],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      Air: state => state.dataObject.Air
    }),
    modes() {
      return [
        {
          value: 1,
          text: this.$language('air.on')
        },
        {
          value: 0,
          text: this.$language('air.off')
        },
        {
          value: 3,
          text: this.$language('air.Intelligent'),
          brief: this.$language('air.air_powoff_tips'),
          disabled: Boolean(!this.Pow)
        }
      ];
    },
    LigStatus() {
      return this.Air;
    }
  },
  watch: {
    Pow(newVal) {
      if (!newVal) {
        this.$router.push({ name: 'Home' }).catch(err => {
          err;
        });
        try {
          showToast(this.$language('air.air_powoff_tips'), 1);
        } catch (e) {
          Toast({
            content: this.$language('air.air_powoff_tips'),
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
