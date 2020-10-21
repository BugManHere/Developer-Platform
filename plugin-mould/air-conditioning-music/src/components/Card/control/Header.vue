<template>
  <CardHeader header-id="control-header">
    <template v-slot:left>
      <span v-text="'模式'" />
    </template>
    <template v-slot:right>
      <span v-text="'制冷'" />
      <gree-icon name="arrow-down" size="md"></gree-icon>
    </template>
  </CardHeader>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import CardHeader from '@/components/card/CardHeader';
import { Icon } from 'gree-ui';

export default {
  components: {
    CardHeader,
    [Icon.name]: Icon
  },
  computed: {
    ...mapState({
      imshowType: state => state.musicData.imshowType
    })
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA'
    }),
    changeImshow(type) {
      this.setMusicData({ imshowType: type });
    }
  }
};
</script>

<style lang="scss">
#control-header {
  .left {
    padding-left: 74px;
    display: flex;
    align-items: center;
  }
  .right {
    width: 156px;
    padding-right: 68px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      padding-top: 10px;
    }
  }
}
</style>
