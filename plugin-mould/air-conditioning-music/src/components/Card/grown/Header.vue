<template>
  <CardHeader header-id="grown-card-header">
    <template v-slot:left>
      <div :class="{ select: imshowType === 0 }" @click="changeImshow(0)" v-show="authReasult !== 2">
        <span v-text="'酷狗音乐'" />
      </div>
      <div :class="{ select: imshowType === 1 && authReasult !== 2 }" @click="changeImshow(1)">
        <span v-text="'技能'" />
      </div>
    </template>
    <template v-slot:right>
      <img src="@assets/img/music/statistical.png" @click="goPage(0)" />
      <img src="@assets/img/music/history.png" @click="goPage(1)" />
    </template>
  </CardHeader>
</template>

<script>
import { toVoicePage } from '@PluginInterface';
import { mapState, mapMutations } from 'vuex';
import CardHeader from '@/components/card/CardHeader';

export default {
  components: {
    CardHeader
  },
  computed: {
    ...mapState({
      mac: state => state.mac,
      authReasult: state => state.musicData.authReasult,
      imshowType: state => state.musicData.imshowType
    })
  },
  methods: {
    ...mapMutations({
      setMusicData: 'SET_MUSIC_DATA'
    }),
    changeImshow(type) {
      this.setMusicData({ imshowType: type });
    },
    goPage(index) {
      toVoicePage(this.mac, index);
    }
  }
};
</script>

<style lang="scss">
$fontSize: 44px;
#grown-card-header {
  $paddingTop: 62px;
  border-bottom: 1px solid #f2f2f2;

  .left {
    width: auto;
    display: flex;
    justify-content: flex-start;
    padding-left: 40px;
    padding-top: $paddingTop;
    div {
      width: 200px;
      display: flex;
      justify-content: center;
      font-size: 48px;
    }
    .select span {
      color: rgb(0, 153, 255);
      border-bottom: 8px solid rgb(0, 153, 255);
    }
  }
  .right {
    width: 380px;
    display: flex;
    justify-content: flex-end;
    padding-top: $paddingTop;
    img {
      width: 60px;
      height: 54px;
      padding-right: 70px;
    }
  }
}
</style>
