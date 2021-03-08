<template>
  <gree-view class="error-warn-page" bg-color="#fdfdfd">
    <gree-header :left-options="{ showBack: false }" :right-options="{ showMore: false }">
      <i class="iconfont iconfont-fanhui" slot="overwrite-left" @click="goBack" />
      通知
    </gree-header>
    <gree-page>
      <gree-tab-bar v-model="currentTheme" :items="themes" @change="onTabChange" />
      <gree-error-page type="malfunction" :bg-url="cardBg" :text="errorContent" v-show="currentTheme === 0" />
    </gree-page>
    <gree-toolbar position="bottom" v-show="currentTheme === 0">
      <gree-row>
        <gree-col v-for="(item, index) in options" :key="index" @click.native="setFunction(index)">
          <div class="icon">
            <i class="iconfont" :class="`iconfont-${item.icon}`" />
          </div>
          <h3>{{ item.Name }}</h3>
        </gree-col>
      </gree-row>
    </gree-toolbar>
  </gree-view>
</template>

<script>
import { ErrorPage, Header, TabBar, ToolBar, Row, Col } from 'gree-ui';
import { closePage, toWebPage, callNumber } from '@PluginInterface';
import { mapGetters } from 'vuex';

export default {
  components: {
    [Col.name]: Col,
    [Row.name]: Row,
    [ErrorPage.name]: ErrorPage,
    [ToolBar.name]: ToolBar,
    [TabBar.name]: TabBar,
    [Header.name]: Header
  },
  data() {
    return {
      currentTheme: 0,
      themes: [
        {
          name: 0,
          label: '故障'
        },
        {
          name: 1,
          label: '提醒'
        }
      ],
      cardBg: require('@/assets/img/error_card.png'),
      options: [
        {
          icon: 'shouhoudianhua',
          Name: '售后电话'
        },
        {
          icon: 'yuyue',
          Name: '服务预约'
        },
        {
          icon: 'jinduchaxun',
          Name: '进度查询'
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['errorMsgs']),
    // 将故障信息转化为显示内容格式
    errorContent() {
      const result = this.errorMsgs.list.map(msg => {
        msg.headtitle = '故障名称：';
        msg.subtitle = '解除办法：';
        msg.text = '请联系指定服务商或服务中心';
        return msg;
      });
      return result;
    }
  },
  methods: {
    setFunction(index) {
      switch (index) {
        case 0:
          callNumber(4008365315);
          break;
        case 1:
          toWebPage('http://pgxt.gree.com:7909/hjzx/bx/addbx.jsp?source=greejia', '服务预约');
          break;
        case 2:
          toWebPage('http://pgxt.gree.com:7909/hjzx/bx/chabx.jsp?source=greejia', '进度查询');
          break;
        default:
          console.log('Error，出错了！');
          break;
      }
    },
    goBack() {
      closePage();
    },
    onTabChange(item, index) {
      this.currentTheme = index;
    }
  }
};
</script>

<style lang="scss">
.error-warn-page {
  .page-content {
    padding-bottom: 0;
    .gree-tab-bar {
      background-color: #fdfdfd;
    }
  }
  .item-content {
    padding: 0 16px 0 52px !important;
    .item-inner {
      margin: 0 !important;
      padding-right: 0 !important;
      .item-after {
        word-wrap: break-word !important;
        white-space: inherit !important;
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$toolbarHeight: 270px;
$headerHeight: 127px;
.error-warn-page {
  .gree-header {
    background-color: #fdfdfd;
  }
  .page {
    padding-bottom: calc(#{$toolbarHeight} + env(safe-area-inset-top));
  }
  .item-content {
    .item-media {
      .logo {
        height: 180px !important;
      }
    }
  }
  .toolbar-bottom {
    background-color: rgb(244, 244, 244);
    height: $toolbarHeight;
    margin-bottom: env(safe-area-inset-top);
    .row {
      width: 100%;
      .col {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        h3 {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
  .icon {
    height: 132px;
    width: 132px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    i {
      font-size: 68px;
    }
  }
}
</style>
