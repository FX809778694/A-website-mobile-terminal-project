<template>
  <div ref="wrapper" class="scroll_wrapper">
    <div>
      <slot></slot>
      <slot name="pullup"
        :pullUpLoad="pullUpLoad"
        :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{ pullUpTxt }}</span>
          </div>
          <div class="after-trigger" v-else>
            <load-more></load-more>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { getRect } from "../common/js/util";
import LoadMore from "@/components/LoadMore";

export default {
  name: "ScrollBetter",
  data() {
    return {
      pullUpDirty: true,
      isPullUpLoad: false,
      isPullingDown: false
    };
  },
  components: {
    LoadMore
  },
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    // 是否派发滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 是否派发滚动结束
    listenScrollEnd: {
      type: Boolean,
      default: false
    },
    bookList: {
      type: Array,
      default: null
    },
    pullUpLoad: {
      type: null,
      default: false
    },
    pullDownRefresh: {
      type: Boolean,
      default: false
    },
    // 当数据更新后，刷新 scroll 的延时
    refreshDelay: {
      type: Number,
      default: 30
    },
    bounce: {
      top: false,
      right: false,
      bottom: false,
      left: false
    }
  },
  watch: {
    bookList() {
      setTimeout(() => {
        this.forceUpdate(true);
      }, this.refreshDelay);
    },
    pullUpLoad: {
      handler(val) {
        if (val) {
          this.bindPullUp();
        } else {
          this.untiePullUp();
        }
      }
    }
  },
  computed: {
    pullUpTxt() {
      const moreTxt =
        this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.more;
      const noMoreTxt =
        this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore;

      return this.pullUpDirty ? moreTxt : noMoreTxt;
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) return;

      if (this.$refs.wrapper && (this.pullDownRefresh || this.pullUpLoad)) {
        this.$refs.wrapper.querySelector(
          ".list_wrapper"
        ).style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`;
      }

      let options = {
        probeType: this.probeType,
        click: this.click,
        bounce: this.bounce
      };

      // 初始化 better-scroll
      this.scroll = new BScroll(this.$refs.wrapper, options);

      // 是否派发滚动开始事件
      if (this.listenBeforeScroll) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScrollStart");
        });
        this.scroll.on("scrollStart", () => {
          this.$emit("scroll-start");
        });
      }

      // 是否派发滚动事件
      if (this.listenScroll) {
        this.scroll.on("scroll", pos => {
          this.$emit("scroll", pos);
        });
      }

      // 是否派发滚动结束事件
      if (this.listenScrollEnd) {
        this.scroll.on("scrollEnd", pos => {
          this.$emit("scroll-end", pos);
        });
      }

      // 是否启用上拉加载
      if (this.pullUpLoad) {
        this.scroll.on("scrollEnd", () => {
          // 滚动到底部
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.isPullUpLoad = true;
            this.$emit("pullingUp");
          }
        });
      }

      // 是否启用下拉
      if (this.pullDownRefresh) {
        this.scroll.on("beforeScrollStart", () => {
          this.$emit("beforeScroll");
        });
      }
    },
    bindPullUp() {
      this.scroll.on("pullingUp", () => {
        this.isPullUpLoad = true;
        this.$emit("pullingUp");
      });
    },
    untiePullUp() {
      this.scroll.off("pullingUp");
    },
    disable() {
      // 代理 better-scroll 的 disable 方法
      this.scroll && this.scroll.disable();
    },
    enable() {
      // 代理 better-scroll 的 enable 方法
      this.scroll && this.scroll.enable();
    },
    refresh() {
      // 代理 better-scroll 的 refresh 方法
      this.scroll && this.scroll.refresh();
    },
    forceUpdate(dirty) {
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false;
        this._reboundPullDown().then(() => {
          this._afterPullDown();
        });
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false;
        this.scroll.finishPullUp();
        this.pullUpDirty = dirty;
        this.refresh();
      } else {
        this.refresh();
      }
    },
    scrollTo() {
      // 代理 better-scroll 的 scrollTo 方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      // 代理 better-scroll 的 scrollToElement 方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  }
};
</script>

<style scope lang="scss">
.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
  .before-trigger {
    text-align: center;
    font-size: 12px;
  }
}
</style>

