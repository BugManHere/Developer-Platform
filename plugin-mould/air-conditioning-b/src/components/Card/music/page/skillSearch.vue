<template>
  <gree-view bg-color="#ffffff">
    <gree-page class="page-skill-search">
      <gree-header style="background-color: #fff;">技能搜索</gree-header>
      <div class="main">
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
        <div class="search-result-panel"> 
          <span class="tips" v-show="!isSearching && tips">
          {{tips}}
          </span>
          <gree-list v-show="!isSearching && data && data.length">
            <gree-list-item
              v-for="item in data"
              :key="item.id"
              link
              :title="item.name"
              :footer="`“${item.illustrate}”`"
              media-item
              @click.native="gotoDetail(item)"
            >
              <img :src="item.iosIcon" slot="media" class="skill-icon" />
            </gree-list-item>
          </gree-list>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { mapState } from 'vuex';
import { Header, SearchBar, Button, Dialog, List, Item } from 'gree-ui';
import { showLoading, hideLoading, showToast, changeBarColor, voiceACgetSkillSearch } from '../../../../../public/static/lib/PluginInterface.promise';
export default {
  components: {
    [Header.name]: Header,
    [SearchBar.name]: SearchBar,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [List.name]: List,
    [Item.name]: Item,
  },
  data() {
    return {
      value: '',
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
  async mounted() {
    changeBarColor('#fffffe');
    if (this.$route.query && this.$route.query.keyword) {
      this.value = this.$route.query.keyword;
      await this.search(this.$route.query.keyword);
      this.$nextTick(() => {
        const searchInput = document.querySelector('.gree-search-bar input');
        if (searchInput) {
          searchInput.value = this.value;
        }
      });
    } else {
      this.search('');
    }
  },
  methods: {
    gotoDetail(item) {
      this.$router.push(`/SkillDetail/${item.id}?name=${item.name}&icon=${item.iosIcon}`);
    },
    onSearch() {
      let keyword = this.value;
      this.search(keyword);
    },
    async search(keyword) {
      this.isSearching = true;
      this.data = [];
      this.tips = '';
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
    }
  }
}
</script>

<style lang="scss">
  .page-skill-search {
    background-color: #fff;
    .page-content {
      padding-bottom: 0px;
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
            line-height: 110px;
          }
          .gree-button--primary {
            font-size: 45px;
            background-color: #00AEFF;
          }
        }
      }
      .main {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        .tips {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 45px;
          color: rgba($color: #404657, $alpha: 0.5);
        }
        .search-result-panel {
          flex: 1;
          overflow-y: auto;
           .list {
            margin: 0;
            padding: 0px 36px;
            overflow-y: scroll;
            ul {
              &::after, &::before {
                visibility: hidden;
              }
            }
            .item-content {
              padding: 42px 0px 0px 42px;
              .item-media {
                align-self: flex-start;
                .skill-icon {
                  width: 107px;
                  height: 107px;
                  padding: 0;
                }
              }
              .item-inner {
                margin-left: 72px;
                // border-bottom: 1px solid #f4f4f4;
                .item-title {
                  font-size: 48px;
                  color: #404657;
                  .item-footer {
                    margin: 24px 0px;
                    font-size: 36px;
                    color: rgba($color: #404657, $alpha: 0.6);
                  }
                }
                &::before {
                  background-image: url('../../../../assets/img/skill/voice_input_search.png');
                  width: 40px;
                  height: 40px;
                  right: 61px;
                }
              }
            }
          }
        }
      } 
    }
  }
</style>