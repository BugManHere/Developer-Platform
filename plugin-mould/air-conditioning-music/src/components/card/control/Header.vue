<template>
  <CardHeader header-id="control-card-header" ref="header">
    <template v-slot:left>
      <span v-text="'模式'" />
    </template>
    <template v-slot:right>
      <span v-text="headerText" @click="viewMod" />
      <gree-icon name="arrow-down" size="lg" @click="viewMod" :class="{ unfold: isUnfold }" />
    </template>
  </CardHeader>
</template>

<script>
import CardHeader from '@/components/card/CardHeader';
import { Icon } from 'gree-ui';
import { mapGetters } from 'vuex';

export default {
  components: {
    CardHeader,
    [Icon.name]: Icon
  },
  props: {
    headerText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isUnfold: true
    };
  },
  computed: {
    ...mapGetters(['modAbleSet'])
  },
  watch: {
    modAbleSet: {
      handler(newVal) {
        this.setUnfold(newVal);
      },
      immediate: true
    }
  },
  methods: {
    viewMod() {
      this.setUnfold(!this.isUnfold);
    },
    setUnfold(val) {
      this.isUnfold = val;
      this.$emit('modUnfold', val);
    }
  }
};
</script>

<style lang="scss">
#control-card-header {
  border: 1px solid #f2f2f2;
  .left {
    padding-left: 74px;
    display: flex;
    align-items: flex-end;
    color: rgba(64, 70, 87, 1);
    font-size: 48px;
    padding-bottom: 12px;
  }
  .right {
    width: 156px;
    padding-right: 68px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 10px;
    font-size: 48px;
    color: #9ea0a7;
    span {
      position: relative;
      right: 16px;
    }
    i {
      transition: all 0.5s;
      transform: scaleX(0.7);
      &.unfold {
        transform: rotate(-90deg) scaleX(0.7);
      }
    }
  }
}
</style>
