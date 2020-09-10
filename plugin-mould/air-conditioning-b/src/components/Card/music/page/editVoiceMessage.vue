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
          <voice-msg-list :message-list="unreadList">
            <template slot-scope="slotProps">
               <button @click="setState(slotProps.item)" :class="slotProps.item.selected ? 'btn-checked': 'btn-unchecked'"></button>
            </template>
          </voice-msg-list>
          <div class="panel" v-show="readList && readList.length">
            <div class="title">
              已读留言保留7天，过期自动删除
            </div>
            <voice-msg-list :message-list="readList"></voice-msg-list>
          </div>
        </div>
      </div>
      <div class="toolbar" v-show="!isLoadFailed">
        <div class="btn-wrapper">
          <button class="btn-delete" @click="onDelete"></button>
          <span>删除</span>
        </div>
      </div>
      <error-overlay :show="isLoadFailed" @reload="() => {this.getMessageList();}"></error-overlay>
    </gree-page>
    <gree-dialog 
      title="提醒"
      v-model="dialogOption.open" 
      :btns="dialogOption.btns">
      确定要删除所选的留言吗？
    </gree-dialog>
  </gree-view>
</template>

<script>
import { mapState } from 'vuex';
import { Header, Dialog } from 'gree-ui';
import VoiceMessageList from './voiceMessageList';
import ErrorOverlay from '../../../ErrorOverlay';
import { 
  voiceSkillMsgDel,
  voiceSkillMsgList,
  changeBarColor, 
  showToast 
} from '../../../../../public/static/lib/PluginInterface.promise';
export default {
  components: {
    [Header.name]: Header,
    [Dialog.name]: Dialog,
    'voice-msg-list': VoiceMessageList,
    'error-overlay': ErrorOverlay,
  },
  data() {
    return {
      readList: [], // 已读语音留言列表
      unreadList: [], // 未读语音留言列表
      isEmpty: true, // 语音留言是否为空
      dialogOption: {
        open: false,
        btns: [{
          text: '取消',
          handler: () => { this.dialogOption.open = false; }
        }, {
          text: '删除',
          handler: () => { this.deleteRecords(); }
        }]
      },
      selectedRecords: [], // 选中需要删除的留言
      isLoadFailed: false, // 列表是否加载失败
    }
  },
  computed: {
    ...mapState({
      mac: state => state.mac,
    }),
  },
  beforeRouteLeave(to, from, next) {
    if (this.dialogOption.open) {
      this.dialogOption.open = false;
      next(false);
    } else {
      next();
    }
  },
  created() {
    changeBarColor('#fffffe');
    this.getMessageList();
  },
  methods: {
    async getMessageList() {
      try {
        this.isLoadFailed = false;
        let voiceMsgList = await voiceSkillMsgList(this.mac);
        console.log(voiceMsgList);
        if (!voiceMsgList) {
          this.isEmpty = true;
          throw new Error('获取留言列表失败');
        }
        if (typeof(voiceMsgList) === 'string') {
          voiceMsgList = JSON.parse(voiceMsgList);
        }
        if (!voiceMsgList.data || voiceMsgList.data.length === 0) {
          this.isEmpty = true;
          throw new Error('获取留言列表失败');
        }
        this.isEmpty = false;
        this.unreadList = voiceMsgList.data.filter(x => x.status === 1)
          .map(x => { x.selected = false; return x;})
          .sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
        this.readList = voiceMsgList.data.filter(x => x.status === 2)
          .map(x => { x.selected = false; return x;})
          .sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
      } catch (error) {
        console.log(error);
        this.isLoadFailed = true;
      }
      
    },
    selectAll() {
      this.unreadList.forEach(x => {
        x.selected = true;
      });
      this.readList.forEach(x => {
        x.selected = true;
      });
    },
    setState(item) {
      item.selected = !item.selected;
    },
    async deleteRecords() {
      try {
        if (!this.selectedRecords || this.selectedRecords.length === 0) {
          throw new Error('请选择要删除的留言');
        }
        let data = {guidList: this.selectedRecords};
        let result = await voiceSkillMsgDel(JSON.stringify(data));
        this.dialogOption.open = false;
        console.log('del:', result);
        if (!result) {
          throw new Error('删除失败');
        }
        if (typeof(result) === 'string') {
          result = JSON.parse(result);
        }
        if (!result.code || result.code != 200) {
          throw new Error('删除失败');
        }
        this.getMessageList(); // 刷新语音留言列表  
      } catch (error) {
        showToast(error.message, 0);
      }
     
    },
    onDelete() {
      this.selectedRecords = [];
      const selectedUnreadRecords = this.unreadList.filter(x => x.selected === true).map(x => x.guid);
      if (selectedUnreadRecords && selectedUnreadRecords.length) {
        this.selectedRecords.push(...selectedUnreadRecords);
      }
      const selectedReadRecords = this.readList.filter(x => x.selected === true).map(x => x.guid);
      if (selectedReadRecords && selectedReadRecords.length) {
        this.selectedRecords.push(...selectedReadRecords);
      }
      if (this.selectedRecords.length > 0) {
        this.dialogOption.open = true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
 .gree-dialog {
 /deep/.gree-dialog-content {
    width: 970px;
    .gree-dialog-body {
      text-align: center;
      font-size: 42px;
      padding-bottom: 100px;
      color: #404657;
      .gree-dialog-title {
        font-size: 45px;
        margin-bottom: 57px;
      }
    }
    
    .gree-dialog-actions {
      .gree-dialog-btn {
        height: 148px;
        line-height: 148px;
        font-size: 46px;
        color: #404657;
        &:last-child {
          color:#FF0202;
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
          .btn-delete {
            @include iconBtn(181px, '../../../../assets/img/skill/btn_delete.png');
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