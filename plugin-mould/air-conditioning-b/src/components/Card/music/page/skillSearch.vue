<template>
  <gree-view>
    <gree-page class="page-skill-search">
      <gree-header style="background-color: #fff;">技能搜索</gree-header>
      <div>
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
      <div v-show="!value">
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
            <gree-icon 
              @click="clearHistory"
              name="photo"
              size="md"></gree-icon>
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
      </div>
      <div v-show="value"> 
        <span class="tips" v-show="!isSearching && tips">
         {{tips}}
        </span>
        <gree-list v-show="!isSearching && data && data.length">
          <gree-list-item
            v-for="item in data"
            :key="item.id"
            link
            :title="item.name"
            :footer="item.illustrate"
            media-item
            @click.native="gotoDetail(item.id)"
          >
            <img :src="item.iosIcon" slot="media" class="skill-icon" />
          </gree-list-item>
        </gree-list>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { mapState } from 'vuex';
import { Header, SearchBar, Button, Tag, Icon, Dialog, List, Item } from 'gree-ui';
import { showLoading, hideLoading, showToast, changeBarColor, voiceACgetSkillSearch, voiceACgetSkillSearchJudge, voiceACgetSkillSearchTruncate } from '../../../../../public/static/lib/PluginInterface.promise';
export default {
  components: {
    [Header.name]: Header,
    [SearchBar.name]: SearchBar,
    [Button.name]: Button,
    [Tag.name]: Tag,
    [Icon.name]: Icon,
    [Dialog.name]: Dialog,
    [List.name]: List,
    [Item.name]: Item,
  },
  data() {
    return {
      value: '',
      hot: [],
      history: [],
      data: [],
      isSearching: false,
      tips: ''
    }
  },
  computed: {
    ...mapState({
      mac: state => state.mac
    }),
  },
  watch: {
    value(val) {
      if (!val) {
        this.data = [];
        this.isSearching = false;
        this.tips = '';
        this.setHistoryAndHotItems();
      }
    }
  },
  async created() {
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
    gotoDetail(id) {
      this.$router.push(`/SkillDetail/${id}`);
    },
    async onSearch() {
      let keyword = this.value && this.value.trim();
      if (!keyword) {
        return;
      }
      this.isSearching = true;
      showLoading();
      let result = await voiceACgetSkillSearch(this.mac, keyword);
      hideLoading();
      console.log(result);
      this.isSearching = false;
      if (result) {
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        if (typeof(result.data) !== 'undefined') {
          if (result.data.length > 0) {
            this.data = result.data;
          } else {
            this.tips = '对不起，没有搜到相关技能';
          } 
        } else {
          this.tips = '对不起，没有搜到相关技能';
        }
      }
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
  .page-skill-search {
    background-color: #fff;
    .page-content {
      position: relative;
      .gree-search-bar {
        .gree-field-item-left {
          visibility: hidden;
          margin: 0;
        }
      }
      .panel {
        padding: 20px;
        .title {
          font-size: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          .gree-tag {
            margin: 0px 20px 20px 0px;
            .type-fill {
              color: #000;
            }
            .size-small {
              font-size: 36px;
            }
          }
        }
      }

      .tips {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .list {
        margin: 0;
        .skill-icon {
          width: 100px;
          height: 100px;
        }
        .item-content {
          padding-top: 30px;
          padding-bottom: 30px;
          .item-inner {
            .item-title {
              .item-footer {
                margin-top: 30px;
              }
            }
          }
        }
      }
    }
  }
</style>