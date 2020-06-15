<template>
  <div class="login">
    <section class="form_container">
      <span class="title">研发四所开发平台</span>
      <form class="form-horizontal">
        <div class="form-group">
          <div class="col-sm-16">
            <input
              type="email"
              class="form-control"
              id="inputEmail3"
              placeholder="请输入邮箱号"
              v-model="loginUser.email"
            >
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-14">
            <input
              type="password"
              class="form-control"
              id="inputPassword3"
              placeholder="请输入密码"
              v-model="loginUser.password"
            >
          </div>
        </div>
        <div class="form-group">
          <button
            type="submit"
            class="btn btn-primary"
            @click="submitForm('loginForm')"
          >登陆</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import https from '../https';

export default {
  data() {
    return {
      loginUser: {
        email: "",
        password: "",
      },
      rules: {
        email: [
          {
            required: true,
            message: "邮箱不正确",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            min: 6,
            message: "长度最小6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //  提交表单
    submitForm() {
      https.fetchPost("users/login", this.loginUser).then(res => {
        // 获取token
        const { token } = res.data;
        localStorage.setItem("eleToken", token);
        // 解析token
        const decoded = jwt_decode(token);
        // token储存在vuex中
        this.$store.dispatch("setAuthenticated", !this.isEmpty(decoded));
        this.$store.dispatch("setUser", decoded);
        this.$router.push("/Home");
      });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>