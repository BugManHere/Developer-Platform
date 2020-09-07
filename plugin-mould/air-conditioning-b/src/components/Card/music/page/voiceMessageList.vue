<template>
  <ul class="list">
    <li
      v-for="(item, index) in messageList"
      :key="index">
      <div class="content">
        <div>
          <span class="header">
            {{item.label}}
            <span v-if="item.status === 2" class="tag-read">已读</span>
            <span v-else class="tag-unread">未读</span>
          </span>
          <div class="subtitle">{{item.createdAt}}<span>{{parseInt(item.duration / 1000, 10)}}秒</span></div>
        </div>
        <slot v-bind:item="item">
          <button class="btn-play" v-show="!item.isUploading" @click="playVoiceMsg(item)"></button>
          <img src="../../../../assets/img/skill/loading.png" class="icon-loading" v-show="item.isUploading">
        </slot>
      </div>
    </li>
    <audio id="audioPlayer" src="" autoplay></audio>
  </ul>
</template>

<script>
import { showToast, voiceSkillMsgPlay } from '../../../../../public/static/lib/PluginInterface.promise';
export default {
  props: {
    messageList: {
      type: Array,
      default: []
    },
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async playVoiceMsg(item) {
      try {
        console.log(item.guid);
        let result = await voiceSkillMsgPlay(item.guid);
        console.log('play result', result);
        if (!result) {
          throw new Error('获取链接失败');
        }
        result = JSON.parse(result);
        if (!result.url) {
          throw new Error('获取链接失败');
        }
        const audio = document.getElementById('audioPlayer');
        audio.src = result.url;
        audio.load();
        // audio.addEventListener('canplay', () => {
        //   console.log('canplay');
        //   audio.play();
        // });
        
      } catch (error) {
        showToast('留言播放失败！', 0);
      }
    }
  }
}
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
          color:#404657;
          span {
            height: 40px;
            width: 74px;
            border-radius: 5px;
            color: #fff;
            font-size: 20px;
          }
          .tag-read {
            background-color: rgba($color: #404357, $alpha: 0.3);
          }
          .tag-unread {
            background-color: rgba($color: #FF0202, $alpha: 0.6);
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
          background-image: url('../../../../assets/img/skill/btn_play.png');
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
      }
    }
  }
</style>