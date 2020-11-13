
<template>
  <gree-view class="error" bg-color="#f4f4f4">
    <gree-header 
      :left-options="{preventGoBack: true}"
      @on-click-back="clickBack">故障详情
    </gree-header>
    <gree-page>
      <gree-error-page
        type="malfunction"
        :bg-url="BgUrl2"
        :text="errorMultiText"
      ></gree-error-page>
    </gree-page>
    <gree-toolbar position="bottom">
      <gree-row>
        <gree-col
          v-for="(item, index) in options"
          :key="index"
          @click.native="setFunction(index)"
        >
          <div class="icon">
            <img :src="require('@/assets/img/' + item.ImgName + '.png')" />
          </div>
          <h3>{{ item.Name }}</h3>
        </gree-col>
      </gree-row>
    </gree-toolbar>
  </gree-view>
</template>

<script>
import {
  Header,
  Row,
  Col,
  Icon,
  ToolBar,
  ErrorPage 
} from 'gree-ui';
import { changeBarColor, closePage, toWebPage, callNumber} from '@PluginInterface';
import errorConfig from '@/mixins/utils/error';

export default {
  components: {
    [Header.name]: Header,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [ToolBar.name]: ToolBar,
    [ErrorPage.name]: ErrorPage 
  },
  mixins: [errorConfig],
  data() {
    return {
      BgUrl2: require('@assets/img/bg_error.png'),
      errorMultiText: [], // 故障列表
      options: [
        {
          ImgName: 'service',
          Name: '售后电话'
        },
        {
          ImgName: 'subscribe',
          Name: '服务预约'
        },
        {
          ImgName: 'search',
          Name: '进度查询'
        }
      ]
    };
  },
  computed: {},
  watch: {},
  mounted() {
    changeBarColor('#F4F4F4');
  },
  methods: {
    clickBack() {
      const bit0 = 0;
      const bit4 = 4;
      const errCode2Colsepage = ((this.ErrCode2 >> bit0) % 2) === 1 || ((this.ErrCode2 >> bit4) % 2) === 1; // ErrCode2中closePage的位 第0位 和 第四位
      if (this.JFerr || this.ErrCode1 || errCode2Colsepage) {
        closePage();
      } else {
        this.$router.push({ name: 'Home' });
      }
    },
    /**
     * @description 页面跳转
     */
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
    /**
     * @description 故障解析
     */
    updateError() {
      this.errorMultiText = [];
      let errorIndexList = [];
      errorIndexList = this.HandleErrorCode(this.ErrCode1);
      for (let index = 0; index < errorIndexList.length; index++) {
        this.errorMultiText.push(this.handleSingleErrObj(this.errorList.ErrCode1[errorIndexList[index]]));
      }

      errorIndexList = this.HandleErrorCode(this.ErrCode2);
      for (let index = 0; index < errorIndexList.length; index++) {
        this.errorMultiText.push(this.handleSingleErrObj(this.errorList.ErrCode2[errorIndexList[index]]));
      }
      if (this.JFerr) {
        this.errorMultiText.push(this.handleSingleErrObj(this.errorList.wifiErrorList[0]));
      }
    },

    /**
     * @description 单故障处理
     */
    handleSingleErrObj(item) {
      const element = JSON.parse(JSON.stringify(item));
      element.title = this.$language(`error.${item.title}`);
      element.text = this.$language(`error.${item.text}`);
      element.headtitle = this.$language('error.headtitle');
      element.subtitle = this.$language('error.subtitle');
      return element;
    }


  }
};
</script>

<style lang="scss">
.error{
  .list {
    .item-content {
      .item-media {
        .logo {
          .divider {
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            display: block !important;
            height: 100% !important;
            &:before {
              top: 10% !important;
              border-left: 1px solid rgba(255, 255, 255, 0.6) !important;
            }
            &:after {
              bottom: 10% !important;
              border-left: 1px solid rgba(255, 255, 255, 0.6) !important;
            }
          }
        }
      }
      .item-inner{
        .item-title,
        .item-after{
          white-space: normal;
        }
      }
    }
  }
}

</style>

<style lang="scss" scoped>
.page {
  padding-bottom: 200px;
  // .page-content {
  //   // padding-bottom: 324px !important;
  //   // overflow: scroll !important;
  // }
}
.toolbar {
  margin: 0 !important;
  height: 324px !important;
  background-color: #f6f6f6 !important;
  .row {
    width: 100%;
    text-align: center;
  }
  .col {
    .icon {
      background: none;
      border: none;
      box-shadow: none;
    }
    .img {
      width: 162px;
      height: 162px;
    }
  }
}
</style>
  
