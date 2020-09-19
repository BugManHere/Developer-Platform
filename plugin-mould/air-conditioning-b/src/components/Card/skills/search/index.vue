<template>
  <share v-model="keyword" @search="onSearch" @reload="onReload" :show-error="isLoadFailed">
    <div class="panel">
      <p class="title">热门搜索</p>
      <div class="tags">
        <gree-tag 
          v-for="(item, index) in hot" 
          :key="index"
          size="small" 
          shape="circle" 
          type="fill" 
          fill-color="#F2F2F2">
          {{ item }}
        </gree-tag>
      </div>
    </div>
    <div class="panel">
      <div class="title">
        <span>历史记录</span>
        <img
          class="icon-del"
          @click="showDialog"
          src="../../../../assets/img/skill/gr_delete_icon.png"/>
      </div>
      <div class="tags">
        <gree-tag 
          v-for="(item, index) in history" 
          :key="index"
          size="small" 
          shape="circle" 
          type="fill" 
          fill-color="#F2F2F2">
          {{ item }}
        </gree-tag>
      </div>
    </div>
    <gree-dialog 
      v-model="dialogOption.open" 
      :btns="dialogOption.btns">
      确定要清空全部历史记录吗？
    </gree-dialog>
  </share>
</template>

<script>
import { mapState } from 'vuex';
import { Tag, Dialog } from 'gree-ui';
import Share from './share';
import { showLoading, hideLoading, showToast, voiceACgetSkillSearchJudge, voiceACgetSkillSearchTruncate } from '../../../../../public/static/lib/PluginInterface.promise';

export default {
  components: {
    [Tag.name]: Tag,
    [Dialog.name]: Dialog,
    share: Share,
  },
  data() {
    return {
      keyword: '',
      hot: [],
      history: [],
      isLoadFailed: false,
      dialogOption: {
        open: false,
        btns: [{
          text: '取消',
          handler: () => { this.dialogOption.open = false; }
        }, {
          text: '确定',
          handler: () => { this.clearHistory(); }
        }]
      },
    };
  },
  computed: {
    ...mapState({
      mac: state => state.mac
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
    this.setHistoryAndHotItems();
  },
  methods: {
    async setHistoryAndHotItems() {
      try {
        this.isLoadFailed = false;
        showLoading();
        let result = await voiceACgetSkillSearchJudge(this.mac);
        hideLoading();
        if (!result) {
          throw new Error('语音技能历史和热门搜索查询为空');
        }
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        this.hot = result.hot;
        this.history = result.history;
      } catch (error) {
        console.log(error);
        this.isLoadFailed = true;
      }
    },
    onReload() {
      console.log('onReload');
      this.setHistoryAndHotItems();
    },
    onSearch() {
      this.$router.push(`/SkillSearch/Result?keyword=${this.keyword}`);
    },
    showDialog() {
      this.dialogOption.open = true;
    },
    async clearHistory() {
      this.dialogOption.open = false;
      let result = await voiceACgetSkillSearchTruncate(this.mac);
      console.log(result);
      if (result) {
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        if (result.code === 200) {
          this.history = [];
          showToast('清空成功', 1);
        } else {
          showToast('清空失败', 1);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.gree-dialog {
 /deep/.gree-dialog-content {
    width: 970px;
    .gree-dialog-body {
      text-align: center;
      font-size: 42px;
      color: #404657;
    }
    
    .gree-dialog-actions {
      .gree-dialog-btn {
        height: 148px;
        line-height: 148px;
        font-size: 46px;
        color: #404657;
        &:last-child {
          color:#00aeff;
        }
        &:active {
          background-color: rgba($color: #999, $alpha: 0.3);
        }
      }
    }
  }
}
.panel {
  padding: 35px 60px 0px 50px;
  .title {
    font-size: 43px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #404657;
    margin-bottom: 43px;
    .icon-del {
      height: 41px;
      width: 37px;
    }
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    /deep/ .gree-tag {
      margin: 0px 43px 30px 0px; 
      .type-fill {
        color: rgba($color: #404657, $alpha: 0.6) ;
      }
      .size-small {
        padding: 17px 46px;
        font-size: 36px;
        background-color: #F2F2F2;
      }
    }
  }
}
</style>
