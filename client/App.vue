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
      .get(process.env.VUE_APP_ICONFONT_URL)
      .then(
        response => {
          const regGlobal = /\.(.*):before {/g;
          const reg = /\.iconfont-(.*):before {/;
          const value = response.data.match(regGlobal).map(str => str.match(reg)[1]);
          console.log(value);
          this.setUserModule({
            iconArr: value
          });
        },
        err => {
          console.log(err);
        }
      )
      .catch(error => {
        console.log(error);
      });
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
