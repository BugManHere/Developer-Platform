<template>
  <div
    class="card-music"
    :style="{height: `${cradHeight}px`}"
  >
    <!-- 标题 -->
    <div 
      class="music-header"
      @touchstart="startDrag"
      @touchmove="dragCard"
    >
      <!-- 左边文字 -->
      <div class="left">
        <div v-text="'点播'" @click="imshowType = 0" :class="{select: imshowType === 0}"/>
        <div v-text="'技能'" @click="imshowType = 1" :class="{select: imshowType === 1}"/>
      </div>
      <!-- 右边按钮 -->
      <div class="right">
        <img src="@assets/img/music/statistical.png" >
        <img src="@assets/img/music/history.png" >
      </div>
    </div>
    <!-- 内容 -->
    <div class="music-main">
      <div :is="['songList', 'voiceSkill'][imshowType]"/>
    </div>
  </div>
</template>

<script>
import songList from './songList';
import voiceSkill from './voiceSkill';

export default {
  components: {
    songList,
    voiceSkill,
  },
  data() {
    return {
      imshowType: 0, // 0：点播, 1：技能
      headerPos: 0,
      headerMove: 0,
      baseHeight: 0
    };
  },
  computed: {
    // 卡片高度
    cradHeight() {
      if (this.headerMove < 0) return this.baseHeight;
      const result = this.baseHeight + this.headerMove;
      if (result / document.documentElement.clientHeight * 1920 >= 1800) return 1800 * document.documentElement.clientHeight / 1920;
      return result;
    }
  },
  mounted() {
    this.baseHeight = document.documentElement.clientHeight / 1920 * 1251;
  },
  methods: {
    startDrag(e) {
      if (this.headerPos) return;
      this.headerPos = e.changedTouches[0].pageY;
    },
    dragCard(e) {
      const moveY = this.headerPos - e.changedTouches[0].pageY;
      this.headerMove = moveY;
    },
  },
};
</script>

<style lang="scss">
.card-music {
  position: absolute;
  bottom: 0;
  $headerHeight: 142px; 
  $mainHeight: calc(100vh - 669px - 142px - 190px);
  $fontSize: 44px;
  width: 100%;
  background: #fff;
  border-radius: 100px;
  .music-header {
    position: relative;
    border-bottom: 1px solid #F2F2F2;
    height: $headerHeight;
    display: flex;
    justify-content: space-between;
    .left {
      position: relative;
      padding: 62px 0 0 12px;
      font-size: $fontSize;
      width: 380px;
      display: flex;
      justify-content: space-around;
      div {
        width: 200px;
        display: flex;
        justify-content: center;
      }
      .select {
        color: rgb(0, 153, 255);
        border-bottom: 6px solid rgb(0, 153, 255);
      }
    }
    .right {
      position: relative;
      padding-top: 62px;
      width: 380px;
      display: flex;
      justify-content: flex-end;
      img {
        width: 60px;
        height: 54px;
        padding-right: 70px;
      }
    }
  }
  .music-main {
    position: relative;
    height: $mainHeight;
  }
}

</style>
