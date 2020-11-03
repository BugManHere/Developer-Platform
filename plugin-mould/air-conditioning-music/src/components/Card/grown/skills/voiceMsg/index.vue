<template>
  <gree-view bg-color="#ffffff">
    <gree-page class="page-voice-message">
      <gree-header style="background-color: #fff;" 
                  :left-options="{preventGoBack: true}" 
                  @on-click-back="clickBack">
        语音留言簿
        <a slot="right" @click="gotoEdit" v-show="!isEmpty">编辑</a>
      </gree-header>
      <div class="page-main">
        <div v-if="isEmpty" class="placeholder">
          <img src="@assets/img/skill/voice_message_bg.png" />
        </div>
        <div v-else>
          <voice-msg-list :message-list="unreadList" @play-msg="playVoiceMsg"></voice-msg-list>
          <div class="panel" v-show="readList && readList.length">
            <div class="title">
              已读留言保留7天，过期自动删除
            </div>
            <voice-msg-list :message-list="readList" @play-msg="playVoiceMsg"></voice-msg-list>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-show="isRecording" class="mask"></div>
      </transition>
      <div class="toolbar" v-show="!(isLoadFailed || isShrink)">
        <transition name="fade">
          <div class="voice-indicator" v-show="isRecording">
            <div class="title">
              <div class="time-label">
                <span v-show="countdown > 0">{{ countdown }}秒后将结束录音</span>
                <span>{{ timing }}s</span>
              </div>
              <button class="btn-close" @click="cancelRecord"></button>
            </div>
            <div class="content">
              <audio-wave ref="audioWave"></audio-wave>
            </div>
          </div>
        </transition>
        <transition name="fade" mode="out-in">
          <div v-if="isRecording" class="btn-wrapper" @click="finishRecord">
            <button class="btn-done"></button>
            <span style="color:#fff;">完成</span>
          </div>
          <div v-else class="btn-wrapper" @click="startRecord">
            <button class="btn-voice"></button>
            <span>留言</span>
          </div>
        </transition>
      </div>
      <gree-dialog v-model="showDialog">
        <div class="text-input-wrapper">
          <input ref="nameInput" v-model="voiceMsgName" maxlength="10" type="text" placeholder="请输入留言人姓名或昵称" />
          <span :class="{ 'high-light': voiceMsgName }">{{ countLabel }}</span>
          <div class="tips" v-show="!isNameValid">
            昵称仅限汉字哟~
          </div>
        </div>
        <div class="btn-group">
          <button @click="onCancel">取消</button>
          <button @click="onConfirm" :disabled="voiceMsgName && isNameValid ? false : true">确定</button>
        </div>
      </gree-dialog>
      <error-overlay :show="isLoadFailed" @reload="onReload"></error-overlay>
    </gree-page>
  </gree-view>
</template>
<script>
import { mapState } from 'vuex';
import { Header, Dialog } from 'gree-ui';
import VoiceMessageList from './List';
import AudioWave from './AudioWave';
import ErrorOverlay from '../ErrorOverlay';
import {
  voiceSkillMsgAudioControl,
  voiceSkillMsgList,
  voiceSkillMsgAdd,
  voiceSkillMsgPlay,
  changeBarColor,
  showToast,
  showLoading,
  hideLoading
} from '@PluginInterface';

let gTimerForGetAudioStatus = null; // 定时器获取录音状态
let gTimerForTiming = null; // 定时器用于计时显示
let gTimerForUpdateMsgList = null; // 定时器用于轮询语音留言列表

export default {
  components: {
    [Header.name]: Header,
    [Dialog.name]: Dialog,
    'voice-msg-list': VoiceMessageList,
    'audio-wave': AudioWave,
    'error-overlay': ErrorOverlay
  },
  data() {
    return {
      readList: [], // 已读语音留言列表
      unreadList: [], // 未读语音留言列表
      isEmpty: false, // 语音留言是否为空,默认是有数据
      isRecording: false, // 是否正在录制留言
      isPlaying: false, // 是否正在播放留言
      isUploading: false, // 是否正在上传留言
      voiceMsgName: '', // 留言人姓名或昵称
      countLabel: '0/10', // 留言姓名计数
      showDialog: false, // 是否显示留言命名框
      isNameValid: true,
      startTime: 0, // 留言开始时间,
      duration: 0,
      timing: 0, // 计时显示
      countdown: 0, // 倒计时显示
      isLoadFailed: false, // 列表是否加载失败
      isShrink: false // 手机键盘弹出时，页面窗口会缩小，语音留言按钮使用的是绝对定位，会被顶到键盘上，故增加该变量判断窗口大小是否缩小，窗口缩小时隐藏留言按钮，恢复时显示按钮
    };
  },
  computed: {
    ...mapState({
      mac: state => state.mac
    })
  },
  watch: {
    voiceMsgName(val) {
      this.isNameValid = true;
      // console.log('val', val);
      const name = val && val.trim();
      if (name) {
        let isValid = /^[\u4e00-\u9fa5\s]*$/gi.test(name);
        if (!isValid) {
          this.isNameValid = false;
        }
        this.countLabel = `${name.length}/10`;
      } else {
        this.voiceMsgName = '';
        this.countLabel = '0/10';
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // 安卓物理返回键处理，停止录音，重置状态
    if (this.showDialog || this.isRecording) {
      if (this.showDialog) {
        this.onCancel();
      } else {
        this.cancelRecord();
      }
      next(false);
    } else {
      next();
    }
  },
  created() {
    changeBarColor('#fffffe');
    const windowHeight = window.outerHeight;
    const resizeHandler = () => {
      if (window.outerHeight < windowHeight) {
        this.isShrink = true;
      } else {
        this.isShrink = false;
      }
    };
    window.addEventListener('resize', resizeHandler, false);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', resizeHandler, false);
      if (gTimerForUpdateMsgList) {
        clearInterval(gTimerForUpdateMsgList);
        gTimerForUpdateMsgList = null;
      }
      voiceSkillMsgAudioControl(this.mac, 'stopPlay');
      this.resetPlayState();
      // 在页面销毁之前，发送停止播放的指令
      // stopPlay是与主体沟通新增的
    });
    this.getMessageList();
    // 8秒轮询刷新列表
    gTimerForUpdateMsgList = setInterval(() => {
      this.updateMessageList();
    }, 8 * 1000);
  },
  mounted() {
    if(window.history && window.history.pushState){
      history.pushState(null,null,document.URL);
      window.addEventListener('popstate',this.clickBack,false);
    }
  },
  destroyed(){
    window.removeEventListener('popstate',this.clickBack,false);
  },
  // mounted与destory共同监听物理返回键
  methods: {
    async getMessageList() {
      try {
        this.isLoadFailed = false;
        showLoading();
        let voiceMsgList = await voiceSkillMsgList(this.mac);
        hideLoading();
        console.log(voiceMsgList);
        if (!voiceMsgList) {
          this.isEmpty = true;
          throw new Error('获取留言列表失败');
        }
        if (typeof voiceMsgList === 'string') {
          voiceMsgList = JSON.parse(voiceMsgList);
        }
        if (!voiceMsgList.data || voiceMsgList.data.length === 0) {
          this.isEmpty = true;
          console.log('留言列表为空！');
          return;
        }
        this.isEmpty = false;
        this.setMessageList(voiceMsgList);
      } catch (error) {
        console.log(error);
        this.isLoadFailed = true;
      }
    },
    async updateMessageList() {
      // 页面加载失败、正在录制留言、正在播放留言以及上传留言时不更新列表
      if (this.isLoadFailed || this.isRecording || this.isPlaying || this.isUploading) {
        return;
      }
      let voiceMsgList = await voiceSkillMsgList(this.mac);
      if (!voiceMsgList) {
        return;
      }
      if (typeof voiceMsgList === 'string') {
        voiceMsgList = JSON.parse(voiceMsgList);
      }
      if (!voiceMsgList.data || voiceMsgList.data.length === 0) {
        this.isEmpty = true;
        return;
      }
      this.isEmpty = false;
      console.log('轮询---刷新列表');
      this.setMessageList(voiceMsgList);
    },
    setMessageList(voiceMsgList) {
      /* eslint-disable */
      this.unreadList = voiceMsgList.data
        .filter(x => x.status === 1)
        .sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime())
        .map(x => {
          x.isUploading = false;
          x.isPlaying = false;
          return x;
        });
      this.readList = voiceMsgList.data
        .filter(x => x.status === 2)
        .sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime())
        .map(x => {
          x.isUploading = false;
          x.isPlaying = false;
          return x;
        });
      /* eslint-enable */
    },
    onReload() {
      this.getMessageList();
    },
    resetData() {
      this.showDialog = false;
      this.voiceMsgName = '';
      this.countLabel = '0/10';
    },
    gotoEdit() {
      // this.$router.push('/VoiceMessage/Edit');
      this.$router.replace('/VoiceMessage/Edit');
      // 为了实现点击了“删除”按钮后，能返回播放页面
    },
    clearInterval() {
      if (gTimerForGetAudioStatus) {
        clearInterval(gTimerForGetAudioStatus);
        gTimerForGetAudioStatus = null;
      }
      if (gTimerForTiming) {
        clearInterval(gTimerForTiming);
        gTimerForTiming = null;
      }
    },
    finishRecord() {
      console.log('finishRecord');
      this.isRecording = false;
      this.clearInterval();
      this.duration = Date.now() - this.startTime; // 录音时长
      if (this.duration <= 1000) {
        showToast('录音时间过短！', 0);
        return;
      }
      this.showDialog = true;
      setTimeout(() => {
        const nameInput = this.$refs.nameInput;
        if (nameInput) {
          nameInput.focus();
        }
      }, 0);
      voiceSkillMsgAudioControl(this.mac, 'stop');
    },
    async startRecord() {
      try {
        const voiceMsgCount = this.unreadList.length + this.readList.length;
        if (voiceMsgCount === 5) {
          showToast('留言数量已达上限，请先删除历史留言!', 0);
          return;
        }
        if (this.isPlaying) {
          showToast('留言播放中，请稍后！', 0);
          return;
        }
        this.timing = 0;
        this.countdown = 0;
        this.clearInterval();
        voiceSkillMsgAudioControl(this.mac, 'start');
        let result = await voiceSkillMsgAudioControl(this.mac, 'getStatus');
        console.log('ret:', result);
        if (result) {
          if (typeof result === 'string') {
            result = JSON.parse(result);
          }
        }
        if (result.status !== 'recording') {
          throw new Error('录音开启失败');
        }
        this.isRecording = true;
        this.startTime = new Date().getTime();
        this.$refs.audioWave.startWave();
        gTimerForTiming = setInterval(() => {
          this.timing = this.timing + 1;
          if (this.timing >= 50) {
            this.countdown = 60 - this.timing;
            if (this.timing === 60) {
              this.finishRecord();
            }
          }
        }, 1000);
        gTimerForGetAudioStatus = setInterval(() => {
          voiceSkillMsgAudioControl(this.mac, 'getStatus').then(data => {
            const result = JSON.parse(data);
            this.$refs.audioWave.updateWave(result.wave);
          });
        }, 100);
      } catch (error) {
        console.log(error);
        this.isRecording = false;
        // showToast('录音开启失败', 0);
        // 第一次录音时会请求录音权限，弹出这个会影响用户体验
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
      let hours = date.getHours();
      hours = hours >= 10 ? hours : `0${hours}`;
      let minutes = date.getMinutes();
      minutes = minutes >= 10 ? minutes : `0${minutes}`;
      let senconds = date.getSeconds();
      senconds = senconds >= 10 ? senconds : `0${senconds}`;
      return `${year}-${month}-${day} ${hours}:${minutes}:${senconds}`;
    },
    async onConfirm() {
      try {
        this.isUploading = true;
        const name = this.voiceMsgName;
        const duration = this.duration;
        this.resetData();
        this.unreadList.unshift({ label: name, createdAt: this.getCreatedTime(), duration, status: 1, isUploading: true });
        this.isEmpty = false;
        let result = await voiceSkillMsgAdd(this.mac, JSON.stringify({ label: name, duration }));
        if (!result) {
          throw new Error('保存失败');
        }
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        if (!result.code || Number(result.code) !== 200) {
          throw new Error('保存失败');
        }
      } catch (error) {
        showToast(error.message, 0);
      }
      this.isUploading = false;
      this.getMessageList(); // 刷新留言列表
    },
    resetPlayState() {
      // 重置语音留言列表，清除获取播放状态的定时器，重置isPlaying
      this.unreadList.forEach(x => (x.isPlaying = false)); // eslint-disable-line
      this.readList.forEach(x => (x.isPlaying = false)); // eslint-disable-line
      this.clearInterval();
      this.isPlaying = false;
    },
    setPlayStateByGuid(guid) {
      /* eslint-disable */
      this.unreadList.forEach(x => {
        if (x.guid === guid) {
          x.isPlaying = true;
        }
      });
      this.readList.forEach(x => {
        if (x.guid === guid) {
          x.isPlaying = true;
        }
      });
      /* eslint-enable */
    },
    async playVoiceMsg(guid) {
      try {
        console.log(guid);
        this.resetPlayState();
        let result = await voiceSkillMsgPlay(guid);
        // console.log('play result', result);
        if (!result) {
          throw new Error('播放留言失败');
        }
        result = JSON.parse(result);
        if (!result.code || Number(result.code) !== 200) {
          throw new Error('播放留言失败');
        }
        let haveMetStop = false;
        // let StopTime = 0;
        gTimerForGetAudioStatus = setInterval(() => {
          voiceSkillMsgAudioControl(this.mac, 'getStatus').then(data => {
            const result = JSON.parse(data);
            console.log('radio data:',result);
            // if (result.status === 'playing') {
            //   this.isPlaying = true;
            // } else {
            //   // 状态不为playing（停止播放）时，重置状态
            //   this.resetPlayState();
            // }
            // 在第一次播放语音的时候，主体会先传好几个个stop过来
            // 这几个stop会影响实际的播放状态的判断
            // if(result.status === 'stop' && StopTime < 3 && !haveMetStop){
            if(result.status === 'stop' && !haveMetStop){
              // StopTime++;
              console.log('stop------->')
              return;
            }
            if(result.status === 'playing' || result.status === ''){
              this.isPlaying = true;
              haveMetStop = true;
              return;
            }
            this.resetPlayState();
          });
        }, 100);
        this.setPlayStateByGuid(guid);
      } catch (error) {
        console.log(error);
        this.resetPlayState();
        showToast('留言播放失败！', 0);
      }
    },
    clickBack(){
      this.$router.replace('/Home');
    }
  }
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
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
        background-color: #f4f4f4;
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
            color: rgba($color: #404657, $alpha: 0.3);
          }
        }
        span {
          color: rgba($color: #404657, $alpha: 0.3);
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
          color: #ff0202;
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
            color: #00aeff;
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
    padding-bottom: 0px;
    padding-bottom: calc(0px + env(safe-area-inset-bottom));
    .gree-header {
      .gree-header-right {
        right: 54px;
      }
    }
    .page-main {
      height: calc(100vh - 120px);
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
          color: #cdcdcd;
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
      background-color: transparent;
      z-index: 4;
      position: absolute;
      height: auto;
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
            @include iconBtn(60px, '../../../../../assets/img/skill/btn_close.png');
            margin: 25px 25px 0px;
            position: absolute;
            right: 0px;
          }
          .time-label {
            position: absolute;
            top: 56px;
            left: 50%;
            transform: translateX(-50%);
            span {
              display: block;
              font-size: 45px;
              color: #404657;
              &:first-child {
                font-size: 48px;
                color: #ff0202;
                margin-bottom: 52px;
              }
            }
          }
        }
        .content {
          position: absolute;
          top: 267px;
          left: 50%;
          transform: translateX(-50%);
          width: 863px;
          height: 167px;
        }
      }
      .btn-wrapper {
        text-align: center;
        .btn-voice {
          @include iconBtn(181px, '../../../../../assets/img/skill/start_record.png');
        }
        .btn-done {
          @include iconBtn(181px, '../../../../../assets/img/skill/stop_record.png');
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
