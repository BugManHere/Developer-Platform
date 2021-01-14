<template>
  <div class="tem-edit">
    <div class="power-on" v-if="Pow && Mod">
      <div class="tem-control" v-if="Mod">
        <gree-icon name="move" size="xl" @click="setTem(-1)" />
        <gree-animated-number class="tem-value" :value="currentTem" :precision="1" :duration="200" transition />
        <gree-icon name="add" size="xl" @click="setTem(1)" />
      </div>
    </div>
    <div class="power-off" v-else-if="!Pow">
      <span v-text="'已关机'" class="power-off-txt" />
    </div>
    <div class="power-off" v-else-if="!Mod">
      <span v-text="'自动调温'" class="power-off-txt" @click="onTest" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Icon, AnimatedNumber } from 'gree-ui';
import { getCurrentMode } from '@PluginInterface';
import VConsole from 'vconsole/dist/vconsole.min.js';
import temConfig from '@/mixins/utils/tem';

export default {
  mixins: [temConfig],
  components: {
    [Icon.name]: Icon,
    [AnimatedNumber.name]: AnimatedNumber
  },
  computed: {
    ...mapState('control', {
      Pow: state => state.dataObject.Pow,
      Mod: state => state.dataObject.Mod
    })
  },
  methods: {
    onTest() {
      getCurrentMode().then(res => {
        if (res === '0' || res === 0) {
          this.onTestFlag += 1;
          this.onTestFlag === 5 && new VConsole();
          if (this.onTestFlag === 10) {
            this.onTestFlag = 0;
            this.$router.push('Test');
          }
          setTimeout(() => {
            this.onTestFlag = 0;
          }, 2000);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tem-edit {
  position: relative;
  height: $temEditHeight;
  width: 100%;
  color: #fff;
  > div {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .power-on {
    position: relative;
    .tem-control {
      position: relative;
      padding: 0 132px;
      top: -40px;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 6;
    }
    .gree-icon {
      font-weight: bolder;
    }
    .tem-value {
      font-family: 'Roboto-Light';
      margin: 0 70px;
      font-size: 264px;
    }
  }
  .power-off {
    &-txt {
      font-size: 90px;
    }
  }
}
</style>
