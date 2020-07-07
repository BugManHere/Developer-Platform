<template>
  <div class="login">
    <section class="form_container">
      <!-- <span class="title">格力风驰平台</span> -->
      <form class="form-horizontal">
        <div class="form-group">
          <div class="col-sm-16">
            <input
              type="email"
              class="form-control"
              id="inputEmail3"
              placeholder="请输入账号/邮箱号"
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
          >登录</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import https from '../https';
import { mapMutations } from 'vuex';

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
    ...mapMutations({
      setAuthenticated: 'SET_AUTHENTICATED',
      setUser: 'SET_USER',
    }),
    //  提交表单
    submitForm() {
      https.fetchPost("users/login", this.loginUser)
      .then(res => {
        console.log(res);
        // 获取token
        const { status, data } = res;
        if (status === 200) {
          const { token } = data;
          localStorage.setItem("eleToken", token);
          // 解析token
          const decoded = jwt_decode(token);
          // token储存在vuex中
          this.setAuthenticated(!this.isEmpty(decoded));
          this.setUser(decoded);
          this.$toast.info('登录成功');
          this.$router.push("/Home");
        } else {
          this.$toast.error(data);
        }
      }).catch(e => {
        console.log(e);
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