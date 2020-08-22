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
        <div class="background">
          <img :src="back">
        </div>
        <div class="icon-wrapper">
          <img :src="icon" class="icon" />
          <span>{{name}}</span>
        </div>
      </div>
      <!-- 内容 -->
      <div class="page-main">
        <div class="panel">
          <p class="title">您可以这么说</p>
          <ul>
            <li v-for="(item, index) in illustrate" :key="index">
              <span>{{item}}</span>
            </li>
          </ul>
        </div>
        <div class="panel">
          <p class="title">技能介绍</p>
          <p>{{introduce}}</p>
        </div>
        <div class="panel">
          <p class="title">使用说明</p>
          <p>{{direction_use}}</p>
        </div>
      </div>
      <footer>此技能由xxx提供</footer>
    </gree-page>
  </gree-view>
</template>
<script>
import { Header } from 'gree-ui';
import { voiceACgetSkillInfo } from '../../../../../public/static/lib/PluginInterface.promise';
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
      hasSettings: true,
      back: '',
      icon: '',
    }
  },
  async created() {
    let result = await voiceACgetSkillInfo(Number(this.id));
    console.log(result);
    if (result) {
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
      this.illustrate = result.illustrate;
      this.name = result.name;
      this.direction_use = result.direction_use;
      this.introduce = result.introduce;
      this.back = result.picture;
      this.icon = result.icon;
    }
  },
  methods: {
    gotoSettings() {
      alert('settings');
    }
  }
}
</script>
<style lang="scss">
.page-skill-detail {
  position: relative;
  .page-header {
    position: relative;
    height: 560px;
    .background {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
      background-color: rgb(107, 74, 32);
    }
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
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      .icon {
        height: 160px;
        width: 160px;
        display: block;
        margin-bottom: 20px;
      }
      span {
        color: #fff;
      }
    }
  }
  .page-main {
    .panel {
      background-color: #fff;
      padding: 20px;
      margin-bottom: 20px;
      .title {
        padding-bottom: 20px;
      }
      ul {
        list-style: none;
        li {
          span {
            border-radius: 10px;
            background-color: #B2B2B2;
            display: inline-block;
            padding: 20px;
            color: #fff;
            position: relative;
            &::before {
              position: absolute;
              content: '';
              width: 20px;
              height: 20px;
              top: 50%;
              left: 0;
              transform: translate(-50%, -50%) rotate(45deg);
              background-color: #B2B2B2;
            }
          }
          padding-bottom: 20px;
        }
      }
    }
  }

  footer {
    position: fixed;
    bottom: 0;
    text-align: center;
    width: 100%;
    padding-bottom: 20px;
  }
}
</style>