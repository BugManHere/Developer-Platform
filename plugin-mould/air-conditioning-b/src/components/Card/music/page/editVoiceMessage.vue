<template>
   <gree-view bg-color="#ffffff">
    <gree-page class="page-edit-voice-message">
      <gree-header style="background-color: #fff;">
        语音留言簿
       <a slot="right" @click="selectAll" v-show="!isEmpty">全选</a>
      </gree-header>
      <div class="page-main">
        <div v-if="isEmpty" class="placeholder">
          <img src="../../../../assets/img/skill/voice_message_bg.png">
        </div>
        <div v-else>
          <voice-msg-list :messageList="messageList">
            <template slot-scope="slotProps">
               <button @click="setState(slotProps.item)" :class="slotProps.item.selected ? 'btn-checked': 'btn-unchecked'"></button>
            </template>
          </voice-msg-list>
          <div class="panel">
            <div class="title">
              已读留言保留7天，过期自动删除
            </div>
            <voice-msg-list :messageList="messageList"></voice-msg-list>
          </div>
        </div>
      </div>
      <div class="toolbar">
        <div class="btn-wrapper">
          <button class="btn-voice" @click="deleteRecord"></button>
          <span>删除</span>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, Dialog } from 'gree-ui';
import VoiceMessageList from './voiceMessageList';
export default {
  components: {
    [Header.name]: Header,
    [Dialog.name]: Dialog,
    'voice-msg-list': VoiceMessageList,
  },
  data() {
    return {
      messageList: [], // 语音留言列表
      isEmpty: true, // 语音留言是否为空
    }
  },
  created() {
    // test
    this.messageList.push({name: '测试', date: '2020年08月01日', duration: '23秒', read: false, isUploading: false, selected: false});
    this.isEmpty = false;
  },
  methods: {
    selectAll() {

    },
    setState(item) {
      item.selected = !item.selected;
    },
    deleteRecord() {
      console.log(this.messageList);
    }
  }
}
</script>

<style lang="scss">
@mixin iconBtn($size, $url) {
  appearance: none;
  outline: none;
  border: none;
  border-radius: 100%;
  width: $size;
  height: $size;
  background-color: transparent;
  background-image: url($url);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  &:active {
    opacity: 0.5;
  }
}
.page-edit-voice-message {
    .page-content {
      padding-bottom: calc(0px + env(safe-area-inset-bottom));
      .gree-header {
        .gree-header-right {
          right: 54px;
        }
      }
      .page-main {
        height: 100%;
        .placeholder {
          padding-top: 292px;
          text-align: center;
          img {
            width: 963px;
            height: 747px;
          }
        }

        .panel {
          .title {
            color: #CDCDCD;
            font-size: 42px;
            padding: 25px 0px 25px 56px;
          }
        }
      }
      .toolbar {
        z-index: 4;
        position: absolute;
        bottom: 76px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .btn-wrapper {
          text-align: center;
          .btn-voice {
            @include iconBtn(181px, '../../../../assets/img/skill/start_record.png');
          }
          .btn-done {
            @include iconBtn(181px, '../../../../assets/img/skill/stop_record.png');
          }
          span {
            display: block;
            color: #404657;
            font-size: 46px;
            margin-top: 10px;
            word-spacing: -20px;
          }
        }
      }
    }
    .btn-checked {
      @include iconBtn(58px, '../../../../assets/img/skill/checked.png');
    }
    .btn-unchecked {
      @include iconBtn(58px, '../../../../assets/img/skill/unchecked.png');
    }
  }
</style>