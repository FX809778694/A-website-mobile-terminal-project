<!--
 Created by Thomas on 2018/8/8.
 分类页
 -->
<template>
  <div class="category">
    <div style="width: 90%;margin: 0 auto">
      <search-wrap></search-wrap>
    </div>

    <!-- 分类部分 -->
    <div class="category-content">
      <div class="category-content-l">
        <p class="category-select">{{select}}</p>
        <scroller lock-x scrollbar-y height="400px" ref="scrollerLeft">
          <div class="scroll-p" style="padding-bottom: 20px">
            <p
              v-for="(item, index) in categoryData" :key="index"
              @click="getTwocategory(item.id, item.name)"
            >
              {{item.name}}
            </p>
          </div>
        </scroller>
      </div>
      <div class="category-content-r">
        <scroller lock-x scrollbar-y height="400px" ref="scrollerRight">
          <div class="scroller-right" style="padding-bottom: 40px">
            <div class="two-category" v-for="(item, index) in categoryTwoData" :key="index">
              <h3 @click="$router.push({ name: 'ThreeLevelModule', params: { id: item.id }})">{{item.name}}</h3>
              <div class="three-category" >
                <p v-for="(value, num) in item.ChildrenList"
                   :key="num"
                   @click="$router.push({ name: 'ThreeLevelModule', params: { id: value.FXFLID }})"
                >{{`${value.FXFLMC}`}}</p>
              </div>
            </div>
          </div>
        </scroller>
      </div>
    </div>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
  import SearchWrap from "../components/SearchWrap.vue";
  import FooterBar from "../components/Footer.vue";
  import { fetchCategoryApi, fetchTwoCategoryApi } from "../api"
  import { dataHandle } from "../common/js/util"
  import { globelFnHanle } from "@/common/js/mixin.js";

  export default {
    name: "CategoryList",
    components: {
      SearchWrap,
      FooterBar
    },
    mixin: [globelFnHanle],
    data() {
      return {
        categoryData: [],
        categoryTwoData: [],
        isActive: "",
        select: ""
      }
    },
    created() {

    },
    mounted() {
      this.fetchCategory()
    },
    methods: {
      fetchCategory() {
        fetchCategoryApi()
          .then(this.globelReqHandle)
          .then(res => {
            this.categoryData = dataHandle(res.Results)

            const id = this.categoryData[0].id
            const select = this.categoryData[0].name
            this.getTwocategory(id, select)
          })
          .catch(this.globelErrHandle)

      },
      getTwocategory(id, name) {
        this.select = name
        this.isActive = id
        fetchTwoCategoryApi(id)
          .then(this.globelReqHandle)
          .then(res =>{
            this.categoryTwoData = dataHandle(res.Results, "three")
          })
          .catch(this.globelErrHandle)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/css/mixin/_multi_overflow";

  .category{
  }
  .category-content{
    margin-top: 2vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
    &-l{
      width: 26%;
      border-radius: 5px;
      background-color: #ffffff;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
      padding:  15px 0;
      & > div{
        height: 63vh!important;
      }
      .scroll-p{
        & p{
          font-size: 14px;
          color: #212128;
          line-height: 20px;
          padding: 15px 20px;
          display: block;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .active{
          color: #F43543!important;
          font-weight: bold!important;
        }
      }
    }
    &-r{
      width: 60%;
      border-radius: 5px;
      background-color: #ffffff;
      box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
      padding: 15px 10px 15px 10px;
      & > div{
        height: 70vh!important;
      }
      .two-category{
        margin-top: 20px;
        & h3{
          font-size: 14px;
          font-weight: 700;
          color: #212128;
          text-align: center;
          margin-bottom: 15px;
          margin-top: 15px;
        }
        .three-category{
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin-top: 6px;
          & p{
            font-size: 14px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            height: 48px;
            line-height: 48px;
            color: #212128;
            width: 47%;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 2px;
            box-sizing: content-box;
          }
          & p:nth-child(even){
            border-left: none;
            border-top: none;
          }
          & p:nth-child(odd){
            border-top: none;
          }
          & p:first-of-type{
            border-top: 1px solid rgba(0, 0, 0, 0.1)!important;
          }
          & p:nth-child(2){
            border-top: 1px solid rgba(0, 0, 0, 0.1)!important;
          }
        }
      }
    }
  }
  .category-select{
    width: 100%;
    height: 36px;
    border-radius: 5px;
    background-color: #ffffff;
    margin-bottom: 10px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    line-height: 36px;
    font-size: 14px;
    color: #F43543;
    font-weight: 700;
  }
</style>