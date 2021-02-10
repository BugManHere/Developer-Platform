<template>
  <!-- 设备信息栏 -->
  <div class="gdp-info-card">
    <!-- 统一面板 -->
    <gdp-panel>
      <!-- 标题 -->
      <template slot="title">
        <slot name="title">
          <span v-text="cardInfo.title" />
        </slot>
      </template>
      <!-- 标题右边按钮组 -->
      <template slot="right">
        <slot name="right">
          <!-- <button type="button" class="btn btn-default" v-text="'按钮'" /> -->
        </slot>
      </template>
      <!-- 内容 -->
      <template slot="content">
        <!-- 内容 -->
        <div class="gdp-info-card-content">
          <!-- 设备图片 -->
          <img :src="cardInfo.img" />
          <!-- 设备目前状态 -->
          <div>
            <p v-text="cardInfo.content.deviceName" />
            <p>
              <span> <i></i>文本：文本文 </span>
              <span> <i></i>文本：开发中 </span>
            </p>
            <p>
              <span class="done"> <i></i>文本：文本文 </span>
              <span class="done"> <i></i>文本：已完成 </span>
            </p>
          </div>
          <!-- 设备信息 -->
          <div>
            <div v-for="(val, index) in cardInfo.content" :key="index">
              <div>
                <span v-text="val.title" />
                <i v-if="val.icon" v-text="val.icon.text" class="glyphicon" @click="val.icon.method" />
              </div>
              <p v-text="val.text" />
            </div>
          </div>
        </div>
      </template>
    </gdp-panel>
  </div>
</template>

<script>
import gdpPanel from '@/gdp-ui/panel';

export default {
  name: 'info-card',
  components: {
    [gdpPanel.name]: gdpPanel
  },
  props: {
    cardInfo: {
      type: Object,
      default: () => {
        return {
          title: '测试',
          img: require('@public/img/product/Hangon.png'),
          content: {
            设备品类: '无',
            创建时间: '无',
            MID: '无',
            产品名称: '无',
            修改时间: '无',
            细分码: '无'
          }
        };
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.gdp-info-card {
  position: relative;
  height: auto;
  .gdp-info-card-content {
    width: auto;
    clear: both;
    overflow: hidden;
    margin: 0 auto;
    img {
      display: block;
      width: 85px;
      height: 85px;
      float: left;
      margin: 30px 0 0 16px;
      border: 1px #ddd solid;
    }
    > :nth-child(2) {
      width: 318px;
      height: 85px;
      float: left;
      margin: 40px 0 0 18px;
      p {
        display: flex;
        align-items: center;
        padding: 0;
        margin: 0 0 5px 0;
        span {
          color: #ffb533;
          padding-right: 16px;
          font-size: 12px;
          :before {
            padding-right: 6px;
            position: relative;
            display: inline-block;
            font-style: normal;
            font-weight: lighter;
            font-size: 16px;
            font-family: 'Glyphicons Halflings';
            content: '\e023';
          }
          &.done {
            :before {
              content: '\e089';
            }
          }
        }
      }
    }
    > :nth-child(3) {
      width: 600px;
      overflow: hidden;
      float: left;
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      > div {
        float: left;
        width: 33%;
        text-align: center;
        height: 55px;
        > :nth-child(1) {
          color: #c5c5c5;
          font-size: 12px;
          margin-bottom: 3px;
        }
        > :nth-child(2) {
          color: #8b8b8b;
          font-size: 14px;
          margin-bottom: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          cursor: default;
          position: relative;
        }
      }
    }
  }
}
.glyphicon {
  position: relative;
  left: 5px;
  font-size: 10px;
  color: #c5c5c5;
  cursor: pointer;
  &:hover {
    color: #aaa;
  }
}
</style>
