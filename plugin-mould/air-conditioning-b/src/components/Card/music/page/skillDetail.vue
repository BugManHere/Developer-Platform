<template>
  <gree-view bg-color="#ffffff">
    <gree-page class="page-skill-detail no-navbar">
      <!-- 标题 -->
      <div class="page-header">
        <gree-header theme='transparent'>
          <button 
            slot="right"
            v-show="hasSettings"
            class="btn"
            @click="gotoSettings"
          >技能设置</button>
        </gree-header>
        <div class="icon-wrapper">
          <img :src="icon" class="icon" />
          <span>{{name}}</span>
        </div>
      </div>
      <!-- 内容 -->
      <div class="page-main">
        <div class="panel">
          <p class="title">您可以这么说</p>
          <ul :class="{'loading': isLoading}">
            <li v-for="(item, index) in illustrate" :key="index">
              <span>{{item}}</span>
            </li>
          </ul>
        </div>
        <div class="panel">
          <p class="title">技能介绍</p>
          <p class="text" :class="{'loading': isLoading}">{{introduce}}</p>
        </div>
        <div class="panel">
          <p class="title">使用说明</p>
          <p class="text" :class="{'loading': isLoading}">{{direction_use}}</p>
        </div>
      </div>
      <footer>此功能由<img src="../../../../assets/img/skill/gree_logo.png"/>与<img src="../../../../assets/img/skill/tencent_cloud_logo.png"/>联合提供</footer>
    </gree-page>
  </gree-view>
</template>
<script>
import { Header } from 'gree-ui';
import { voiceACgetSkillInfo, changeBarColor } from '../../../../../public/static/lib/PluginInterface.promise';

const SKILLS_WITH_SETTINGS = ['语音留言'];
export default {
  components: {
    [Header.name]: Header,
  },
  props: ['id'],
  data() {
    return {
      illustrate: [],
      introduce: '',
      direction_use: '',
      name: '',
      hasSettings: false,
      icon: '',
      isLoading: true, //是否加载数据中
    }
  },
  created() {
    changeBarColor('#301021');

    if (this.$route.query) {
      this.name = this.$route.query.name;
      this.icon = this.$route.query.icon;
    }
    this.getSkillInfo(Number(this.id));
  },
  methods: {
    gotoSettings() {
      console.log('settings');
    },
    async getSkillInfo(id) {
      let result = await voiceACgetSkillInfo(id);
      console.log('skillInfo:', result);
      if (result) {
        this.isLoading = false;
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
        this.illustrate = result.illustrate;
        this.name = result.name;
        if (SKILLS_WITH_SETTINGS.indexOf(this.name) !== -1) {
          this.hasSettings = true;
        }
        this.direction_use = result.direction_use;
        this.introduce = result.introduce;
        this.icon = result.icon;
      } else {
        this.getSkillInfo(id);
      }
    }
  }
}
</script>
<style lang="scss">
@keyframes skeleton-blink {
    50% {
        opacity: .6;
    }
}
.page-skill-detail {
  position: relative;
  .page-header {
    position: relative;
    height: 560px;
    background-image: url('../../../../assets/img/skill/header_bg.png');
    background-size: 100% 100%;
    .btn {
      border: 1px solid #fff;
      outline: none;
      appearance: none;
      color: #fff;
      height: 80px;
      line-height: 80px;
      border-radius: 80px;
      padding: 0 40px;
      background-color: transparent;
    }
    .icon-wrapper {
      position: absolute;
      bottom: 68px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        height: 160px;
        width: 160px;
        display: block;
        margin-bottom: 45px;
      }
      span {
        font-size: 52px;
        color: #fff;
      }
    }
  }
  .page-main {
    .panel {
      background-color: #fff;
      padding: 30px 53px;
      margin-bottom: 22px;
      .title {
        font-size: 52px;
        padding-bottom: 30px;
        color: #404657;
      }
      ul {
        &.loading{
          position: relative;
          height: 130px;
          &::before {
            position: absolute;
            content: '';
            top: 0;
            left: 0;
            width: 60%;
            height: 50px;
            background-color: #ccc;
            opacity: 1;
            animation: skeleton-blink 1.2s ease-in-out infinite;
          }
          &::after {
            position: absolute;
            content: '';
            left: 0;
            top: 80px;
            width: 80%;
            height: 50px;
            background-color: #ccc;
            opacity: 1;
            animation: skeleton-blink 1.2s ease-in-out infinite;
          }
        }
        list-style: none;
        li {
          padding-left: 30px;
          &:not(:last-child) {
            margin-bottom: 30px;
          }
          span {
            border-radius: 30px;
            background-color: #000;
            opacity: 0.3;
            display: inline-block;
            position: relative;
            padding: 30px;
            color: #fff;
            font-size: 40px;
            &::before {
              position: absolute;
              content: '';
              top: 50%;
              display: inline-block;
              left: -60px;
              width: 0px;
              height: 0px;
              transform: translateY(-50%);
              border-top: 20px solid transparent;
              border-right: 40px solid #000;
              border-bottom: 20px solid transparent;
              border-left: 30px solid transparent;
            }
          }
        }
      }
      .text {
        font-size: 40px;
        color: #404657;
        opacity: 0.6;
        &.loading {
          height: 40px;
          background-color: #ccc;
          opacity: 1;
          animation: skeleton-blink 1.2s ease-in-out infinite;
        }
      }
    }
  }

  footer {
    color: #404657;
    font-size: 30px;
    position: fixed;
    bottom: 0;
    text-align: center;
    width: 100%;
    padding-bottom: 36px;
    line-height: 44px;
    img {
      display: inline-block;
      height: 44px;
      margin: 0 23px;
      vertical-align: text-bottom;
    }
  }
}

</style>