<template>
  <div class="bar-navigation wrapper">
    <div class="container">
      <div v-if="barCategories" class="link-wrapper">
        <router-link :to="{ name: 'home' }" class="link-text">All</router-link>
        <router-link
          v-for="category in getCategories"
          :key="category.id"
          :to="{ name: 'category', params: {'categorySlug': category.slug, 'categoryName': category.name} }" class="link-text">
          {{ category.name }}</router-link>
        <router-link v-if="dashboard && userRole === 'Admin'" :to="{ name: 'category-edit' }" class="link-btn">
          <button class="btn"> <span>+</span> Create new category</button>
        </router-link>
      </div>
      <div v-if="barSearch == true" class="search-wrapper">
        <i class="ico-search"></i>
        <input type="text" :placeholder="barSearchText">
      </div>
    </div>
  </div>
</template>
<script>
import { GET_CATEGORIES_QUERY } from '../graphql/categoryGraphql'

export default {
  apollo: {
    getCategories: {
      query: GET_CATEGORIES_QUERY,
      variables: {
        count: 5
      }
    }
  },
  props: {
    barCategories: {
      type: Boolean,
      default: true,
      required: false
    },
    barSearch: {
      type: Boolean,
      default: true,
      required: false
    },
    barSearchText: {
      type: String,
      default: 'Search events or keywords',
      required: false
    }
  },
  computed: {
    userRole: function () {
      return this.$root.$data.store.state.user.role
    },
    dashboard: function () {
      return this.$root.$data.store.state.dashboard
    }
  }
}
</script>
<style lang="stylus" scoped>
.bar-navigation
  position relative 0
  background-color $color-base-off
  border-bottom 1px solid $color-border-grey
.container
  flexbox center space-between wrap
.link-wrapper
  flexbox stretch false wrap
  flex 1 1 auto
  +media-screen($screen-sm)
    height 70px
    a:not(:last-child)
      margin-right 0.25em
  .link-text
    position relative
    flexbox center
    border-bottom 1px solid transparent
    font-size: 1.2em
    font-weight bold
    padding 0 0.25em 3px
    transition border-width 0.4s, padding 0.4s, color 0.2s, border-color 0.2s
    white-space nowrap
    text-transform uppercase
    &.--active
      border-bottom 4px solid $color-accent1
      padding-bottom 0
  // ::: .link-text
  .link-btn
    align-self center
  .btn
    background-color $color-base-grey
    font-weight bold
    padding 12px 20px
    &:hover
      color $color-accent1
    span
      margin-right 0.5em
</style>
