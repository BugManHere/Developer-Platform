<template>
  <div v-if="isShow">
    <div class="overlay-backdrop" />
    <div class="gr-confirm" @click="cancel" @mousemove="dragMove">
      <div
        class="row"
        :class="{
          dragging: isDrag,
          drop: isDrop
        }"
      >
        <div
          class="confirm-panel"
          :class="{
            shake: !isDrag,
            pass: isConfirm,
            back: isCancel
          }"
          :style="{
            left: isNaN(movePos) ? 0 : `${movePos}px`
          }"
          @mousedown="dragStart"
          @click.stop="commit"
        >
          <span v-text="contnet" />
          <div class="right">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: 'confirm'
    },
    onConfirm: {
      type: Function,
      default: function() {
        return {};
      }
    },
    onCancel: {
      type: Function,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      isShow: true, // 是否显示
      isConfirm: false, // 是否确认
      isCancel: false, // 是否取消
      isDrag: false, // 是否拖动
      isDrop: false, // 是否拖动后放手
      clientPos: NaN, // 初始点击位置
      movePos: NaN // 拖动距离
    };
  },
  methods: {
    commit() {
      if (isNaN(this.movePos) || this.movePos >= 0) {
        // 【点击事件】或者【拖动距离为正数】，通过
        this.onConfirm(); // 执行自定义事件
        this.isConfirm = true;
        setTimeout(() => {
          this.isDrop = true;
          setTimeout(() => {
            this.isShow = false;
          }, 200);
        }, 400);
      } else {
        this.cancel();
      }
    },
    cancel() {
      if (isNaN(this.movePos) || this.movePos < 0) {
        // 【点击事件】或者【拖动距离为负数】，不通过
        this.onCancel(); // 执行自定义事件
        this.isCancel = true;
        this.isDrag && (this.isDrop = true);
        setTimeout(() => {
          this.isShow = false;
        }, 600);
      } else {
        // 拖动距离为正数，通过
        this.commit();
      }
    },
    // 记录初始位置
    dragStart(e) {
      this.isDrag = true;
      this.clientPos = e.clientX;
    },
    // 计算移动距离
    dragMove(e) {
      this.movePos = e.clientX - this.clientPos;
    }
  }
};
</script>

<style lang="scss">
.gr-confirm {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  user-select: none;
  .row {
    position: relative;
    right: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    animation: halfRight 0.8s;
    overflow: hidden;
    .confirm-panel {
      position: relative;
      height: 60px;
      width: 200px;
      background-color: Ivory;
      border-radius: 30px;
      box-shadow: 0 0 20px 0 Silver;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 18px;
      padding-left: 25px;
      letter-spacing: 1px;
      color: Silver;
      overflow: hidden;
      &.shake {
        animation: littleRight 4s infinite linear;
      }
      .right {
        position: absolute;
        padding-right: 30px;
        right: 5px;
        width: 30%;
        display: flex;
        justify-content: flex-end;
        // overflow: hidden;
        span {
          position: relative;
          margin-right: 5px;
          width: 10px;
          display: flex;
          align-items: center;
          font-size: 25px;
          // animation: slowRightHide 1.5s infinite;
          &::before {
            color: Gainsboro;
            opacity: 0.6;
            font-family: 'Glyphicons Halflings';
            content: '\e258';
          }
          &:nth-child(1) {
            opacity: 1;
            animation: slowRightShow1 1.5s infinite linear;
          }
          &:nth-child(2) {
            opacity: 0.7917;
            animation: slowRightShow2 1.5s infinite linear;
          }
          &:nth-child(3) {
            opacity: 0.583;
            animation: slowRightShow3 1.5s infinite linear;
          }
        }
      }
    }
    &.dragging {
      height: 64px;
      background-color: #eee;
      animation: hold 0.4s linear;
    }
    &.drop {
      height: 0;
      background-color: transparent;
      animation: drop 0.2s linear;
    }
    .pass {
      transform: translateX(60vw);
      animation: pass 0.5s;
    }
    .back {
      transform: translateX(-60vw);
      animation: back 0.5s !important;
    }
  }
  @keyframes slowRightShow1 {
    0% {
      transform: translateX(0%);
      opacity: 1;
    }
    33% {
      transform: translateX(240%);
    }
    66% {
      transform: translateX(480%);
    }
    100% {
      transform: translateX(720%);
      opacity: 0;
    }
  }

  @keyframes slowRightShow2 {
    0% {
      transform: translateX(0);
      opacity: 0.7917‬;
    }
    79.17% {
      transform: translateX(570%);
      opacity: 0;
    }
    79.2% {
      transform: translateX(-150%);
      opacity: 1;
    }
    100% {
      transform: translateX(0);
      opacity: 0.7917;
    }
  }

  @keyframes slowRightShow3 {
    0% {
      transform: translateX(0);
      opacity: 0.583;
    }
    58.33% {
      transform: translateX(420%);
      opacity: 0;
    }
    58.4% {
      transform: translateX(-300%);
      opacity: 1;
    }
    100% {
      transform: translateX(0);
      opacity: 0.583;
    }
  }

  @keyframes littleRight {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(0);
    }
    55% {
      transform: translateX(15px);
    }
    60% {
      transform: translateX(0);
    }
    70% {
      transform: translateX(0);
    }
    75% {
      transform: translateX(15px);
    }
    80% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(0px);
    }
  }

  @keyframes halfRight {
    0% {
      transform: translateX(-60vw);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes pass {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(60vw);
    }
  }

  @keyframes back {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-60vw);
    }
  }

  @keyframes hold {
    0% {
      background-color: transparent;
    }
    100% {
      background-color: #eee;
    }
  }

  @keyframes drop {
    0% {
      background-color: #eee;
      height: 64px;
    }
    100% {
      background-color: transparent;
      height: 0px;
    }
  }
}
</style>
