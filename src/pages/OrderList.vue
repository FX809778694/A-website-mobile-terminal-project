<template>
  <div class="index-container">
    <div class="list-search-area" v-if="showSearch">
      <x-input title=""  v-model="searchContent" type="text" label-width="4em" placeholder="请输入订单号" placeholder-align="left" class="search-input">
      </x-input>
      <a @click="enterSearch()">确定</a>
    </div>
    <h3 class="checkorder-title">
      订单列表
      <b @click="$router.go(-1)" class="back"></b>
      <b class="search" @click="switchSearch()"></b>
    </h3>
    <div class="swiper-txt-container clearfix">
      <ul>
        <li v-for="(item, index) in headerNav" :key="index" :class="{active : index == num ,  first:index == 0 }" @click="itemClick(index, item.state)">
          {{item.name}}
        </li>
      </ul>
    </div>
    <!-- 待审核 -->
    <div class="order-container  clearfix" v-for="(item, index) in listData[0]" :key="index">
      <p class="order-message clearfix">
        <span class="fl">订单号：{{item.B2BOrderNo}}</span>
        <span class="fr">{{"待审核"}}</span>
      </p>
      <ul class="goods-lists">
        <li v-for="(val, num) in item.OrderDetailList" :key="num">
          <div class="left-aside">
            <img :src="val.goods.MainImage" alt="">
          </div>
          <div class="right-aside">
            <h4>{{`${val.goods.Product}${val.goods.GoodsName}${val.goods.Format}`}}</h4>
            <p>
              <span>颜色：{{val.goods.ColorValue}}</span>
              <span>数量 {{val.GoodsCnt}}</span>
            </p>
          </div>
          <span class="price">￥{{val.SumSaleMoney}}</span>
        </li>
      </ul>
    </div>
    <!-- 已审核 -->
    <div class="order-container  clearfix" v-for="(item, index) in listData[1]" :key="index">
      <p class="order-message clearfix">
        <span class="fl">订单号：{{item.B2BOrderNo}}</span>
        <span class="fr">{{"已审核"}}</span>
      </p>
      <ul class="goods-lists">
        <li v-for="(val, num) in item.OrderDetailList" :key="num">
          <div class="left-aside">
            <img :src="val.goods.MainImage" alt="">
          </div>
          <div class="right-aside">
            <h4>{{`${val.goods.Product}${val.goods.GoodsName}${val.goods.Format}`}}</h4>
            <p>
              <span>颜色：{{val.goods.ColorValue}}</span>
              <span>数量 {{val.GoodsCnt}}</span>
            </p>
          </div>
          <span class="price">￥{{val.SumSaleMoney}}</span>
        </li>
      </ul>
    </div>
    <!-- 未通过 -->
    <div class="order-container  clearfix" v-for="(item, index) in listData[2]" :key="index">
      <p class="order-message clearfix">
        <span class="fl">订单号：{{item.B2BOrderNo}}</span>
        <span class="fr">{{"未通过"}}</span>
      </p>
      <ul class="goods-lists">
        <li v-for="(val, num) in item.OrderDetailList" :key="num">
          <div class="left-aside">
            <img :src="val.goods.MainImage" alt="">
          </div>
          <div class="right-aside">
            <h4>{{`${val.goods.Product}${val.goods.GoodsName}${val.goods.Format}`}}</h4>
            <p>
              <span>颜色：{{val.goods.ColorValue}}</span>
              <span>数量 {{val.GoodsCnt}}</span>
            </p>
          </div>
          <span class="price">￥{{val.SumSaleMoney}}</span>
        </li>
      </ul>
    </div>
    <!-- 退货 -->
    <div class="order-container  clearfix" v-for="(item, index) in listData[3]" :key="index">
      <p class="order-message clearfix">
        <span class="fl">订单号：{{item.B2BOrderNo}}</span>
        <span class="fr">{{"退货"}}</span>
      </p>
      <ul class="goods-lists">
        <li v-for="(val, num) in item.OrderDetailList" :key="num">
          <div class="left-aside">
            <img :src="val.goods.MainImage" alt="">
          </div>
          <div class="right-aside">
            <h4>{{`${val.goods.Product}${val.goods.GoodsName}${val.goods.Format}`}}</h4>
            <p>
              <span>颜色：{{val.goods.ColorValue}}</span>
              <span>数量 {{val.GoodsCnt}}</span>
            </p>
          </div>
          <span class="price">￥{{val.SumSaleMoney}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getItem } from "@/common/js/util"
import { GetOrderList, getReturnListApi } from "../api/index";
export default {
  name: "OrderList",
  data() {
    return {
      headerNav: [
        {
          name: "全部",
        },
        {
          name: "待审核",
          state: "0"
        },
        {
          name: "已审核",
          state: "1"
        },
        {
          name: "未通过",
          state: "-1"
        },
        {
          name: "退货",
          state: "6"
        },
          ],
      num: 0,
      showSearch: false,
      searchContent: "",
      listData: []
    };
  },
  created() {
    this.num = ~~this.$route.params.num
  },
  mounted() {
    let state = this.$route.params.num
    let type = ""

    switch (state) {
      case "0" : type = null
        break
      case "1" : type = "0"
        break
      case "2" : type = "1"
        break
      case "3" : type = "-1"
        break
      case "4" : type = "6"
        break
    }
    const params={
      ReqData:{
        UserID: getItem("User").UserId,
        search: "",
        PageIndex: 1,
        PageSize: 20,
        type: type
      }
    }

    this.initListData(params)
  },
  methods: {
    initListData(params) {
      GetOrderList(params)
        .then(this.globelReqHandle)
        .then(res => {
          this.listData = res.Results
          let dataArray = []
          let daishenhe = res.Results.filter(item => item.Status === 0) //待审核
          let yishenhe = res.Results.filter(item => item.Status === 1) //已审核
          let weitongguo = res.Results.filter(item => item.Status === -1) //未通过
          // 获取退货单
          getReturnListApi(params)
            .then(this.globelReqHandle)
            .then(res => {
              dataArray.push(daishenhe)
              dataArray.push(yishenhe)
              dataArray.push(weitongguo)
              dataArray.push(res.Results)
              this.listData = dataArray
            })
            .catch(this.globelErrHandle)

        })
        .catch(this.globelErrHandle);
    },
    itemClick(index, state) {
      this.num = index;
      if (state==="6") {
        const params= {
          ReqData: {
            UserID: getItem("User").UserId,
            search: "",
            PageIndex: 1,
            PageSize: 20
          }
        }
        // 获取退货单
        getReturnListApi(params)
          .then(this.globelReqHandle)
          .then(res => {
            console.log(res)
            let dataArray = []
            let daishenhe = res.Results.filter(item => item.Status === 0) //待审核
            let yishenhe = res.Results.filter(item => item.Status === 1) //已审核
            let weitongguo = res.Results.filter(item => item.Status === -1) //未通过
            dataArray.push(daishenhe)
            dataArray.push(yishenhe)
            dataArray.push(weitongguo)
            dataArray.push(res.Results)
            console.log(dataArray)
            this.listData = dataArray
          })
          .catch(this.globelErrHandle)
      } else {
        let type = ""
        let num = this.num
        switch (num) {
          case 0 : type = null
            break
          case 1 : type = "0"
            break
          case 2 : type = "1"
            break
          case 3 : type = "-1"
            break
          case 4 : type = "6"
            break
        }
        const params={
          ReqData:{
            UserID: getItem("User").UserId,
            search: "",
            PageIndex: 1,
            PageSize: 20,
            type: type
          }
        }
        this.initListData(params)
      }
    },
    switchSearch() {
      if(this.showSearch) {
        this.showSearch = false
      } else {
        this.showSearch = true
      }
    },
    enterSearch() {
      console.log(111)
      this.showSearch = false

      let num = this.num
      let type = ""

      switch (num) {
        case 0 : type = null
          break
        case 1 : type = "0"
          break
        case 2 : type = "1"
          break
        case 3 : type = "-1"
          break
        case 4 : type = "6"
          break
      }
      const params={
        ReqData:{
          UserID: getItem("User").UserId,
          search: this.searchContent,
          PageIndex: 1,
          PageSize: 20,
          type: type
        }
      }
      this.initListData(params)
    }
  }
};
</script>

<style lang="scss" scoped>
.checkorder-title {
  font-weight: 600;
  font-size: 16px;
  font-family: PingFangSC;
  color: #212128;
  text-align: center;
  position: relative;
  margin-top: 12px;
  .back {
    width: 12px;
    height: 20px;
    background: url(../assets/returnb.png);
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    left: 10px;
    background-size: 100% 100%;
  }
  .search {
    height: 20px;
    width: 20px;
    background: url(../assets/search.png);
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: 3px;
    background-size: 100% 100%;
  }
}
.swiper-txt-container {
  width: 100%;
  ul {
    overflow-x: scroll;
    width: 100%;
    height: 40px;
    white-space: nowrap;
    float: left;
    overflow-y: hidden;
    margin-top: 15px;
  }
  li {
    display: inline-block;
    height: 30px;
    margin-right: 20px;
    font-size: 14px;
    color: #e0e0e0;
    text-align: center;
    width: 40px;
  }
  .active {
    font-size: 16px;
    color: #212128;
  }
}
.order-container {
  margin-top: 10px;
}
.order-message {
  font-size: 14px;
  font-weight: 600;
}
.goods-lists {
  li {
    display: flex;
    align-items: center;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    border-radius: 5px;
    position: relative;
    padding: 10px;
    .price {
      position: absolute;
      bottom: 4px;
      right: 10px;
      color: #f43543;
    }
  }
  .left-aside,
  .right-aside {
    float: left;
  }
  .left-aside {
    margin-right: 5%;
    height: 72px;
    width: 72px;
    img {
      width: 72px;
      height: 72px;
    }
  }
  .right-aside {
    h4 {
      font-size: 14px;
      letter-spacing: 0.2px;
      color: #000;
      font-family: SFProDisplay;
    }
    span {
      font-size: 10px;
      color: #aaaaaa;
      font-family: PingFangSC;
    }
  }
}
.first {
  text-align: left !important;
}
::-webkit-scrollbar {
  width: 0;
}
.list-search-area{
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
}
</style>