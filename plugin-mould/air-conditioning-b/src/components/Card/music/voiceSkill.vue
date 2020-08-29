<template>
  <div class="voice-skill">
    <div class="toolbar">
      <div class="left">
        <div 
          v-for="(item, index) in toobarItems" 
          class="item"
          :key="index">
          <div></div>
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div class="right">
        <gree-icon name="search" size="lg" @click="gotoSearch"/>
      </div>
    </div>
    <div class="content">
      <div class="sidebar">
        <gree-sidebar v-model="activeDomainIndex" @change="onChangeDomain">
          <gree-sidebar-item 
            v-for="item in sidebarItems" 
            :key="item.index"
            :title="item.name"
          >
          </gree-sidebar-item>
        </gree-sidebar>
      </div>
      <div 
        ref="skillList"
        class="main" 
        :class="{'loading': isLoading}">
          <div style="height: 100%;">
            <gree-list
            v-show="!isLoadFailed">
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
                <img :src="item.icon" slot="media" class="skill-icon"/>
              </gree-list-item>
              <div class="load-more-item" @click="loadMore">
                <a v-show="hasNextPage && !isLoading" href="javascript:void 0;">加载更多</a>
                <span v-show="hasNextPage && isLoading">加载中...</span>
                <span v-show="!hasNextPage && !isLoading">没有更多内容了</span>
              </div>
            </gree-list>
          </div>
          <div 
            class="error-msg-block" 
            v-show="isLoadFailed"
            @click="reload"
          >
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
import { Icon, Sidebar, SidebarItem, List, Item, } from 'gree-ui'; 
import { voiceACgetSkillList } from '../../../../public/static/lib/PluginInterface.promise';
export default {
  components: {
    [Icon.name]: Icon,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [List.name]: List,
    [Item.name]: Item,
  },
  data() {
    return {
      activeDomainIndex: 0,
      toobarItems: [
        {
          imgUrl: '',
          name: '语音留言簿'
        }
      ],
      sidebarItems: [{
          index: 0,
          name: '生活'
        }, {
          index: 1,
          name: '娱乐'
        }, {
          index: 2,
          name: '教育'
        }
      ],
      skillItems: [],
      isFinished: false,
      isLoading: true,
      isLoadFailed: false,
      initListHeight: 0, //初始技能列表的高度
      pageNum: 1,
      pageSize: 5,
      hasNextPage: false,
      currentRequestId: 0, // 当前请求ID
    }
  },
  computed: {
    ...mapState({
      mac: state => state.mac
    }),
  },
  activated() {
    console.log('actived');
    if (this.initListHeight) {
      this.$refs.skillList.style.height = `${this.initListHeight}px`;
    }
  },
  mounted() {
    try {
      let self = this;
      let listHeight = this.$refs.skillList.clientHeight;
      this.initListHeight = listHeight;
      let pageContent = document.querySelector('.page-content');

      function scrollHandler(ev) {
        console.log(this.scrollTop);
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
  filters: {
    format(str) {
      return `“${str}”`;
    }
  },
  methods: {
    async onChangeDomain(index) {
      let domain = this.sidebarItems.find(x => x.index === index);
      if (domain) {
        let queryArgs = {domain: domain.name, pageNum: 1};
        await this.getSkillList(index, queryArgs);
      }
    },
    async getSkillList(index, args) {
      try {
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
        // if (index !== this.activeDomainIndex) {
        //   return;
        // }
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
        let queryArgs = {domain: domain.name, pageNum: pageNum};
        this.getSkillList(index, queryArgs);
      }
    },
    gotoDetail(item) {
      this.$router.push(`/SkillDetail/${item.id}?name=${item.name}&icon=${item.icon}`);
    },
    gotoSearch() {
      this.$router.push('/SkillSearchHistory');
    },
    async loadMore() {
      if(!this.hasNextPage) {
        return;
      }
      console.log('load more');
      let index = this.activeDomainIndex;
      let domain = this.sidebarItems.find(x => x.index === index);
      if (domain) {
        let queryArgs = {domain: domain.name, pageNum: this.pageNum + 1};
        await this.getSkillList(index, queryArgs);
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
  overflow: hidden;
  width: 100%;
  // height: 100%;
  $mainHeight: calc(100vh - 142px - 1.18rem);
  height: $mainHeight;
  display: flex;
  flex-direction: column;
  .toolbar {
    padding: 10px 0px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    .left {
      display: inline-block;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 24px;
        height: 100%;
        div {
          height: 60px;
          width: 60px;
          background-color: #ccc;
          margin-bottom: 10px;
        }
        span {
          font-size: 20px;
          line-height: 1;
        }
      }
    }
    .right {
      border-left: 2px solid #ccc;
      padding: 0px 60px;
      line-height: 120px;
    }
  }
  .content {
    flex: 1;
    display: flex;
    .sidebar {
      width: 200px;
      .gree-sidebar {
        width: 100%;
        .gree-sidebar-item--select{
          border-color: rgb(0, 153, 255);
        }
      }
      
    }
    .main {
      // border: 1px solid red;
      position: relative;
      width: calc(100% - 200px);
      height: calc(100% - 849px);
      .list {
        height: 100%;
        overflow-y: auto;
        margin: 0;
        ul {
          &::after, &::before {
            visibility: hidden;
          }
        }
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
        .load-more-item {
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
          @include commonPart(120px, '../../../assets/img/skill/share_icon_logo.png');
        }
        &::after {
          @include commonPart(160px, '../../../assets/img/skill/share_icon_loading_rotate.png');
          animation: loading-rotate 1s linear infinite;
        }
      }
      .error-msg-block {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        .content {
          @include commonPart(580px, '../../../assets/img/skill/share_reload_new.png');
          display: flex;
          flex-direction: column;
          align-items: center;
          span {
            &:first-child {
              font-size: 48px;
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