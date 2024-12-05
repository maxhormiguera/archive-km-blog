<template>
  <footer class="the-footer wrapper">
    <div class="container">
      <div class="column">
        <h2 class="--accent1"><span class="--accent2">Meditab</span> Highlights</h2>
        <p>Meditab Highlights is our internal news platform where you can get up-to-date news in what's happening in all Meditab offices</p>
        <p><strong>&copy; 2019 Meditab. All rights reserved.</strong></p>
      </div>
      <div class="column">
        <h2>Categories</h2>
        <ul>
          <li><router-link :to="{ name: 'home', params: {} }">All</router-link></li>
          <li v-for="category in getCategories" :key="category.id">
            <router-link :to="{ name: 'category', params: {'categorySlug': category.slug, 'categoryName': category.name} }">{{ category.name }}</router-link>
          </li>
        </ul>
      </div>
      <div class="column">
        <h2>Email Us:</h2>
        <p>Email us if you have any comments or suggestions</p>
        <a href="mailto:kmteam@meditab.com">kmteam@meditab.com</a>
      </div>
    </div>
  </footer>
</template>
<script>
import { GET_CATEGORIES_QUERY } from '../graphql/categoryGraphql'

export default {
  apollo: {
    getCategories: {
      query: GET_CATEGORIES_QUERY,
      variables: {
        count: 0
      },
      update (data) {
        return data.getCategories
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.the-footer
  background-color $color-footer-bg
  color $color-text-white
  padding 70px 0 70px
  .container
    display flex
    +media-screen(false, $screen-sm)
      flex-direction column
      .column
        margin-bottom 2em
        padding 0 1em
        text-align center
      h2
        margin 0 0 0.5em
    +media-screen($screen-sm, $screen-md)
      flex-wrap wrap
      .column:not(:first-child)
        flex 1 1 50%
      .column(:nth-child(2))
        padding-right 2em
      .column:first-child
        flex 1 1 100%
        padding-right: 10%
    +media-screen($screen-md)
      .column:not(:first-child)
        flex 1 1 25%
      .column:not(:last-child)
        padding-right 2em
      .column:first-child
        flex 1 1 50%
        padding-right: 10%
  // ::: .container
  h2
    font-size 2em
    font-weight 500
    margin 0 0 1em
  p, a
    font-size: 1.2em
    line-height 1.5
    margin 0 0 1em
  a
    color $color-accent1
    &:hover
      color lightness($color-accent1, 70%)
  strong
    font-weight 500
</style>
