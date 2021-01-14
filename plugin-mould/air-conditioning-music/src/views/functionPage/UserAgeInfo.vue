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
            <!-- 鸟 -->
            <div id="brid">
              <img src="@/assets/img/userAge/brid.png" />
            </div>
            <!-- 云 -->
            <div id="cloud">
              <img src="@/assets/img/userAge/cloud.png" />
            </div>
          </div>
          <!-- 标题1 -->
          <div class="content-box-title" v-text="'您的宝宝是'" />
          <!-- 选择性别 -->
          <div class="content-box-avatar">
            <div class="content-box-avatar-info" v-for="(info, key) in avatarCard" :key="key" @touchend="setGender(key)">
              <img :src="selectGender === key ? info.selectImg : info.img" />
              <span v-text="info.text" />
            </div>
          </div>
          <!-- 标题2 -->
          <div class="content-box-title2" v-text="'宝宝生日'" />
          <!-- 选择生日 -->
          <div class="content-box-swiper">
            <!-- 选择年 -->
            <swiper ref="yearSwiper" :options="swiperOption" class="swiper-year" @slideChange="setYear">
              <swiper-slide v-for="(year, index) in yearList" :key="index">
                <div v-text="year.text" class="swiper-year-text" />
              </swiper-slide>
            </swiper>
            <!-- 选择月 -->
            <swiper ref="monthSwiper" :options="swiperOption" class="swiper-month" @slideChange="setMonth">
              <swiper-slide v-for="(month, index) in monthList" :key="index">
                <div v-text="month.text" class="swiper-month-text" />
              </swiper-slide>
            </swiper>
          </div>
          <!-- 底部按钮 -->
          <div class="content-box-button">
            <gree-button type="primary" v-text="'完成'" @click="settingDone" />
          </div>
        </div>
      </div>
      <!-- 隐私政策弹框 -->
      <div class="privacy-popup" v-if="popupShow">
        <gree-dialog class="privacy-popup-dialog" :btns="popupBtnList" title="儿童隐私政策" v-model="popupShow">
          <p>
            我们依据最新法律要求及软件功能，特制定
            <a v-text="'《格力+儿童个人信息保护规则及监护人须知》'" @click="goRulesPage" />
            ，为保障您的合法权益，请您务必仔细阅读并充分理解协议内容，如果您不同意相关条款，将导致改设备无法运行；如果您同意相关协议内容，请点击“同意”，开始接受我们的服务。
          </p>
        </gree-dialog>
        <gree-overlay :absolute="true" z-index="1000" />
      </div>
    </gree-page>
  </gree-view>
</template>

<script>
import { closePage, editDevice } from '@PluginInterface';
import { Header, Button, Overlay, Dialog } from 'gree-ui';
import { mapState } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';

export default {
  components: {
    [Header.name]: Header,
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Dialog.name]: Dialog,
    Swiper,
    SwiperSlide
  },
  data() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth();
    return {
      popupShow: false, // 是否显示儿童隐私政策弹框
      imshowYear: 15,
      currentYear: year,
      currentMonth: month,
      selectYear: year,
      selectMonth: month,
      selectGender: 'boy',
      swiperOption: {
        direction: 'vertical',
        centeredSlides: true,
        roundLengths: true,
        slidesPerView: 3,
        observer: true
      },
      avatarCard: {
        boy: {
          text: '小王子',
          img: require('@/assets/img/userAge/boy.png'),
          selectImg: require('@/assets/img/userAge/boy-select.png')
        },
        girl: {
          text: '小公主',
          img: require('@/assets/img/userAge/girl.png'),
          selectImg: require('@/assets/img/userAge/girl-select.png')
        }
      }
    };
  },
  computed: {
    ...mapState('control', {
      devname: state => state.deviceInfo.name
    }),
    yearList() {
      return Array.from({ length: 20 }, (v, i) => {
        const value = this.currentYear - i;
        return { text: `${value}年`, value };
      }).reverse();
    },
    monthList() {
      const length = this.currentYear === this.selectYear ? this.currentMonth + 1 : 12;
      return Array.from({ length }, (v, i) => {
        const value = i;
        return { text: `${value + 1}月`, value };
      });
    },
    // swiper-年
    yearSwiper() {
      return this.$refs.yearSwiper.$swiper;
    },
    // swiper-月
    monthSwiper() {
      return this.$refs.monthSwiper.$swiper;
    },
    // 儿童隐私政策弹框按钮
    popupBtnList() {
      return [
        {
          text: '取消',
          handler: () => {
            console.log(navigator.PluginInterface);
            closePage();
            this.popupShow = false;
          }
        },
        {
          text: '同意',
          handler: () => {
            window.storage.set('userAgeInfo', {
              agreePrivacy: true
            });
            this.popupShow = false;
          }
        }
      ];
    }
  },
  mounted() {
    const userAgeInfo = window.storage.get('userAgeInfo');
    (userAgeInfo && userAgeInfo.agreePrivacy) || (this.popupShow = true);
    this.updateSwiperPos();
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
    },
    // 更新swiper位置
    updateSwiperPos() {
      this.yearSwiper.slideTo(this.selectYear, 500);
      this.monthSwiper.slideTo(this.selectMonth, 500);
    },
    // 设置-年
    setYear(e) {
      this.selectYear = this.yearList[e.activeIndex].value;
    },
    // 设置-月
    setMonth(e) {
      this.selectMonth = this.monthList[e.activeIndex].value;
    },
    // 设置性别
    setGender(key) {
      this.selectGender = key;
    },
    // 完成按钮
    settingDone() {
      window.storage.set('userAgeInfo', {
        year: this.selectYear,
        month: this.selectMonth,
        gender: this.selectGender
      });
      this.$router.push('Home');
    },
    // 隐私政策页面
    goRulesPage() {
      this.$router.push('ChildProtectRules');
    }
  }
};
</script>

<style lang="scss">
.user-info-page {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-image: url('../../assets/img/userAge/bg.png');
  background-size: 100% 100%;
  &-content {
    position: relative;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    // position: absolute;
    // bottom: 0;
    // height: auto;
    // width: calc(100% - 120px);
    // padding: 0 60px 180px 60px;
    .content-box {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      flex-wrap: wrap;
      left: 0;
      top: 320px;
      height: calc(100% - 320px);
      min-height: 1200px;
      width: calc(100% - 120px);
      border-radius: 40px;
      background-color: #fff;
      &-swiper {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 46px 10px 46px;
        .swiper-container {
          height: 286px;
          width: 50%;
          font-size: 36px;
          color: #b2b2b2;
          .swiper-slide {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            line-height: 82px;
            &.swiper-slide-active {
              font-size: 54px;
              line-height: 122px;
              color: rgba(0, 174, 255, 1);
            }
          }
        }
        > ::before {
          position: absolute;
          top: 30%;
          width: 100%;
          height: 1px;
          background-color: #f0f0f0;
          color: #f0f0f0;
          content: '';
        }
        > ::after {
          position: absolute;
          top: 70%;
          width: 100%;
          height: 1px;
          background-color: #f0f0f0;
          color: #f0f0f0;
          content: '';
        }
      }
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
        #cloud,
        #text {
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
        color: rgba(64, 70, 87, 1);
      }
      &-title2 {
        position: relative;
        padding-top: 28px;
        padding-bottom: 40px;
        width: 100%;
        height: auto;
        text-align: center;
        color: rgba(64, 70, 87, 1);
        font-size: 48px;
      }
      &-avatar {
        position: relative;
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        z-index: 6;
        img {
          width: 210px;
          height: 210px;
          border: 1px dashed #000;
          margin-bottom: 32px;
        }
        &-info {
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
      &-button {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 40px 0;
        .gree-button {
          height: 140px;
          width: 660px;
          border-radius: 100px;
        }
      }
    }
  }
}
.privacy-popup-dialog {
  .gree-dialog-content {
    width: 910px;
    p {
      text-indent: 2em;
      font-size: 48px;
      a {
        text-decoration: underline;
      }
    }
    .gree-dialog-body {
      padding: 70px;
    }
  }
}
</style>
