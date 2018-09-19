<!--
 Created by Thomas on 2018/8/6.
 返回顶部组件
 -->
<template>
  <div class="back-top" v-show="backTopShow">
    <img src="../assets/oval.png" @click="backTop()" />
  </div>
</template>
<script>

export default {
  name: "BackTop",
  data() {
    return {
      backTopShow: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    backTop() {
      let back = setInterval(() => {
        if(document.body.scrollTop || document.documentElement.scrollTop) {
          document.body.scrollTop -= 100;
          document.documentElement.scrollTop -= 100;
        } else {
          clearInterval(back)
        }
      });
    },
    handleScroll(){
      if(document.documentElement.scrollTop + document.body.scrollTop > 100) {
        this.backTopShow = true;
      } else {
        this.backTopShow = false;
      }
    }
  }
}
</script>
<style scope lang="scss">

.back-top{
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 8%;
  right: 2%;
  & img{
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>