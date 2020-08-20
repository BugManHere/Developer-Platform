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
        <gree-sidebar v-model="activeKey">
          <gree-sidebar-item 
            v-for="item in sidebarItems" 
            :key="item.index"
            :title="item.name"
          >
          </gree-sidebar-item>
        </gree-sidebar>
      </div>
      <div class="main">
        <gree-scroll-view
          ref="scrollView"
          :scrolling-x="false"
          @end-reached="onEndReached"
        >
         <gree-list>
            <gree-list-item
              link
              title="天气"
              footer="今天天气怎么样"
              no-hairlines
              media-item
              @click.native="gotoDetail"
            >
              <div slot="media" class="placeholder"></div>
            </gree-list-item>
          </gree-list>
          <gree-scroll-view-more
            slot="more"
            :is-finished="isFinished"
          ></gree-scroll-view-more>
        </gree-scroll-view>
        
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Sidebar, SidebarItem, List, Item, ScrollView, ScrollViewMore } from 'gree-ui'; 
export default {
  components: {
    [Icon.name]: Icon,
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [List.name]: List,
    [Item.name]: Item,
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
  },
  data() {
    return {
      activeKey: 0,
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
      isFinished: false
    }
  },
  methods: {
    gotoDetail() {
      this.$router.push('/SkillDetail');
    },
    gotoSearch() {
      this.$router.push('/SkillSearch');
    },
    onEndReached() {
      if (this.isFinished) {
        this.$refs.scrollView.finishLoadMore();
        return;
      }
      setTimeout(() => {
        this.isFinished = true;
        this.$refs.scrollView.finishLoadMore();
      }, 1000);
    }
  }
};
</script>

<style lang="scss">
.voice-skill {
  overflow: scroll;
  width: 100%;
  height: 100%;
  $mainHeight: calc(100vh - 120px);
  min-height: $mainHeight;
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
      flex: 1;
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
}

.page .page-content {
  &::-webkit-scrollbar {
     display: none;
  }
}
</style>