<template>
  <gree-view bg-color="#ffffff">
    <gree-page class="page-skill-detail no-navbar">
      <!-- 标题 -->
      <div class="page-header">
        <gree-header theme='transparent'></gree-header>
        <div class="background"></div>
      </div>
      <!-- 内容 -->
      <div class="page-main">
        <div class="illustrate-content">
          <p>您可以这么说</p>
          <ul>
            <li v-for="(item, index) in illustrate" :key="index">
              {{item}}
            </li>
          </ul>
        </div>
      </div>
    </gree-page>
  </gree-view>
</template>
<script>
import { Header } from 'gree-ui';
export default {
  components: {
    [Header.name]: Header,
  },
  data() {
    return {
      illustrate: ['今天天气怎么样', '今天适合穿什么衣服']
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
  }
  .page-main {
    .illustrate-content {
      background-color: #fff;
      ul {
        list-style: none;
        li {
          border-radius: 10px;
          background-color: rgb(121, 121, 121);
        }
      }
    }
  }
}
</style>