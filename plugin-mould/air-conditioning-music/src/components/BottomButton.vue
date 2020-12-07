<template>
  <div class="bottom-button" :style="{ 'background-color': skinConfig.color, 'background-image': `url(${skinConfig.bottomBg})` }">
    <div class="item" v-for="(item, index) in skinConfig.bottomBtnList" :key="index" @touchstart="footerFunction(item.key)">
      <img :src="item.url" />
      <span v-text="item.name" />
      <div class="img-select" v-show="item.key === selectKey" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import { types } from '@/store/types';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState('control', {
      skinIndex: state => state.skinIndex,
      selectKey: state => state.selectKey
    }),
    ...mapGetters('control', ['skinConfig'])
  },
  methods: {
    ...mapMutations({
      setState: types.CONTROL_SET_STATE
    }),
    footerFunction(key) {
      this.setState({ selectKey: key });
    }
  }
};
</script>

<style lang="scss">
.bottom-button {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  z-index: 100;
  position: absolute;
  bottom: 0px;
  min-height: $footerHeight;
  max-height: $footerHeight;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f2f2f2;
  .item:first-child {
    margin-left: 50px;
  }
  .item:last-child {
    margin-right: 50px;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 50px;
    position: relative;
    .img-select {
      position: absolute;
      left: 12.5px;
      top: -55px;
      height: 220px;
      width: 228px;
      background-image: url('../assets/img/bubble.png');
      background-size: 100% 100%;
    }
    img {
      padding-top: 10px;
      height: 80px;
      padding-bottom: 8px;
    }
    span {
      font-size: 38px;
      margin-top: 2px;
    }
  }
}
</style>
