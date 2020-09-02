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
          <ul class="list">
            <li
              v-for="(item, index) in messageList"
              :key="index">
              <div class="content">
                <div>
                  <span class="title">
                    {{item.name}}
                    <img src="../../../../assets/img/skill/readed_tag.png"/>
                  </span>
                  <h3 class="subtitle">{{item.date}}</h3>
                </div>
                <button></button>
              </div>
            </li>
          </ul>
          <div class="panel">
            <div class="title">
              已读留言保留7天，过期自动删除
            </div>
            <ul>
              <li
                v-for="(item, index) in messageList"
                link
                :key="index"
                :title="item.name"
                :footer="item.date"
              >
              </li>
            </ul>
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
              <button class="btn-close" @click="stopRecord"></button>
            </div>
            <div class="content">

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
          <input v-model="voiceMsgName" maxlength="10" type="text" placeholder="请输入留言人姓名或昵称">
          <span :class="{'high-light': voiceMsgName}">{{countLabel}}</span>
          <div class="tips" v-show="!isNameValid">
            昵称仅限汉字哟~
          </div>
        </div>
        <div class="btn-group">
          <button @click="onCancel">取消</button>
          <button @click="onConfirm" :disabled="voiceMsgName ? false: true">确定</button>
        </div>
      </gree-dialog>
    </gree-page>
  </gree-view>
</template>
<script>
import { Header, Dialog } from 'gree-ui';
export default {
  components: {
    [Header.name]: Header,
    [Dialog.name]: Dialog,
  },
  data() {
    return {
      messageList: [], // 语音留言列表
      isEmpty: true, // 语音留言是否为空
      isRecording: false, // 是否正在留言
      voiceMsgName: '', // 留言人姓名或昵称
      countLabel: '0/10', // 留言姓名计数
      showDialog: false, // 是否显示留言命名框
      isNameValid: true,
    }
  },
  watch: {
    voiceMsgName(val) {
      this.isNameValid = true;
      console.log('val', val);
      if (val.trim()) {
        let isValid = /^[\u4e00-\u9fa5\s]*$/gi.test(val.trim());
        if(!isValid) {
          this.isNameValid = false;
        }
        this.countLabel = `${val.trim().length}/10`;
      } else {
        this.voiceMsgName = '';
        this.countLabel = '0/10';
      }
    }
  },
  created() {
    // todo 获取数据
  },
  methods: {
    resetData() {
      this.showDialog = false;
      this.voiceMsgName = '';
      this.countLabel = '0/10';
    },
    edit() {

    },
    finishRecord() {
      this.isRecording = false;
      this.showDialog = true;
    },
    startRecord() {
      this.isRecording = true
    },
    stopRecord() {
      this.isRecording = false;
    },
    onCancel() {
      this.resetData();
    },
    onConfirm() {
      const name = this.voiceMsgName;
      this.resetData();
      this.messageList.push({name, date: '2020年08月01日', duration: '23秒'});
      this.isEmpty = false;
    }
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
      .page-main {
        height: 100%;
        .gree-header {
          .gree-header-right {
            right: 54px;
          }
        }
        
        .placeholder {
          padding-top: 292px;
          text-align: center;
          img {
            width: 963px;
            height: 747px;
          }
        }

        .list {
          margin: 0;
          list-style: none;
          li {
            padding-left: 54px;
            background: #fff;
            &:not(:last-child) {
              .content {
                border-bottom: 1px solid #dbdbdb;
              }
            }
            .content {
              padding: 41px 54px 41px 0px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .title {
                font-size: 46px;
                color:#404657;
                img {
                  height: 40px;
                  width: 74px;
                }
              }
              .subtitle {
                font-size: 42px;
                color: #989898;
                margin-top: 16px;
              }
            }
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
            background-image: url('../../../../assets/img/skill/wave.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
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