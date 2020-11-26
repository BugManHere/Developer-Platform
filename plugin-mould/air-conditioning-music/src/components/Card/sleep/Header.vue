<template>
  <CardHeader header-id="sleep-card-header">
    <template v-slot:left>
      <gree-list>
        <gree-list-item title="睡眠" style="font-size: 18px">
          <gree-switch slot="after" class="blue" v-model="sleepActive" size="28" @change="switchSleep(sleepActive)" />
        </gree-list-item>
      </gree-list>
    </template>
  </CardHeader>
</template>

<script>
import { Switch, List, Item } from 'gree-ui';
import CardHeader from '@/components/card/CardHeader';
import { mapState } from 'vuex';

export default {
  props: {
    switchSleep: {
      type: Function,
      default: () => {
        console.log('ok');
      }
    }
  },
  components: {
    CardHeader,
    [Switch.name]: Switch,
    [List.name]: List,
    [Item.name]: Item
  },
  data() {
    return {
      sleepActive: true
    };
  },
  computed: {
    ...mapState({
      SwhSlp: state => state.dataObject.SwhSlp
    })
  },
  watch: {
    SwhSlp: {
      handler(newVal) {
        this.sleepActive = Boolean(newVal);
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
#sleep-card-header {
  z-index: 5;
  .left {
    width: 100%;
    height: 100%;
    padding: 0 28px;
    ul {
      background-color: #fff !important;
      &::before {
        height: 0;
      }
    }
    .list {
      margin: 34px 0 0 0;
    }
    .item-title {
      font-size: 48px;
    }
  }
}
</style>
