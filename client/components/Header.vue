<template>
  <div class="components-header header" style="z-index: 1;">
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
          <a class="navbar-brand" href="#">GDP</a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1" v-if="user.identity">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">产品开发 <span class="sr-only">(current)</span></a></li>
            <li><a href="#">设备管理</a></li>
            <li class="dropdown">
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
            </li>
          </ul>
          <form class="navbar-form navbar-left">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search">
            </div>
            <button type="submit" class="btn btn-default">查找</button>
          </form>
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">开发文档</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">我的 <span class="caret"></span></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" class="divider"></li>
                <li><a href="#">Separated link</a></li>
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
import { mapState } from "vuex";

export default {
  props: {
    msg: String
  },
  computed: {
    ...mapState({
      user: state => state.user,
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
