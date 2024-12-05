<template>
  <div class="blog-view wrapper">
    <the-header />
    <div class="wrapper blog-wrapper">
      <div class="container">
        <side-navigation :active-category="getBlog ? getBlog.categories[0].slug : ''" />
        <div class="body">
          <div v-if="getBlog" class="article">
            <router-link :to="{ name: 'category', params: {'categorySlug': getBlog.categories[0].slug, 'categoryName': getBlog.categories[0].name} }" class="btn-back-category">
              <div class="__wrapper">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </router-link>
            <div class="cover-image img-wrapper">
              <img :src="getBlog.coverImage.secureUrl">
            </div>
            <h2 class="__title">{{ getBlog.title }}</h2>
            <h4 class="__category">
              <router-link
                v-for="(category, index) in getBlog.categories"
                :key="index"
                :to="{ name: 'category', params: {'categorySlug': category.slug, 'categoryName': category.name} }">
                {{ index != (getBlog.categories.length - 1) ? category.name + ', ' : category.name }}</router-link>
            </h4>
            <div class="__content">
              <blog-content :blocks="getBlog.content.blocks" />
            </div>
          </div>
          <div class="contactus-wrapper">
            <div class="contactus">
              <p>Send your comments and suggestions!</p>
              <button class="btn-accent3">Click here</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <the-footer />
  </div>
</template>
<script>
import TheHeader from '../components/the-header.vue'
import TheFooter from '../components/the-footer.vue'
import SideNavigation from '../components/side-navigation.vue'

import BlogContent from '../components/blog-content.vue'

import { GET_BLOG_QUERY } from '../graphql/blogGraphql'

export default {
  components: {
    TheHeader,
    TheFooter,
    SideNavigation,
    BlogContent
  },
  apollo: {
    getBlog: {
      query: GET_BLOG_QUERY,
      variables () {
        return {
          slug: this.$route.query.title
        }
      },
      update ({ getBlog }) {
        if (typeof getBlog.content.blocks === 'string') {
          getBlog.content.blocks = JSON.parse(getBlog.content.blocks)
        }
        console.log('::: getBlog ', getBlog)
        return getBlog
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.blog-view
  +media-screen(false, $screen-sm)
    .the-header
      display none
    .cover-image
      margin 0 -15px
      min-height 40px
    .blog-wrapper
      padding-top 0
    .contactus-wrapper
      display none

.blog-wrapper
  background-color $color-base-off
  padding 60px 0
.container
  flexbox false center
  .side-navigation
    flex 1 1 20%
    margin-right 40px
    max-width 20em
  .body
    flex 1 1 80%
    max-width $blog-article-max-width

.contactus-wrapper
  text-align center
  margin 60px auto 0
.contactus
  background-color $color-base
  border 1px solid $color-border-grey
  border-radius 4px
  flexbox center space-around false false true
  max-width 900px
  padding 40px 60px
  p
    font-weight 500
    font-size 1.4em
    margin-right 2em
  button
    padding 12px 48px

.btn-back-category
  display none
  +media-screen(false, $screen-sm)
    display block
    position absolute 0 false false -15px
  &:hover, &:focus, &:active
    .__wrapper
      background-color alpha($white, 85%)
  .__wrapper
    position relative
    width-height 40px
    background-color alpha($white, 45%)
    border-radius 0 0 50% 0
    span
      background-color $color-accent2
      display block
      height 3px
      border-radius 2px
      &:first-child
        position absolute 50% false false 50%
        transform translate(-50%, -50%)
        width 22px
      &:nth-child(2)
      &:nth-child(3)
        width 14px
      &:nth-child(2)
        transform translate(-50%, -50%) rotate(45deg)
        position absolute calc(50% + 4px) false false calc(50% - 8px)
      &:nth-child(3)
        transform translate(-50%, -50%) rotate(-45deg)
        position absolute calc(50% - 4px) false false calc(50% - 8px)
</style>
