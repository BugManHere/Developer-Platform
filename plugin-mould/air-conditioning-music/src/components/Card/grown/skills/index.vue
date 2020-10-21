<template>
  <!-- 内容 -->
  <div class="voice-skill">
    <div class="toolbar">
      <div class="content">
        <div class="left">
          <div v-for="(item, index) in toobarItems" class="item" @click="gotoSkillSettings(index)" :key="index">
            <img :src="item.icon" />
            <h4 v-text="item.name" />
          </div>
        </div>
        <img class="divider" src="@assets/img/skill/divider.png" />
        <div class="right">
          <img src="@assets/img/skill/search_icon.png" @click="gotoSearch" />
          <h4>搜索</h4>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="sidebar">
        <gree-sidebar v-model="activeDomainIndex" @change="onChangeDomain">
          <gree-sidebar-item v-for="item in sidebarItems" :key="item.index" :title="item.name"> </gree-sidebar-item>
        </gree-sidebar>
      </div>
      <div ref="skillList" class="main" :class="{ loading: isLoading }">
        <div style="height: 100%;">
          <gree-list v-show="!isLoadFailed">
            <gree-list-item
              v-for="item in skillItems"
              :key="item.id"
              link
              :title="item.name"
              :footer="item.illustrate | format"
              no-hairlines
              media-item
              @click.native="gotoDetail(item)"
            >
              <img :src="item.icon" slot="media" class="skill-icon" />
            </gree-list-item>
            <div class="load-more-item">
              <a v-show="hasNextPage && !isLoading" href="javascript:void 0;" @click="loadMore">加载更多</a>
              <span v-show="hasNextPage && isLoading">加载中...</span>
              <span v-show="!hasNextPage && !isLoading">没有更多内容了</span>
            </div>
          </gree-list>
        </div>
        <div class="error-msg-block" v-show="isLoadFailed" @click="reload">
          <div class="content">
            <span>加载失败了!</span>
            <span>重新加载</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Icon, Sidebar, SidebarItem, List, Item } from 'gree-ui';
import { showToast, voiceACgetSkillList } from '@PluginInterface';

export default {
  components: {
    [Icon.name]: Icon,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [List.name]: List,
    [Item.name]: Item
  },
  filters: {
    format(str) {
      return `“${str}”`;
    }
  },
  data() {
    return {
      activeDomainIndex: 0,
      toobarItems: [
        {
          icon: require('@assets/img/skill/alarm_icon.png'),
          name: '闹钟和提醒'
        },
        {
          icon: require('@assets/img/skill/voice_icon.png'),
          name: '语音留言簿'
        }
      ],
      sidebarItems: [
        {
          index: 0,
          name: '生活'
        },
        {
          index: 1,
          name: '娱乐'
        },
        {
          index: 2,
          name: '教育'
        }
      ],
      skillItems: [],
      isFinished: false,
      isLoading: true,
      isLoadFailed: false,
      pageNum: 1,
      pageSize: 5,
      hasNextPage: false,
      currentRequestId: 0 // 当前请求ID
    };
  },
  computed: {
    ...mapState({
      mac: state => state.mac
    })
  },
  mounted() {
    console.log('2');
    try {
      let self = this;
      let listHeight = this.$refs.skillList.clientHeight;
      let pageContent = document.querySelector('.page-content');
      // 赋予初始高度
      self.$refs.skillList.style.height = `${listHeight + pageContent.scrollTop}px`;

      // eslint-disable-next-line
      function scrollHandler(ev) {
        let scrollTop = this.scrollTop;
        self.$refs.skillList.style.height = `${scrollTop + listHeight}px`;
      }
      pageContent.addEventListener('scroll', scrollHandler, false);
      this.$once('hook:beforeDestroy', () => {
        pageContent.removeEventListener('scroll', scrollHandler, false);
      });

      this.loadSkillList(1);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async onChangeDomain(index) {
      let domain = this.sidebarItems.find(x => x.index === index);
      if (domain) {
        let queryArgs = { domain: domain.name, pageNum: 1 };
        await this.getSkillList(index, queryArgs);
      }
    },
    async getSkillList(index, params) {
      try {
        let args = params;
        this.pageNum = args.pageNum;
        args.getPic = true;
        args.pageSize = this.pageSize;
        if (this.pageNum === 1) {
          this.skillItems.splice(0, this.skillItems.length);
          this.hasNextPage = false;
        }
        this.isLoading = true;
        this.isLoadFailed = false;
        this.currentRequestId = new Date().getTime();
        console.log(JSON.stringify(args));
        let [requestId, result] = await voiceACgetSkillList(this.currentRequestId, this.mac, JSON.stringify(args));
        console.log('返回的请求ID：', requestId);
        // 非当前请求直接返回
        if (requestId !== this.currentRequestId) {
          return;
        }
        this.isLoading = false;
        if (!result) {
          throw new Error('result is empty');
        }
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        if (!result.data) {
          throw new Error('data is null or empty');
        }

        if (this.pageNum === 1) {
          this.skillItems = result.data;
        } else {
          this.skillItems.push(...result.data);
        }

        let total = result.total;
        if (total > this.pageNum * this.pageSize) {
          console.log('hasNextPage');
          this.hasNextPage = true;
        } else {
          this.hasNextPage = false;
        }
      } catch (error) {
        console.log(error.message);
        this.isLoading = false;
        this.isLoadFailed = true;
        this.hasNextPage = false;
      }
    },
    reload() {
      this.loadSkillList(1);
    },
    loadSkillList(pageNum) {
      let index = this.activeDomainIndex;
      let domain = this.sidebarItems.find(x => x.index === index);
      if (domain) {
        let queryArgs = { domain: domain.name, pageNum };
        this.getSkillList(index, queryArgs);
      }
    },
    gotoDetail(item) {
      this.$router.push(`/SkillDetail/${item.id}?name=${item.name}&icon=${item.icon}`);
    },
    gotoSearch() {
      this.$router.push('/SkillSearch');
    },
    async loadMore() {
      if (!this.hasNextPage) {
        return;
      }
      console.log('load more');
      let index = this.activeDomainIndex;
      let domain = this.sidebarItems.find(x => x.index === index);
      if (domain) {
        let queryArgs = { domain: domain.name, pageNum: this.pageNum + 1 };
        await this.getSkillList(index, queryArgs);
      }
    },
    gotoSkillSettings(index) {
      switch (index) {
        case 1:
          this.$router.push('/VoiceMessage');
          break;
        default:
          showToast('该功能暂未开放！', 0);
          break;
      }
    }
  }
};
</script>

<style lang="scss">
// 共同的属性抽取出来
@mixin commonPart($size, $url) {
  position: absolute;
  content: '';
  background-image: url($url);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: $size;
  height: $size;
}
.voice-skill {
  $skillMainHeight: calc(100vh - #{$pageHeaderHeight});
  $toolbar: 317px;
  $sidebarWidth: 270px;
  $skillContentHeight: calc(#{$skillMainHeight} - #{$temEditHeight} - #{$cardHeaderHeight} - #{$toolbar} - #{$footerHeight});
  $bgColor: #fafafa;
  $contentColor: #f5f5f5;
  overflow: hidden;
  width: 100%;
  // height: 100%;
  height: $skillMainHeight;
  display: flex;
  flex-direction: column;
  .toolbar {
    position: relative;
    top: 0;
    height: auto;
    padding: 29px 38px 80px 30px;
    background-color: $bgColor;
    max-height: $toolbar;
    .content {
      height: calc(#{$toolbar} - 29px - 80px);
      background-image: url('../../../../assets/img/skill/toolbar_bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      .left {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
      .right {
        margin: 0px 99px 0px 104px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      img {
        width: 70px;
        height: 70px;
      }
      h4 {
        font-size: 34px;
        color: #404657;
        margin-top: 17px;
        line-height: 50px;
      }
      .divider {
        height: 146px;
        width: 4px;
      }
    }
  }
  > .content {
    flex: 1;
    // padding-bottom: $footerHeight !important;
    display: flex;
    .sidebar {
      width: $sidebarWidth;
      background-color: $contentColor;
      .gree-sidebar {
        width: 100%;
        .gree-sidebar-item {
          height: 140px;
          position: relative;
          color: #404657;
          background-color: $contentColor;
          .gree-sidebar-item__text {
            font-size: 42px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          &.gree-sidebar-item--select {
            color: rgba(0, 174, 255, 1);
            background-color: #fff;
            border-left: 12px solid rgba(0, 174, 255, 1);
          }
        }
      }
    }
    .main {
      // border: 1px solid red;
      position: relative;
      background-color: $bgColor;
      width: calc(100% - #{$sidebarWidth});
      height: $skillContentHeight;
      .list {
        height: 100%;
        overflow-y: auto;
        margin: 0;
        ul {
          &::after,
          &::before {
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
              width: 30px;
              height: 68px;
              right: 61px;
            }
          }
        }
        .load-more-item {
          background-color: $bgColor;
          text-align: center;
          padding: 30px 0px;
          font-size: 40px;
          a {
            text-decoration: none;
            color: #ffd800;
          }
          span {
            color: rgba($color: #404657, $alpha: 0.4);
          }
        }
      }
      &.loading {
        @keyframes loading-rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        position: relative;
        &::before {
          @include commonPart(120px, '../../../../assets/img/skill/share_icon_logo.png');
        }
        &::after {
          @include commonPart(160px, '../../../../assets/img/skill/share_icon_loading_rotate.png');
          animation: loading-rotate 1s linear infinite;
        }
      }
      .error-msg-block {
        position: absolute;
        top: 0px;
        left: 0;
        height: 100%;
        width: 100%;
        .content {
          @include commonPart(500px, '../../../../assets/img/skill/share_reload_new.png');
          display: flex;
          flex-direction: column;
          align-items: center;
          span {
            &:first-child {
              font-size: 42px;
              color: rgba($color: #404657, $alpha: 0.6);
              margin-top: 120px;
              margin-bottom: 20px;
            }
            &:last-child {
              font-size: 32px;
              color: #ffd800;
            }
          }
        }
      }
    }
  }
}

.page .page-content {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
