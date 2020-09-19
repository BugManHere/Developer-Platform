<template>
  <share v-model="keyword" @search="onSearch" @reload="onReload" :show-error="isLoadFailed">
    <div class="search-result-panel"> 
      <span class="tips" v-show="!isSearching && tips">
        {{ tips }}
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
  </share>
</template>

<script>
import { List, Item } from 'gree-ui';
import Share from './share';
import { showLoading, hideLoading, voiceACgetSkillSearch } from '../../../../../public/static/lib/PluginInterface.promise';

export default {
  components: {
    [List.name]: List,
    [Item.name]: Item,
    share: Share,
  },
  data() {
    return {
      keyword: '',
      data: [],
      isSearching: false,
      tips: '',
      isLoadFailed: false
    };
  },
  beforeRouteEnter (to, from, next) {
    console.log(from);
    if (from.name === 'SkillDetail') {
      next(vm => {
        vm.init(from);
      });
    } else if (from.name === 'SkillSearchIndex') {
      next(vm => {
        vm.init(vm.$route);
      });
    } else {
      next();
    }
  },
  methods: {
    init(route) {
      if (route.query && route.query.keyword) {
        this.keyword = route.query.keyword;
        this.search(this.keyword);
      } else {
        this.search('');
      }
    },
    gotoDetail(item) {
      this.$router.push(`/SkillDetail/${item.id}?name=${item.name}&icon=${item.iosIcon}&keyword=${this.keyword}`);
    },
    onReload() {
      console.log('onReload');
      this.search(this.keyword);
    },
    onSearch() {
      this.search(this.keyword);
    },
    async search(keyword) {
      try {
        this.isLoadFailed = false;
        this.isSearching = true;
        this.data = [];
        this.tips = '';
        showLoading();
        let result = await voiceACgetSkillSearch(this.mac, keyword);
        hideLoading();
        console.log(result);
        this.isSearching = false;
        if (!result) {
          throw new Error('查询结果为空');
        }
  
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        if (typeof (result.data) !== 'undefined') {
          if (result.data.length > 0) {
            this.data = result.data;
          } else {
            this.tips = '对不起，没有搜到相关技能';
          } 
        } else {
          this.tips = '对不起，没有搜到相关技能';
        }
      } catch (error) {
        console.log(error);
        this.isLoadFailed = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.search-result-panel {
  height: 100%;
  overflow-y: auto;
  .tips {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 45px;
    z-index: 3;
    color: rgba($color: #404657, $alpha: 0.5);
  }
  /deep/ .list {
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
</style>
