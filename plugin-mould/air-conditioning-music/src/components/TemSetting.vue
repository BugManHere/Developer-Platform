<template>
  <div class="tem-edit">
    <div class="power-on" v-if="Pow">
      <gree-icon name="move" size="xl" @click="setTem(-1)" />
      <div v-text="SetTem" class="tem-value" />
      <gree-icon name="add" size="xl" @click="setTem(1)" />
    </div>
    <div class="power-off" v-else>
      <span v-text="'已关机'" class="power-off-txt" />
    </div>
  </div>
</template>

<script>
import { Icon } from 'gree-ui';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    [Icon.name]: Icon
  },
  computed: {
    ...mapState({
      Pow: state => state.dataObject.Pow,
      SetTem: state => state.dataObject.SetTem,
      has01: state => state.dataObject.has01,
      has05: state => state.dataObject.has05
    })
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA',
      setDataObject: 'SET_DATA_OBJECT',
      setCheckObject: 'SET_CHECK_OBJECT',
      setState: 'SET_STATE'
    }),
    ...mapActions({
      sendCtrl: 'SEND_CTRL'
    }),
    changeData(val) {
      this.setState({ watchLock: false, ableSend: true });
      this.setDataObject(val);
      this.sendCtrl(val);
    },
    // 温度设置
    setTem(step) {
      const SetTem = this.SetTem + step;
      if (SetTem <= 30 && SetTem >= 16) {
        this.changeData({ SetTem: this.SetTem + step });
      }
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
