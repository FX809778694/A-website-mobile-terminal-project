<template>
  <div id="app" v-cloak>
    <loading v-model="loading"></loading>
      <transition
        :name="viewTransition"
        :css="!!direction">
        <router-view class="router-view"></router-view>
      </transition>
    <!-- 全局错误提示 -->
    <toast :value.sync="isRequestErr" @on-hide="onHide" type="warn">{{ errorMsg }}</toast>
    <BackTop></BackTop>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import BackTop from "./components/BackTop"

export default {
  name: "app",
  data() {
    return {
      drawerVisibility: false,
      showModeValue: "overlay",
      drawerStyle: {
        width: "220px",
        backgroundColor: "#fff"
      },
      results: [],
      search: "",
      newTitle: "one"
    };
  },
  components: {
    BackTop
  },
  computed: {
    ...mapState([
      "loading",
      "errorMsg",
      "isRequestErr",
      "direction",
      "tabbarIndex",
      "isLogin",
      "isDetail",
      "demoTitle"
    ]),
    viewTransition() {
      if (!this.direction) return "";
      return "vux-pop-" + (this.direction === "forward" ? "in" : "out");
    }
  },
  created() {},
  mounted() {
    console.log(this.demoTitle);
  },
  methods: {
    ...mapMutations([
      "setLoading",
      "setErrorMsg",
      "setRequestErr",
      "setTabbarIndex",
      "setLogin",
      "setDetail",
      "setTitle"
    ]),
    onHide() {
      this.setRequestErr(false);
    }
  }
}
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "~vux/src/styles/1px.less";

body {
  background-color: #fff;
}
</style>

<style lang="scss">
@import "./common/css/mixin/_clearfix";
@import "./common/css/mixin/_multi_overflow";

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
}
.index-container {
  padding: 0 20px 100px 20px;
}
.vux-drawer {
  background-color: #fafbfd;
}
.drawer {
  position: relative;
  width: 100%;
  height: 100%;
  .uesr_action {
    position: absolute;
    width: 100%;
    bottom: 10px;
    height: 6.597vh;
    font-size: 14px;
    line-height: 3;
    letter-spacing: 0.4px;
    text-align: center;
    color: #4c495b;
    > img,
    > span {
      display: inline-block;
      vertical-align: middle;
    }
    > img {
      width: 15px;
      height: 16px;
      margin-right: 2%;
    }
  }
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 分类列表页样式 */
.category_content {
  position: relative;
  height: 100%;
  font-family: PingFangSC;
  padding: 46px 0 53px;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fafafa;
  .category_left,
  .category_right {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .list_wrapper {
      width: 100%;
    }
  }
  .category_left {
    width: 27%;
  }
  .category_right {
    width: 73%;
    background: #fff;
  }
  .left_wrapper,
  .right_wrapper {
    box-sizing: border-box;
  }
  .left_wrapper {
    > p {
      min-height: 42px;
      line-height: 24px;
      font-family: PingFangSC;
      font-size: 14px;
      padding: 9px 0;
      padding-left: 20%;
      padding-right: 4%;
      letter-spacing: 0.7px;
      color: #414141;
      box-sizing: border-box;
    }
    .active {
      background-color: #f3f3f3;
    }
  }
  .right_wrapper {
    > div {
      min-height: 42px;
      font-family: PingFangSC;
      line-height: 24px;
      padding: 9px 16px 9px 24px;
      box-sizing: border-box;
    }
    .category_title {
      font-size: 14px;
      letter-spacing: 0.7px;
      color: #414141;
    }
    .category_sum {
      font-family: PingFangSC;
      font-size: 14px;
      letter-spacing: 0.7px;
      text-align: right;
      color: #888888;
    }
  }
}

/*重置颜色*/
.vux-number-selector svg {
  fill: red!important;
}
.vux-number-round .vux-number-selector-sub, .vux-number-round .vux-number-selector-plus {
  border: 1px solid red !important;
}
.vux-number-round .vux-number-selector-sub svg {
  top: -2px!important;
  left: -2px!important;
  position: relative;
}
.vux-number-round .vux-number-selector-plus svg {
    top: -3px!important;
    left: -3px!important;
    position: relative;
  }
/*重置详情页的轮播小点*/
  .wc-pagination {
    justify-content: flex-end;
    padding-right: 16px;
   .wc-dot-active {
     background: #e4393c;
   }
  }
  /* 重置checkList样式 */
  .vux-checker-item{
    display: block!important;
  }
  /* 重置客服的模态框 */
  .my-center{
    .weui-dialog{
      bottom: -54vh!important;
      max-width: 100%!important;
      width: 100%!important;
    }
  }

  /* 我的足迹和收藏 */
.my-foot-shop{
  padding: 2vh 20px 40px 20px;
  .shop-head{
    display: flex;
    justify-content: flex-start;
    .foot-img{
      width: 12px;
      height: 20px;
      & img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    & p{
      margin-left: 32vw;
    }
  }
}
.shop{
  &-car{
    width: 100%;
    height: auto;
    padding: 0 10px;
    & h1{
      width: 100%;
      font-size: 16px;
      text-align: center;
      color: #212128;
      margin-top: 6vh;
    }
  }
  &-null{
    margin-top: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    & h3{
      font-size: 14px;
      color: #aaa;
      margin-top: 1%;
    }
  }
  &-icon{
    width: 162px;
    height: 104px;
    & img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  &-btn{
    width: 50%;
    height: 6vh;
    background: #d7161e;
    box-shadow: 0 5px 15px 0 rgba(215, 22, 30, 0.3);
    text-align: center;
    line-height: 6vh;
    border-radius: 10px;
    margin-top: 5vh;
    color: #fff;
    & a{
      display: block;
    }
  }

  &-head{
    display: flex;
    justify-content: space-between;
    margin-top: 4vh;
    color: #212128;
    font-size: 16px;
    & p{
      font-weight: bold;
    }
  }
  &-title{
    color: #212128;
    font-size: 14px;
    font-weight: bold;
    margin: 10px 0;
  }

  &-item-check{
    width: 15px;
    height: 15px;
    background-position: center center;
    background-size: 15px, 15px;
    margin-right: 3%;
  }
  &-content{
    margin-top: 1vh;
  }
}
.item-selected .shop-item-check{
  background-image: url("./assets/check-box-y.png")!important;
}
.item .shop-item-check{
  background-image: url("./assets/check-box-n.png");
}
.shop-item{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &-content{
    width: 94%;
    border-radius: 5px;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 2%;
    padding: 16px;
    position: relative;

    .content-img{
      width: 72px;
      height: 72px;
      margin-right: 10px;
    }
    .content-r{
      width: 70%;
      padding: 1%;
      & h3{
        color: #000000;
        font-size: 15px;
        letter-spacing: 0.2px;
        @include multi-overflow(1);
      }
      &-item{
        font-size: 12px;
        color: #aaa;
      }
      &-price{
        position: absolute;
        bottom: 6px;
        right: 4px;
        color: #f43543;
        letter-spacing: 0.2px;
        font-size: 14px;
      }
    }
  }
}
/* 足迹购物车收藏操作 */
.opera-block{
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 7vh;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  &-l{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .img{
      width: 15px;
      height: 15px;
      margin-top: 2px;
      & img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    & span{
      margin-left: 4px;
    }
  }
  &-r{
    width: 88px;
    height: 28px;
    border-radius: 16px;
    background-color: #ffffff;
    border: solid 1px #f43543;
    text-align: center;
    line-height: 28px;
  }
}
  /* 加载更多 */
  .get-more{
    width: 100%;
    text-align: center;
    line-height: 30px;
    margin: 10px 0;
    margin-top: 30px;
  }
</style>

