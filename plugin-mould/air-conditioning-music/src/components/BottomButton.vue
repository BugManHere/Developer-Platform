<template>
  <div class="bottom-button" :style="{ 'background-color': skinConfig.color, 'background-image': `url(${skinConfig.bottomBg})` }">
    <div class="item" v-for="(item, index) in skinConfig.bottomBtnList" :key="index">
      <img :src="item.url" @click="footerFunction(item.key)" />
      <span v-text="item.name" />
      <div class="img-select" v-show="item.key === selectKey" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      skinConfig: (state, getters) => getters.skinConfig,
      skinIndex: state => state.skinIndex,
      selectKey: state => state.selectKey
    })
  },
  methods: {
    ...mapMutations({
      setState: 'SET_STATE'
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
    .img-select {
      position: absolute;
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
      font-size: 36px;
      margin-top: 2px;
    }
  }
}
</style>
