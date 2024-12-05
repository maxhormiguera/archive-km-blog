<template>
  <div class="wrapper">
    <the-header />
    <banner-image />
    <bar-navigation />
    <div class="container">
      <div class="content-header">
        <h2 :class="{'--active': articleHighlightView}" @click="articleHighlightView = true">LATEST ARTICLES</h2>
        <h2 :class="{'--active': !articleHighlightView}" @click="articleHighlightView = false">TOP ARTICLES</h2>
      </div>
      <div class="articles"><!-- ::: article highlights -->
        <div v-for="blog in getBlogs" :key="blog.id" class="article-preview">
          <router-link :to="{ name: routeTo, query: {'title': blog.slug} }" class="img-wrapper __thumb">
            <img :src="blog.thumbnail.secureUrl" alt="Image not found">
          </router-link>
          <div class="__caption">
            <router-link :to="{ name: routeTo, query: {'title': blog.slug} }">
              <h3 class="__title">{{ blog.title }}</h3>
            </router-link>
            <!-- <h4 class="__date">{{ getTimestamp(blog.createdAt) }}</h4> -->
            <p class="__text">{{ blog.description }}</p>
            <router-link :to="{ name: routeTo, query: {'title': blog.slug} }" class="__readmore btn-accent1">Read more</router-link>
          </div>
        </div>
      </div><!-- ::: article highlights -->
    </div>

    <div class="suggest-topic banner"><!-- ::: suggest-topic -->
      <div class="container ">
        <div class="__center-text">
          <p>Let us know if you have comments and suggestions.</p>
          <a href="https://forms.gle/VFXLEGpfRDeB7MDe6" target="_blank">
            <button class="btn-suggest-topic">CLICK TO SUGGEST A TOPIC</button>
          </a>
          <p>We’re committed to continuously improving your reading experience!</p>
        </div>
      </div>
    </div><!-- ::: suggest-topic -->
    <the-footer />
  </div>
</template>
<script>
import moment from 'moment'
import TheHeader from '../components/the-header.vue'
import TheFooter from '../components/the-footer.vue'
import BannerImage from '../components/banner-image.vue'
import BarNavigation from '../components/bar-navigation.vue'

import { GET_BLOGS_QUERY } from '../graphql/blogGraphql'

export default {
  components: {
    TheHeader,
    TheFooter,
    BannerImage,
    BarNavigation
  },
  apollo: {
    getBlogs: {
      query: GET_BLOGS_QUERY,
      variables: {
        count: 6
      }
    }
  },
  data: function () {
    return {
      articleHighlightView: true
    }
  },
  computed: {
    routeTo: function () {
      return this.$root.$data.store.state.dashboard ? 'blog-edit' : 'blog'
    }
  },
  methods: {
    getTimestamp: function (date) {
      return moment.unix(date / 1000).format('ll')
    }
  }
}
</script>
<style lang="stylus" scoped>
.bar-navigation
  +media-screen(false, $screen-sm)
    display none
.content-header
  justify-content center
  h2
    cursor pointer
    flex 0 1 auto
    transition color 0.2s
    &:hover
      color lightness($color-accent1, 70%)
    &.--active
      color $color-accent1
      font-weight bold
    &:first-child
      margin-right 0.5em
    &:last-child
      margin-left 0.5em
.articles
  padding 40px 0 70px
  display grid
  grid-gap 20px 15px
  +media-screen($screen-sm)
    grid-template-columns repeat(3, 1fr)
    grid-auto-rows min-content
    grid-template-areas "main main side" "main main side"
  .article-preview
    +media-screen($screen-sm)
      &:first-child
        grid-area main
        .__thumb
          min-height 450px
          position relative
          img
            position absolute 0 0 0 0
        .__caption .__readmore
          margin 0
      &:not(:first-child)
        .__thumb
          height 225px
        .__text, .__readmore
          display none

// ::: .articles

.suggest-topic
  background $bg-suggest-topic $color-accent1 center no-repeat
  background-size cover
  height 450px
  p
    font-size 1.125em
    +media-screen(false, $screen-sm)
      font-size 1.245em
  .btn-suggest-topic
    background alpha($white, 25%)
    border 1px solid $white
    color $white
    font-size 1.5em
    font-weight 500
    margin 1em auto
    padding 3rem 2rem
    +media-screen(false, $screen-sm)
      border-radius 3rem
      font-size 1em
      padding 1rem
      white-space nowrap
    +media-screen($screen-md)
      padding 40px 3em
    &:hover, &:focus, &:active
      color $white

// ::: .suggest-topic

.img-category
  width-height 50px

.banner
  position relative
  .__center-text
    position absolute 50% false false 50%
    transform translate(-50%, -50%)
    color $white
    font-size 1.3em
    font-weight 500
    text-align center
</style>
