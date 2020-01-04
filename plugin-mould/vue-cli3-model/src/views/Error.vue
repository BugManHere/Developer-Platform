<template>
  <gree-view>
    <gree-header>故障详情</gree-header>
    <gree-page>
      <gree-error-page type="malfunction" :bg-url="BgUrl2" :text="errorMultiText" ></gree-error-page>
    </gree-page>
    <gree-toolbar position="bottom" class="footer">
      <gree-row>
        <gree-col v-for="(item, index) in options" :key="index" @click.native="setFunction(index)">
          <div class="icon">
            <img class="img" :src="require('../assets/img/' + item.ImgName + '.png')" />
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
} from "gree-ui";

import {
  toWebPage
} from "../../../static/lib/PluginInterface.promise";

export default {
  components: {
    [Header.name]: Header,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [ToolBar.name]: ToolBar,
    [ErrorPage.name]: ErrorPage
  },
  data() {
    return {
      BgUrl2: require("../assets/img/bg_error.png"),
      errorMultiText: [
        {
          code: "F0",
          headtitle: "故障名称：",
          title: "PM2.5 传感器故障",
          subtitle: "解除办法：",
          text: "请联系指定服务商或服务中心"
        },
        {
          code: "F1",
          headtitle: "故障名称：",
          title: "温湿度传感器故障",
          subtitle: "解除办法：",
          text: "请联系指定服务商或服务中心"
        },
        {
          code: "F2",
          headtitle: "故障名称：",
          title: "甲醛传感器故障",
          subtitle: "解除办法：",
          text: "请联系指定服务商或服务中心"
        },
        {
          code: "F3",
          headtitle: "故障名称：",
          title: "CO2 传感器故障",
          subtitle: "解除办法：",
          text: "请联系指定服务商或服务中心"
        },
        {
          code: "F4",
          headtitle: "故障名称：",
          title: "与主控板通讯故障",
          subtitle: "解除办法：",
          text: "请联系指定服务商或服务中心"
        }
      ],
      options: [
        {
          ImgName: "service",
          Name: "智能客服"
        },
        {
          ImgName: "subscribe",
          Name: "服务预约"
        },
        {
          ImgName: "search",
          Name: "进度查询"
        }
      ]
    };
  },
  methods: {
    setFunction(index) {
      console.log(index);
      switch(index){
        case 0: toWebPage="https://grih.gree.com/zixun/#/customerChats"; break;
        case 1: toWebPage="http://pgxt.gree.com:7909/hjzx/bx/addbx.jsp?source=greejia"; break;
        case 2: toWebPage="http://pgxt.gree.com:7909/hjzx/bx/chabx.jsp?source=greejia"; break;
        default: console.log('Error，出错了！'); break;
      }
    }
  }
};
</script>

<style lang="scss">
.page-content {
  padding-bottom: 324px !important;
  overflow: scroll !important;
}
.toolbar { 
    height: 324px !important;
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
