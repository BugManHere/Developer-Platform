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
         <gree-list
           @scroll.native="skillListScrollHandler"
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
          </gree-list>
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
import { Icon, Sidebar, SidebarItem, List, Item } from 'gree-ui'; 
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
      
      function skillListScrollHandler(ev) {
        console.log('hit');
        let deviation = 5;
        if ((this.scrollTop + this.clientHeight) >= (this.scrollHeight - deviation)) {
          if (self.hasNextPage) {
            self.loadSkillList(self.pageNum + 1);
          }
        }
      }

      pageContent.addEventListener('scroll', scrollHandler, false);
      // this.$refs.skillList.addEventListener('scroll', skillListScrollHandler, false);
      this.$once('hook:beforeDestroy', () => {
        pageContent.removeEventListener('scroll', scrollHandler, false);
        // this.$refs.skillList.removeEventListener('scroll', skillListScrollHandler, false);
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
    onChangeDomain(index) {
      let domain = this.sidebarItems.find(x => x.index === index);
      if (domain) {
        let queryArgs = {domain: domain.name, pageNum: 1};
        this.getSkillList(index, queryArgs);
      }
    },
    async getSkillList(index, args) {
      try {
        this.pageNum = args.pageNum;
        args.getPic = true;
        args.pageSize = this.pageSize;
        this.skillItems.splice(0, this.skillItems.length);
        this.isLoading = true;
        this.isLoadFailed = false;
        this.hasNextPage = false;
        let result = await voiceACgetSkillList(this.mac, JSON.stringify(args));
        if (index !== this.activeDomainIndex) {
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
        this.skillItems = result.data; 
        let total = result.total;
        if (total > this.pageNum * this.pageSize) {
          this.hasNextPage = true;
        }
      } catch (error) {
        this.isLoading = false;
        this.isLoadFailed = true;
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
      this.$router.push('/SkillSearch');
    },
    skillListScrollHandler() {
      console.log('hit');
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
      width: calc(100% - 200px);
      height: calc(100% - 849px);
      .list {
        height: 100%;
        overflow-y: auto;
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
        height: 100%;
        position: relative;
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