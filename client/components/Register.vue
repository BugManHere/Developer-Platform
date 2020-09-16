<template>
  <div class="register">
    <section class="form_container">
      <span class="title">研发四所开发平台</span>
      <form class="form-horizontal">
        <div class="form-group ">
          <div class="col-sm-16">
            <input
              type="email"
              class="form-control"
              id="inputEmail3"
              placeholder="用户名"
              v-model="registerUser.name"
            >
          </div>
        </div>
        <div class="form-group">
          <div class="col-lg-16">
            <input
              type="email"for="inputError2"
              class="form-control"
              id="inputEmail3"
              placeholder="邮箱号"
              v-model="registerUser.email"
            >
            <span class="input-group-btn">
              <button
                class="btn btn-default"
                :class="{disabled: !verifyClickAble}"
                type="button"
                @click="Verify()"
              >{{ verifyBtnWord }}</button>
            </span>
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-14">
            <input
              type="password"
              class="form-control"
              id="inputPassword3"
              placeholder="验证码"
              v-model="registerUser.password"
            >
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-14">
            <input
              type="password"
              class="form-control"
              id="inputPassword3"
              placeholder="密码"
              v-model="registerUser.password"
            >
          </div>
        </div>
        <div class="form-group">
          <div class="col-sm-14">
            <input
              type="password"
              class="form-control"
              id="inputPassword3"
              placeholder="确认密码"
              v-model="registerUser.password2"
            >
          </div>
        </div>
        <div class="form-group error-message">
          <span>{{ errorMsg }}</span>
        </div>
        <div class="form-group">
          <button
            type="submit"
            class="btn btn-primary"
            @click="submitForm('loginForm')"
          >注册</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import https from "../https";

export default {
  data() {
    return {
    errorMsg: '',
      registerUser: {
        name: "",
        email: "",
        password: "",
        password2: "",
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
      },
      verifyBtnWord: '获取验证码',
      verifyClickAble: true,
      verifyTimer: null,
      CountdownTime: 60,
    };
  },
  methods: {
    //  提交表单
    submitForm() {
      https.fetchPost("users/register", this.registerUser).then(res => {

      });
    },
    Verify() {
      this.verifyClickAble = false;
      this.verifyBtnWord = '60s后重新获取';
      this.verifyTimer = setInterval(() => {
        this.CountdownTime -= 1;
        this.verifyBtnWord = `${this.CountdownTime}s后重新获取`;
        if (!this.CountdownTime) {
          clearInterval(this.verifyTimer);
          this.verifyClickAble = true;
          this.verifyBtnWord = '重新获取验证码';
          this.CountdownTime = 60;
        }
      }, 1000);
      https
        .fetchPost("users/mail", this.registerUser)
        .then(res => {
          if (res.status === 202) {
            this.errorMsg = res.data;
          } else {
            this.errorMsg = '';
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
  }
};
</script>