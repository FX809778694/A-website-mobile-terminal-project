<template>
  <div class="login_wrap">
    <!-- 错误提示 -->
    <toast :model="!loginStatus" type="warn">{{ loginMsg }}</toast>
    <div class="login-title">
        登陆
    </div>
    <!-- 表单登录 -->
    <form class="login_form" action="javascript:;">
      <div class="login-item-title">
        <span class="weui-label" slot="label" style="width: 4em;">用户名<i></i></span>
        <div class="input-username">
          <input class="user-name" type="text" v-model="LoginName" autofocus />
        </div>
      </div>
      <div class="login-item-title">
        <span class="weui-label" slot="label" style="width: 4em;">密码<i></i></span>
        <x-input
          ref="passward"
          title=""
          v-model="LoginPwd"
          required
          :is-type="validVal"
          :type="passwordType"
          label-width="4em"
          placeholder=""
          :autofocus="autofocus"
        >
          <i slot="right" >
            <img @click="switchType" src="../assets/eye.png"/>
          </i>
        </x-input>
      </div>
      <x-button
        @click.native="handleLogin"
        class="btn_login"
        style="border-radius: 20px;"
      >登录</x-button>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { login } from "../api";
import { setItem, getItem } from "../common/js/util";
import { globelFnHanle } from "@/common/js/mixin.js";
import { setTimeout } from "timers";

export default {
  name: "Login",
  data() {
    return {
      loginStatus: true,
      loginMsg: "",
      LoginName: "",
      LoginPwd: "",
      passwordType: "password",
      validVal: name => {
        return {
          valid: name !== "",
          msg: "用户名不为空"
        };
      }
    };
  },
  computed: {
    ...mapState([
      "loading",
      "errorMsg",
      "isRequestErr",
      "isLogin",
      "headerOpt"
    ]),
  },
  components: {},
  mixin: [globelFnHanle],
  created() {
    //如果登陆过自动登陆
    const User = getItem("User")
    if(User) {
      this.LoginName = User.LoginName
      this.LoginPwd = User.LoginPwd
    }

  },
  mounted() {},
  directives: {
    focus: {
      bind: function(el) {
        el.focus();
      }
    }
  },
  methods: {
    ...mapMutations([
      "setLoading",
      "setErrorMsg",
      "setRequestErr",
      "setLogin",
      "setBookId"
    ]),
    handleLogin() {
      const { LoginName, LoginPwd } = this;

      const params = {
        ReqData:{
          LoginName,
          LoginPwd
        }
      };

      login(params)
        .then(this.globelReqHandle)
        .then(res => {
          if(res.Code === 200) {
            const Token = res.Token
            setItem("Token", Token)
            const { LoginName, LoginPwd } = this;
            const User = {
              LoginName: LoginName,
              LoginPwd: LoginPwd,
              UserId: res.Result.UserId
            }
            setItem("User", User)
            setItem("NowNav", "首页")
          }

          setTimeout(() => {
            this.$router.push({ name: "IndexPage" });
          }, 20);
        })
        .catch(this.globelErrHandle);
    },
    switchType() {
      if(this.passwordType === "text") {
        this.passwordType = "password"
      } else {
        this.passwordType = "text"
      }
    }
  }
};
</script>

<style lang="scss">
@import "../common/css/_var";

input{-webkit-appearance: none; -moz-appearance: none; -o-appearance: none; appearance: none;}
input[type=text]:focus, input[type=password]:focus {
  border: 2px solid #f00;
}
/* 长按出的按钮背景色 */
.weui-btn_default:not(.weui-btn_disabled):active{
  background-color: #d4dbe3!important;
}
.user-name{
  outline: none;
  padding: 10px 0 10px 0;
  text-decoration: none!important;
}
.input-username{
  border-bottom: 1px solid #ebebeb;
  margin-left: 12px;
}
/* 登录注册样式 */
.login_wrap {
  width: 100%;
  height: 100%;
  font-size: 14px;
  background-size: 100% 100%;
  box-sizing: border-box;
  // 标题部分
  .login-title{
    font-size: 38px;
    color: #1b1b4e;
    padding: 16vh 8vw 0;
  }
  // 表单输入
  .login-item-title{
    & span{
      font-size: 16px;
      color: #aeb3c0;
      margin-left: 10px;
    }
    & span:last-of-type{
      margin-top: 2vh;
    }
  }
  .login_form {
    font-family: PingFangSC;
    padding: 4.498vh 8vw 0;
    input {
      position: relative;
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-weight: normal;
      text-align: left;
      border: none;
      border-radius: 40px;
      box-sizing: border-box;
      background-color: transparent;
    }
    // 提示文字颜色
    ::-webkit-input-placeholder,
    ::placeholder {
      color: #d7dae6;
    }
    .weui-cell:before {
      display: none;
    }
    .weui-cell:after {
      content: " ";
      position: absolute;
      right: 0;
      bottom: 0;
      height: 1px;
      border-top: 1px solid #d9d9d9;
      color: #d9d9d9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      left: 15px;
    }
    // 文字两端对齐
    .weui-label {
      height: 22.4px;
      color: #9ea8b2;
      > i {
        display: inline-block;
        width: 100%;
      }
    }
    .btn_login {
      width: 100%;
      height: 6.897vh;
      font-family: PingFangSC;
      font-size: 18px;
      font-weight: normal !important;
      text-align: center;
      line-height: 2;
      letter-spacing: 0.5px;
      margin-top: 14vh;
      color: #fff;
      border-radius: 15px;
      background-color: #d7161e;
      box-shadow: 0 5px 15px 0 rgba(215, 22, 30, 0.3);
    }
  }
}
</style>

