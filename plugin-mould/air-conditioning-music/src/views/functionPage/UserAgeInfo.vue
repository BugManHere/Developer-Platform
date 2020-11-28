<template>
  <gree-view bg-color="#36b6df">
    <gree-page class="user-info-page">
      <!-- 标题栏 -->
      <gree-header
        theme="transparent"
        :left-options="{ preventGoBack: true }"
        :right-options="{ showMore: true }"
        @on-click-back="goBack"
        @on-click-more="moreInfo"
        >{{ devname }}</gree-header
      >
      <!-- 内容 -->
      <div class="user-info-page-content">
        <div class="content-box">
          <!-- 装饰图片 -->
          <div class="content-box-decorate">
            <div id="brid">
              <img src="@/assets/img/userAge/brid.png" />
            </div>
            <div id="cloud">
              <img src="@/assets/img/userAge/cloud.png" />
            </div>
          </div>
          <!-- 标题1 -->
          <div class="content-box-title" v-text="'您的宝宝是'" />
          <!-- 选择性别 -->
          <div class="content-box-avatar">
            <div class="content-box-avatar-boy">
              <img src="@/assets/img/userAge/boy.png" />
              <span v-text="'小王子'" />
            </div>
            <div class="content-box-avatar-girl">
              <img src="@/assets/img/userAge/girl.png" />
              <span v-text="'小公主'" />
            </div>
          </div>
          <!-- 标题2 -->
          <div class="content-box-title2" v-text="'宝宝生日'" />
          <!-- 选择生日 -->
          <gree-date-picker
            ref="picker"
            :min-date="minDate"
            :max-date="maxDate"
            is-view
            keep-index
            :default-date="maxDate"
            type="custom"
            :custom-types="['yyyy', 'MM']"
            :line-height="30"
          />
          <!-- 底部按钮 -->
          <div class="content-box-button">
            <gree-button type="primary" v-text="'完成'" />
          </div>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { closePage, editDevice } from '@PluginInterface';
import { Header, DatePicker, Button } from 'gree-ui';
import { mapState } from 'vuex';

export default {
  data() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth();
    return {
      minDate: new Date(`${year - 20}/1`),
      maxDate: new Date(`${year}/${month + 1}`)
    };
  },
  components: {
    [Header.name]: Header,
    [Button.name]: Button,
    [DatePicker.name]: DatePicker
  },
  computed: {
    ...mapState({
      devname: state => state.deviceInfo.name
    })
  },
  methods: {
    /**
     * @description 返回键
     */
    goBack() {
      closePage();
    },
    /**
     * @description 编辑设备名称
     */
    moreInfo() {
      editDevice(this.mac);
    }
  }
};
</script>

<style lang="scss" scoped>
.user-info-page {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-image: url('../../assets/img/userAge/bg.png');
  background-size: 100% 100%;
  &-content {
    position: absolute;
    bottom: 0;
    height: auto;
    width: calc(100% - 120px);
    padding: 0 60px 180px 60px;
    .content-box {
      position: relative;
      left: 0;
      height: auto;
      width: 100%;
      border-radius: 40px;
      background-color: #fff;
      &-decorate {
        position: absolute;
        top: 0;
        height: 300px;
        width: 100%;
        z-index: 5;
        #brid {
          position: absolute;
          left: 14px;
          top: -180px;
          width: 280px;
          height: 280px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        #cloud {
          position: absolute;
          top: -330px;
          right: 94px;
          height: 280px;
          width: 550px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      &-title {
        position: relative;
        padding-top: 54px;
        width: 100%;
        height: auto;
        text-align: center;
        font-size: 48px;
      }
      &-title2 {
        position: relative;
        // padding-top: 28px;
        width: 100%;
        height: auto;
        text-align: center;
        font-size: 40px;
      }
      &-avatar {
        position: relative;
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        img {
          width: 210px;
          height: 210px;
          border: 1px dashed #000;
          margin-bottom: 32px;
        }
        &-boy,
        &-girl {
          width: 210px;
          height: auto;
          padding: 64px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          span {
            font-size: 40px;
          }
        }
      }
      > .gree-date-picker {
      }
      &-button {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 40px 0;
        .gree-button {
          height: 120px;
          width: 660px;
          border-radius: 100px;
        }
      }
    }
  }
}
</style>
