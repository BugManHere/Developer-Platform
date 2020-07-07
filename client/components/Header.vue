<template>
  <div class="components-header header" style="z-index: 10;">
    <nav 
      class="navbar navbar-default" style="margin-bottom: 0">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <!-- <a class="navbar-brand" href="#Home" @click="updataPage('Home')">Plugin自动化开发平台</a> -->
          <a class="navbar-brand" @click="updataPage('Home')" v-text="webTitle"/>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" v-if="true">
          <ul class="nav navbar-nav" v-show="$route.name !== 'Account'">
            <li :class="{active: developType === 0}" @click="setDevelopType(0)">
              <a href="#Home" @click="updataPage('Home')">设备管理</a>
            </li>
            <li :class="{active: developType === 1}" @click="setDevelopType(1)">
              <a href="#Home" @click="updataPage('Home')">模板定义</a>
            </li>
            <!-- <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">运营中心 <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">Separated link</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li> -->
          </ul>
          <!-- <form class="navbar-form navbar-left">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search">
            </div>
            <button type="submit" class="btn btn-default">查找</button>
          </form> -->
          <ul class="nav navbar-nav navbar-right" v-show="$route.name !== 'Account'">
            <!-- <li><a href="#">开发文档</a></li> -->
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{userName}} <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#Account/Login" @click="signOut">退出登录</a></li>
              </ul>
            </li>
          </ul>
        </div>
        <!-- <div v-else class="register">
          <ul class="nav navbar-nav navbar-right" v-if="$route.params.loginType === 'Register'">
            <li><a>已有账号，</a></li>
            <li><a href="#/Account/Login">登录</a></li>
          </ul>
          <ul class="nav  navbar-nav navbar-right" v-else>
            <li><a>还没账号？</a></li>
            <li><a href="#/Account/Register">注册</a></li>
          </ul>
        </div> -->
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    msg: String
  },
  computed: {
    ...mapState({
      user: state => state.userModule.user,
      developType: state => state.pulicModule.developType,
    }),
    webTitle() {
      if (this.$route.name === 'Account') return '格力风驰平台 | 登录'
      return '格力风驰平台';
    },
    userName() {
      return this.user.email;
    }
  },
  watch: {
    '$route.name'(newVal, oldVal) {
      (newVal === 'Template' || oldVal === 'Template') && this.setPulicMoule(['developType', 1]);
      (newVal === 'Device' || oldVal === 'Device') && this.setPulicMoule(['setDevStep', 0]);
    }
  },
  methods: {
    ...mapMutations({
      setPulicMoule: 'SET_PULIC_MODULE',
      setAuthenticated: 'SET_AUTHENTICATED',
      setUser: 'SET_USER',
    }),
    updataPage(routeName) {
      if (this.$route.name !== routeName && this.$route.name !== 'Account') {
        this.$router.push({name: routeName}).catch(err => {
          console.log(err);
        });
      }
    },
    setDevelopType(val) {
      this.setPulicMoule(['developType', val]);
    },
    signOut() {
      // 清除token
      localStorage.removeItem("eleToken");
      // 清除vuex store
      this.setAuthenticated(false);
      this.setUser(null);
      this.$toast.info('已退出登录');
      // 跳转登陆界面
      this.$router.push("/Account/Login");
    }
  },
}
</script>
