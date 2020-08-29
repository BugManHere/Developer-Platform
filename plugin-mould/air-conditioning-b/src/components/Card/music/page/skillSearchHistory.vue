<template>
  <gree-view bg-color="#ffffff">
    <gree-page class="page-skill-search-history">
      <gree-header style="background-color: #fff;">技能搜索</gree-header>
      <div >
        <gree-search-bar
          v-model="value"
          placeholder="请输入要搜索的内容"
          show-action
          shape="round"
          @search="onSearch"
        >
          <gree-button 
            round 
            size="small"
            type="primary" 
            slot="action" 
            @click="onSearch">搜索</gree-button>
        </gree-search-bar>
      </div>
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
            {{item}}
          </gree-tag>
        </div>
      </div>
      <div class="panel">
        <div class="title">
          <span>历史记录</span>
          <img
            class="icon-del"
            @click="clearHistory"
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
            {{item}}
          </gree-tag>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { mapState } from 'vuex';
import { Header, SearchBar, Button, Tag, Dialog, } from 'gree-ui';
import { showLoading, hideLoading, showToast, changeBarColor, voiceACgetSkillSearch, voiceACgetSkillSearchJudge, voiceACgetSkillSearchTruncate } from '../../../../../public/static/lib/PluginInterface.promise';
export default {
  components: {
    [Header.name]: Header,
    [SearchBar.name]: SearchBar,
    [Button.name]: Button,
    [Tag.name]: Tag,
    [Dialog.name]: Dialog,
  },
  data() {
    return {
      value: '',
      hot: [],
      history: [],
    }
  },
  computed: {
    ...mapState({
      mac: state => state.mac
    }),
  },
  created() {
    changeBarColor('#fffffe');
    this.setHistoryAndHotItems();
  },
  methods: {
    async setHistoryAndHotItems() {
      showLoading();
      let result = await voiceACgetSkillSearchJudge(this.mac);
      hideLoading();
      if (result) {
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        this.hot = result.hot;
        this.history = result.history;
      }
    },
    onSearch() {
      let keyword = this.value;
      this.$router.push(`/SkillSearch?keyword=${keyword}`);
    },
    clearHistory() {
      Dialog.confirm({
        title: '',
        content: '确定要清空全部历史记录吗？',
        confirmText: '确定',
        onConfirm: async() => {
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
        },
        cancelText: '取消',
        onCancel: () => console.log('[Dialog.confirm] cancel clicked')
      });
    }
  }
}
</script>

<style lang="scss">
  .page-skill-search-history {
    background-color: #fff;
    .page-content {
      position: relative;
      .gree-search-bar {
        padding-top: 22px;
        padding-left: 42px;
        padding-bottom: 26px;
        .gree-search-bar__content{
          background-color: rgba($color: #000000, $alpha: 0.05);
          .gree-field-item-content{
            height: 110px;
          }
        }
        .gree-field-item-left {
          visibility: hidden;
          margin: 0;
        }
        .gree-search-bar__action {
          .gree-button--small {
            height: 110px;
          }
          .gree-button--primary {
            font-size: 45px;
            background-color: #00AEFF;
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
          .gree-tag {
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
    }
  }
</style>