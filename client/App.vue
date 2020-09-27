<template>
  <div id="app">
    <Header />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header';
import jwt_decode from 'jwt-decode';
import { mapMutations } from 'vuex';
import axios from 'axios';

export default {
  name: 'app',
  components: {
    Header
  },
  created() {
    console.log(`当前服务器地址：${process.env.VUE_APP_SERVE_URL}`);

    if (localStorage.eleToken) {
      // 解析token
      const decoded = jwt_decode(localStorage.eleToken);
      // token储存在vuex中
      this.setAuthenticated(!this.isEmpty(decoded));
      this.setUser(decoded);
      this.setUserModule({
        admin: decoded.email
      });
    }

    axios
      .get(`${process.env.VUE_APP_ICONFONT_URL}.json`)
      .then(
        response => {
          const glyphs = response.data.glyphs;
          const classList = glyphs.map(icon => icon.font_class);
          this.setUserModule({
            iconArr: classList
          });
        },
        err => {
          console.log(err);
        }
      )
      .catch(error => {
        console.log(error);
      });
    // const { glyphs } = require('@public/iconfont/iconfont.json');
    // const classList = glyphs.map(icon => icon.font_class);
    // this.setUserModule({
    //   iconArr: classList
    // });
  },
  methods: {
    ...mapMutations({
      setAuthenticated: 'SET_AUTHENTICATED',
      setUser: 'SET_USER',
      setUserModule: 'SET_USER_MODULE'
    }),
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
      );
    }
  }
};
</script>
