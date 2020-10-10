<template>
  <div class="music-ball" v-show="albumImg && albumImg.length && showBall" :style="dragStyle">
    <div class="ball-body" @click="goPlayPage" @touchstart="dragBegin" @touchend="dragDone" @touchcancel="dragDone" @touchmove="dragging">
      <div class="round" :class="['left', 'right', 'center'][imshowType]" />
      <div class="img-box">
        <img :src="albumImg" :class="{ playing: musicPlaying }" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      imshowType: 1, // 0:左边, 1:右边, 2:拖动中, 3:计算中
      currentPos: [],
      currentTranslate: [0, 0],
      movePos: [0, 0],
      touchIdentifier: 0,
      dragTimer: null, // 拖动事件用
      changeImg: false
    };
  },
  computed: {
    ...mapState({
      musicPlaying: state => state.musicData.musicPlaying,
      songId: state => state.musicData.songId,
      songInfosMap: state => state.musicData.songInfosMap,
      showBall: state => state.musicData.showBall,
      albumImg: state => state.musicData.albumImg,
      currentSongInfo: (state, getters) => getters.currentSongInfo
    }),
    dragStyle() {
      return {
        transform: `translate(${this.movePos[0]}px,${this.movePos[1]}px)`
      };
    },
    // 页面宽度
    pageWidth() {
      return document && document.body && document.body.clientWidth;
    },
    // 页面高度
    pageHeight() {
      return document && document.body && document.body.clientHeight;
    },
    // 底部高度
    footHeight() {
      return document && document.getElementsByClassName('page-footer')[0] && document.getElementsByClassName('page-footer')[0].clientHeight;
    },
    // 顶部高度
    headerHeight() {
      return document && document.getElementsByClassName('gree-header-title')[0] && document.getElementsByClassName('gree-header-title')[0].clientHeight;
    },
    // 悬浮框宽度
    ballWidth() {
      return document && document.getElementsByClassName('music-ball')[0] && document.getElementsByClassName('music-ball')[0].clientWidth;
    },
    maxHeight() {
      return this.pageHeight - this.headerHeight - this.footHeight - this.ballWidth;
    }
  },
  watch: {
    // 切换歌曲
    songId() {
      this.changeImg = true;
      setTimeout(() => {
        this.changeImg = false;
      }, 500);
    }
  },
  methods: {
    // 拖动开始
    dragBegin(e) {
      clearInterval(this.dragTimer);
      this.touchIdentifier = e.changedTouches[0].identifier; // 记录手指id
      this.currentPos = [e.changedTouches[0].clientX, e.changedTouches[0].clientY]; // 更新手指坐标
    },
    dragDone() {
      const [moveX, moveY] = this.movePos; // 获取X轴、Y轴的拖动位置
      let targetX = 0; // 要移动到的X轴位置
      let targetY = moveY; // 要移动到的X轴位置
      let type = 1; // 贴边形式 0:左边, 1:右边
      let slideFlag = [false, false]; // [X轴动画完成标识, Y轴动画完成标识]
      // from:现在的位置 to:要到达的位置 key:{ 0:'左边', 1:'右边' }
      const slowSlide = (from, to, target, key) => {
        const last = to - from; // 剩余滑动距离
        // 剩余距离小于10，直接滑动过去
        if (Math.abs(last) <= 10) {
          this.$set(target, key, to);
          return true;
        }
        // 滑动距离逐渐减小,由快到慢的吸附动画
        this.$set(target, key, from + last / 2);
        return false;
      };

      // 如果X轴超出一半，贴到左边
      if (moveX <= -(this.pageWidth - this.ballWidth) / 2) {
        targetX = -(this.pageWidth - this.ballWidth);
        type = 0;
      }
      // 如果顶部超出，往下滑
      if (moveY < 0) {
        targetY = 0;
      } else if (moveY >= this.maxHeight) {
        targetY = this.maxHeight;
      }

      // 开启定时器，缓慢滑动
      this.dragTimer = setInterval(() => {
        if (!slideFlag.includes(false)) {
          clearInterval(this.dragTimer);
          this.imshowType = type;
        } else {
          slideFlag[0] || (slideFlag[0] = slowSlide(this.movePos[0], targetX, this.movePos, 0));
          slideFlag[1] || (slideFlag[1] = slowSlide(this.movePos[1], targetY, this.movePos, 1));
        }
      }, 30);

      this.currentTranslate = this.movePos;
    },
    dragging(e) {
      this.imshowType = 2; // 标记拖动

      const target = e.touches[this.touchIdentifier];
      const targetPos = [target.clientX, target.clientY];
      this.movePos = targetPos.map((item, index) => item - this.currentPos[index] + this.currentTranslate[index]);
    },
    goPlayPage() {
      this.$router.push('musicPlay');
    }
  }
};
</script>

<style lang="scss" scoped>
.music-ball {
  position: absolute;
  right: 0;
  top: 120px;
  z-index: 999;
  height: 180px;
  width: 180px;
  .ball-body {
    position: relative;
    height: 100%;
    width: 100%;
    .round {
      position: relative;
      left: 0;
      background-color: rgba(255, 255, 255, 0.7);
      height: 100%;
      width: 180px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #c6c6c6;
      box-shadow: 0px 0px 100px #ccc;
      border-radius: 50%;
      z-index: 2;
      &.left {
        border-radius: 0 50% 50% 0;
        border-left: 0;
      }
      &.right {
        border-radius: 50% 0 0 50%;
        border-right: 0;
      }
    }
    .img-box {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        position: relative;
        width: 130px;
        height: 130px;
        border-radius: 50%;
        z-index: 3;
        animation: img-rotate linear 18s infinite;
        animation-play-state: paused;
        &.playing {
          animation-play-state: running;
        }
      }
    }
  }
}
@keyframes img-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
