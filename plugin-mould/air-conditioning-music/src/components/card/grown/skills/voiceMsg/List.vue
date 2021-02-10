<template>
  <ul class="list">
    <li v-for="(item, index) in messageList" :key="index">
      <div class="content">
        <div>
          <span class="header">
            {{ item.label }}
            <img v-if="item.status === 2" src="@assets/img/skill/readed_tag.png" />
            <img v-else src="@assets/img/skill/unread_tag.png" />
          </span>
          <div class="subtitle">
            {{ item.createdAt }}<span>{{ parseInt(item.duration / 1000, 10) }}秒</span>
          </div>
        </div>
        <slot :item="item">
          <button class="btn-play" v-show="!item.isUploading && !item.isPlaying" @click="playVoiceMsg(item)"></button>
          <img src="@assets/img/music/drawable.png" class="icon-playing" v-show="item.isPlaying" />
          <img src="@assets/img/skill/loading.png" class="icon-loading" v-show="item.isUploading" />
        </slot>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    messageList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    playVoiceMsg(item) {
      this.$emit('play-msg', item.guid);
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes playing {
  0% {
    transform: scaleY(0.25);
  }
  25% {
    transform: scaleY(0.65);
  }
  50% {
    transform: scaleY(1);
  }
  75% {
    transform: scaleY(0.65);
  }
  100% {
    transform: scaleY(0.25);
  }
}
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    padding-left: 54px;
    background: #fff;
    &:not(:last-child) {
      .content {
        border-bottom: 1px solid #f4f4f4;
      }
    }
    .content {
      padding: 41px 54px 41px 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header {
        font-size: 46px;
        color: #404657;
        line-height: 1;
        img {
          height: 42px;
          width: 74px;
          margin-left: 17px;
          vertical-align: text-top;
        }
      }
      .subtitle {
        font-size: 42px;
        color: #989898;
        margin-top: 16px;
        span {
          margin-left: 53px;
        }
      }
      .btn-play {
        appearance: none;
        outline: none;
        border: none;
        border-radius: 100%;
        width: 69px;
        height: 69px;
        background-color: transparent;
        background-image: url('../../../../../assets/img/skill/btn_play.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        &:active {
          opacity: 0.5;
        }
      }
      .icon-loading {
        width: 69px;
        height: 69px;
        animation: rotate 1s linear infinite;
      }
      .icon-playing {
        position: relative;
        height: 69px;
        width: 56px;
        transform-origin: bottom;
        animation: playing 1.5s 0s linear infinite;
      }
    }
  }
}
</style>
