<template>
  <div class="books_list">
    <flexbox>
      <flexbox-item><div class="title">{{ title }}</div></flexbox-item>
      <flexbox-item><slot></slot></flexbox-item>
    </flexbox>
    <flexbox :gutter="0" wrap="wrap" v-if="list.length">
      <flexbox-item :span="1/3" v-for="item in list" :key="item.BookCode">
        <dl class="book_item" @click="$router.push({name: 'BookInfo', params: {id: item.BookCode}})">
          <dt>
            <img v-lazy="item.BookImg ? item.BookImg : '../../static/no-book.png'" :alt="item.BookName">
          </dt>
          <dd class="book_name">{{ item.BookName }}</dd>
          <dd class="book_author">{{ item.BookAuthor }}</dd>
        </dl>
      </flexbox-item>
    </flexbox>
    <flexbox v-else class="no_data">
      <flexbox-item>暂无数据</flexbox-item>
    </flexbox>
  </div>
</template>

<script>
export default {
  name: "Books",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    list: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scope lang="scss">
@import "../common/css/mixin/_text_overflow";

.books_list {
  .title {
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 600;
    text-align: justify;
    margin: 10px 0;
    color: #333333;
  }
  .slot_more {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    text-align: right;
    color: #6dbfee;
  }
  .book_item {
    width: 88px;
    margin: 10px auto;
    dt {
      text-align: center;
      img {
        width: 88px;
        height: 122px;
        border-radius: 5px;
        background-color: #d8d8d8;
        box-shadow: 0 2px 7px 0 rgba(75, 101, 124, 0.2);
      }
    }
    .book_name {
      color: #333333;
    }
    .book_author {
      color: #cccccc;
    }
    .book_name,
    .book_author {
      position: relative;
      width: 100%;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      text-align: justify;
      white-space: nowrap;
      overflow: hidden;
      &:after {
        content: "";
        position: absolute;
        right: 0;
        width: 16px;
        height: 16px;
        color: #606060;
        background: -webkit-linear-gradient(
          right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        );
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        );
      }
    }
  }
  .no_data {
    text-align: center;
    color: #dbdbdb;
  }
}
</style>

