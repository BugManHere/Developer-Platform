<template>
   <gree-view bg-color="#ffffff">
    <gree-page class="page-voice-message">
      <gree-header style="background-color: #fff;">
        语音留言簿
       <a slot="right" @click="edit" v-show="!isEmpty">编辑</a>
      </gree-header>
      <div class="page-main">
        <div v-if="isEmpty" class="placeholder">
          <img src="../../../../assets/img/skill/voice_message_bg.png">
        </div>
        <div v-else>
          <voice-msg-list :message-list="unreadList"></voice-msg-list>
          <div class="panel" v-show="readList && readList.length">
            <div class="title">
              已读留言保留7天，过期自动删除
            </div>
            <voice-msg-list :message-list="readList"></voice-msg-list>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-show="isRecording" class="mask"></div>
      </transition> 
      <div class="toolbar">
        <transition name="fade">
          <div class="voice-indicator" v-show="isRecording">
            <div class="title">
              <button class="btn-close" @click="cancelRecord"></button>
            </div>
            <div class="content">
              <audio-wave></audio-wave>
            </div>
          </div>
        </transition>
        <transition name="fade" mode="out-in">
          <div v-if="isRecording" class="btn-wrapper">
            <button class="btn-done" @click="finishRecord"></button>
            <span style="color:#fff;">完成</span>
          </div>
          <div v-else class="btn-wrapper">
            <button class="btn-voice" @click="startRecord"></button>
            <span>留言</span>
          </div>
        </transition>
      </div>
      <gree-dialog v-model="showDialog">
        <div class="text-input-wrapper">
          <input ref="msgNameIput" v-model="voiceMsgName" maxlength="10" type="text" placeholder="请输入留言人姓名或昵称">
          <span :class="{'high-light': voiceMsgName}">{{countLabel}}</span>
          <div class="tips" v-show="!isNameValid">
            昵称仅限汉字哟~
          </div>
        </div>
        <div class="btn-group">
          <button @click="onCancel">取消</button>
          <button @click="onConfirm" :disabled="(voiceMsgName && isNameValid) ? false: true">确定</button>
        </div>
      </gree-dialog>
    </gree-page>
  </gree-view>
</template>
<script>
import { Header, Dialog } from 'gree-ui';
import VoiceMessageList from './voiceMessageList';
import AudioWave from '../../../AudioWave';
import { mapState } from 'vuex';
import { 
  voiceSkillMsgAudioControl, 
  voiceSkillMsgList,
  voiceSkillMsgAdd,
  changeBarColor, 
  showToast,
  showLoading,
  hideLoading, 
} from '../../../../../public/static/lib/PluginInterface.promise';

let gTimerForGetAudioStatus = null; // 定时器获取录音状态

export default {
  components: {
    [Header.name]: Header,
    [Dialog.name]: Dialog,
    'voice-msg-list': VoiceMessageList,
    'audio-wave': AudioWave,
  },
  data() {
    return {
      readList: [], // 已读语音留言列表
      unreadList: [], // 未读语音留言列表
      isEmpty: true, // 语音留言是否为空
      isRecording: false, // 是否正在留言
      voiceMsgName: '', // 留言人姓名或昵称
      countLabel: '0/10', // 留言姓名计数
      showDialog: false, // 是否显示留言命名框
      isNameValid: true,
      startTime: 0, // 留言开始时间,
      duration: 0,
    }
  },
  computed: {
    ...mapState({
      mac: state => state.mac
    }),
  },
  watch: {
    voiceMsgName(val) {
      this.isNameValid = true;
      console.log('val', val);
      const name = val && val.trim();
      if (name) {
        let isValid = /^[\u4e00-\u9fa5\s]*$/gi.test(name);
        if(!isValid) {
          this.isNameValid = false;
        }
        this.countLabel = `${name.length}/10`;
      } else {
        this.voiceMsgName = '';
        this.countLabel = '0/10';
      }
    }
  },
  created() {
    changeBarColor('#fffffe');
    this.getMessageList();
  },
  methods: {
    async getMessageList() {
      showLoading();
      let voiceMsgList = await voiceSkillMsgList(this.mac);
      hideLoading();
      console.log(voiceMsgList);
      if (!voiceMsgList) {
        this.isEmpty = true;
        return;
      }
      if (typeof(voiceMsgList) === 'string') {
        voiceMsgList = JSON.parse(voiceMsgList);
      }
      if (!voiceMsgList.data || voiceMsgList.data.length === 0) {
        this.isEmpty = true;
        return;
      }
      this.isEmpty = false;
      this.unreadList = voiceMsgList.data.filter(x => x.status === 1);
      this.readList = voiceMsgList.data.filter(x => x.status === 2);
    },
    resetData() {
      this.showDialog = false;
      this.voiceMsgName = '';
      this.countLabel = '0/10';
    },
    edit() {
      this.$router.push('/EditVoiceMessage');
    },
    clearInterval() {
      if (gTimerForGetAudioStatus) {
        clearInterval(gTimerForGetAudioStatus);
        gTimerForGetAudioStatus = null;
      }
    },
    finishRecord() {
      console.log('finishRecord');
      this.isRecording = false;
      this.clearInterval();
      this.duration = Date.now() - this.startTime; //录音时长
      if (this.duration <= 1000) {
        showToast('录音时间过短！', 0);
        return;
      } 
      this.showDialog = true;
      voiceSkillMsgAudioControl(this.mac, 'stop');
    },
    async startRecord() {
      try {
        const voiceMsgCount = this.unreadList.length + this.readList.length;
        if (voiceMsgCount === 5) {
          showToast('留言数量已达上限，请先删除历史留言!', 0);
          return;
        }
        this.clearInterval();
        voiceSkillMsgAudioControl(this.mac, 'start');
        let result = await voiceSkillMsgAudioControl(this.mac, 'getStatus');
        console.log('ret:', result);
        if (result) {
          if (typeof(result) === 'string') {
            result = JSON.parse(result);
          }
        }
        if (result.status !== 'recording') {
          throw new Error('录音开启失败');
        }
        this.isRecording = true;
        this.startTime = new Date().getTime();
        gTimerForGetAudioStatus = setInterval(() => {
          voiceSkillMsgAudioControl(this.mac, 'getStatus').then((data) => {
            console.log(data);
          });  
        }, 100);
        
      } catch (error) {
        console.log(error);
        this.isRecording = false;
        showToast('录音开启失败', 0);
      }
    },
    cancelRecord() {
      this.isRecording = false;
      this.clearInterval();
      voiceSkillMsgAudioControl(this.mac, 'cancel');
    },
    onCancel() {
      voiceSkillMsgAudioControl(this.mac, 'cancel');
      this.resetData();
    },
    getCreatedTime() {
      const date = new Date(this.startTime);
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month >= 10 ? month : `0${month}`;
      let day = date.getDate();
      day = day >= 10 ? day : `0${day}`;
      return `${year}-${month}-${day}`;
    },
    async onConfirm() {
      try {
        const name = this.voiceMsgName;
        const duration = this.duration;
        this.resetData();
        this.unreadList.push({label: name, createdAt: this.getCreatedTime(), duration, status: 1, isUploading: true});
        this.isEmpty = false;
        let result = await voiceSkillMsgAdd(this.mac, JSON.stringify({label: name, duration: duration}));
        if (!result) {
          throw new Error('保存失败');
        }
        if (typeof(result) === 'string') {
          result = JSON.parse(result);
        }
        if (!result.code || result.code != 200) {
          throw new Error('保存失败');
        }
      } catch (error) {
        showToast(error.message, 0);
      }
      this.getMessageList(); // 刷新留言列表
    },
  }
}
</script>
<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.gree-dialog {
  /deep/ .gree-dialog-content {
    width: 970px;
    border-radius: 13px;
    .gree-dialog-body {
      padding: 0;
      .text-input-wrapper {
        margin: 56px 50px 90px;
        width: 870px;
        height: 109px;
        border-radius: 55px;
        background-color: #F4F4F4;
        position: relative;
        font-size: 45px;
        input {
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          padding: 0 57px;
          color: #404657;
          &::placeholder {
            color:rgba($color: #404657, $alpha: 0.3);
          }
        }
        span {
          color:rgba($color: #404657, $alpha: 0.3);
          position: absolute;
          right: 56px;
          top: 50%;
          transform: translateY(-50%);
          &.high-light {
            color: #404657;
          }
        }
        .tips {
          font-size: 42px;
          color: #FF0202;
          padding-top: 20px;
          padding-left: 18px;
        }
      }
      
      .btn-group {
        display: flex;
        height: 140px;
        box-sizing: border-box;
        border-top: 2px solid rgba($color: #080404, $alpha: 0.1);
        button {
          width: 50%;
          box-sizing: border-box;
          background: none;
          outline: none;
          appearance: none;
          border: none;
          font-size: 45px;
          color: #404657;
          &:first-child {
            border-right: 1px solid rgba($color: #080404, $alpha: 0.1);
          }
          &:last-child {
            color: #00AEFF;
            border-left: 1px solid rgba($color: #080404, $alpha: 0.1);
          }
          &:active {
            opacity: 0.3;
          }
          &:disabled {
            color: #404657;
            opacity: 0.3;
          }
        }
      }
    }
  }
}
</style>
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
  .page-voice-message {
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
      .mask {
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 3;
        background-color: rgba($color: #000000, $alpha: 0.5);
      }
      .toolbar {
        z-index: 4;
        position: absolute;
        // top: 1453px;
        bottom: 76px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .voice-indicator {
          width: 970px;
          height: 660px;
          background-color: #fff;
          margin-bottom: 88px;
          border-radius: 36px;
          position: relative;
          &::before {
            position: absolute;
            content: '';
            width: 0px;
            height: 0px;
            left: 50%;
            top: 100%;
            transform: translateX(-50%);
            border-top: 54px solid #fff;
            border-left: 41px solid transparent;
            border-right: 41px solid transparent;
            border-bottom: 54px solid transparent;
          }
          .title {
            position: relative;
            text-align: center;
            .btn-close {
              @include iconBtn(60px, '../../../../assets/img/skill/btn_close.png');
              margin: 25px 25px 0px;
              position: absolute;
              right: 0px;
            }
          }
          .content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 863px;
            height: 167px;
          }
        }
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
  }
</style>