<template>
  <div class="side-navigation wrapper">
    <div class="box">
      <div class="search-wrapper">
        <i class="ico-search"></i>
        <input type="text" placeholder="Search...">
      </div>
    </div>
    <div class="box">
      <h4 class="__header">Categories</h4>
      <ul v-if="getCategories" class="__list">
        <li v-for="category in getCategories" :key="category.id" :class="activeCategory == category.slug ? '--active' : ''">
          <router-link :to="{ name: 'category', params: {'categorySlug': category.slug, 'categoryName': category.name} }" class="link-category">{{ category.name }}</router-link>
        </li>
      </ul>
    </div>
    <div class="box">
      <h4 class="__header">Recent Articles</h4>
      <ul class="__list">
        <li v-for="blog in getBlogs" :key="blog.id">
          <router-link :to="{ name: 'blog', query: {'title': blog.slug} }">
            {{ blog.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { GET_CATEGORIES_QUERY } from '../graphql/categoryGraphql'
import { GET_BLOGS_QUERY } from '../graphql/blogGraphql'
export default {
  apollo: {
    getCategories: {
      query: GET_CATEGORIES_QUERY,
      variables: {
        count: 0
      }
    },
    getBlogs: {
      query: GET_BLOGS_QUERY,
      variables: {
        count: 5
      }
    }
  },
  props: {
    activeCategory: {
      type: String,
      default: '',
      required: false
    }
  }
}
</script>
<style lang="stylus" scoped>
.side-navigation
  +media-screen(false, $screen-sm)
    display none
.box
  background-color $color-base
  border 1px solid $color-border-grey
  margin-bottom 20px
  padding 10px 20px
  .__header
    border-bottom 1px solid $color-border-grey
    font-weight bold
    margin-bottom 20px
    padding 12px 0
  .__list li
    color $color-accent1
    font-weight 500
    overflow hidden
    line-height 2
    margin 0 -20px
    padding 0 20px
    text-overflow ellipsis
    white-space nowrap
    &.--active
      padding-left 16px
      border-left: 4px solid $color-accent1
.search-wrapper
  input[type=text]
    border none
    box-shadow 0 0 2px $color-border-grey
</style>
