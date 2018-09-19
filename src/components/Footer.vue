<template>
  <footer>
    <router-link to="/IndexPage" @click.native="turnActive($event)" v-show="nav.home">
      <b class="home"></b>
      首页
    </router-link>
    <div class="active-container" v-show="!nav.home">
      <span class="home-active"></span>
    </div>
    <router-link to="/category" @click.native="turnActive($event)" v-show="nav.classifiy">
      <b class="classifiy"></b>
      分类
    </router-link>
    <div class="active-container" v-show="!nav.classifiy">
      <span class="classifiy-active"></span>
    </div>
    <router-link to="/shopcart" @click.native="turnActive($event)" v-show="nav.shopCar">
      <b class="shopCar"></b>
      购物车
    </router-link>
    <div class="active-container" v-show="!nav.shopCar">
      <span class="shopCar-active"></span>
    </div>
    <router-link to="/mycenter" @click.native="turnActive($event)" v-show="nav.mine">
      <b class="mine"></b>
      我的
    </router-link>
    <div class="active-container" v-show="!nav.mine">
      <span class="mine-active"></span>
    </div>
  </footer>
</template>

<script>
import { setItem, getItem } from "../common/js/util";
export default {
  name: "footerbar",
  data() {
    return {
      nav: {
        home: true,
        classifiy: true,
        shopCar: true,
        mine: true
      }
    };
  },
  mounted() {
    // debugger
    switch (getItem("NowNav")) {
      case "首页":
        this.nav = { home: false, classifiy: true, shopCar: true, mine: true };
        break;
      case "分类":
        this.nav = { home: true, classifiy: false, shopCar: true, mine: true };
        break;
      case "购物车":
        this.nav = { home: true, classifiy: true, shopCar: false, mine: true };
        break;
      case "我的":
        this.nav = { home: true, classifiy: true, shopCar: true, mine: false };
        break;
    }
  },
  methods: {
    turnActive(e) {
      let str = e.target.innerHTML;
      if (str.indexOf("首页") != -1) {
        setItem("NowNav", "首页");
        this.$router.push({ name: "IndexPage" });
      } else if (str.indexOf("分类") != -1) {
        setItem("NowNav", "分类");
        this.$router.push({ name: "CategoryList" });
      } else if (str.indexOf("购物车") != -1) {
        setItem("NowNav", "购物车");
        this.$router.push({ name: "ShopCart" });
      } else if (str.indexOf("我的") != -1) {
        setItem("NowNav", "我的");
        this.$router.push({ name: "MyCenter" });
      }
    }
  }
};
</script>



<style  lang="scss">
footer {
  height: 50px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  background: #fff;
  align-items: flex-end;
  box-sizing: border-box;
  padding-bottom: 5px;
  a {
    position: relative;
    font-size: 10px;
    color: #8e8e93;
    b {
      width: 20px;
      height: 20px;
      position: absolute;
      top: -22px;
      left: 50%;
      margin-left: -10px;
      background: url(../assets/2@3x.png);
      background-size: cover;
    }
    .classifiy {
      background: url(../assets/2c@3x.png);
      background-size: cover;
    }
    .shopCar {
      background: url(../assets/2s@3x.png);
      background-size: cover;
    }
    .mine {
      background: url(../assets/2m@3x.png);
      background-size: cover;
    }
  }
  .active-container {
    height: 100%;
    display: flex;
    align-items: center;
    span {
      float: left;
      width: 35px;
      height: 35px;
      background: url(../assets/1rh@3x.png);
      background-size: cover;
    }
    .classifiy-active {
      background: url(../assets/2rc@3x.png);
      background-size: cover;
      width: 36px;
    }
    .shopCar-active {
      background: url(../assets/3rs@3x.png);
      background-size: cover;
      width: 36px;
    }
    .mine-active {
      background: url(../assets/4rm@3x.png);
      background-size: cover;
    }
  }
}
</style>
