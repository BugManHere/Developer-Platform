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
            link
            title="天气"
            footer="今天天气怎么样"
            media-item
            @click.native="gotoDetail"
          >
            <div slot="media" class="placeholder"></div>
          </gree-list-item>
        </gree-list>
      </div>
      
    </gree-page>
  </gree-view>
</template>

<script>
import { Header, SearchBar, Button, Tag, Icon, Dialog, List, Item } from 'gree-ui';
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
      hot: ['天气', '空调', '笑话', '百科', '音乐', '新闻', '贝瓦儿歌','天气', '空调', '笑话', '百科', '音乐', '新闻',],
      history: ['天气', '空调', '笑话', '百科', '音乐', '新闻', '贝瓦儿歌'],
      data: [],
      isSearching: false,
      tips: ''
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.data = [];
        this.isSearching = false;
        this.tips = '';
      }
    }
  },
  methods: {
    onSearch() {
      if (!this.value) {
        return;
      }
      this.isSearching = true;
      setTimeout(() => {
        this.isSearching = false;
        // this.tips = '对不起，没有搜到相关技能';
        this.data = ['天气'];
      }, 2000);
    },
    clearHistory() {
      Dialog.confirm({
        title: '',
        content: '确定要清空全部历史记录吗？',
        confirmText: '确定',
        onConfirm: () => console.log('[Dialog.confirm] confirm clicked'),
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
          font-size: 24px;
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
        .placeholder {
          width: 100px;
          height: 100px;
          background-color: #ccc;
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