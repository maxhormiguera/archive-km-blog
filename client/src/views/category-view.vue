<template>
  <div class="wrapper">
    <the-header />
    <banner-image />
    <bar-navigation />
    <div class="container">
      <div class="content-header">
        <h2>{{ categoryName.toUpperCase() }}</h2>
        <i :class="[itemsLayout == 'list' ? '--active' : '', 'ico', 'ico-list']" @click="itemsLayout = 'list'"></i>
        <i :class="[itemsLayout == 'grid' ? '--active' : '', 'ico', 'ico-grid']" @click="itemsLayout = 'grid'"></i>
      </div>
      <div :class="[itemsLayout == 'grid' ? '--grid' : '--list', 'articles']">
        <add-new v-if="dashboard" text="Create new post" @click.native="showModal = true" />
        <div v-for="blog in blogs" :key="blog.id" class="article-preview">
          <router-link :to="{ name: 'blog', query: {'title': blog.slug} }" class="img-wrapper __thumb">
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
      </div>
      <paginate
        v-model="page"
        :page-count="pages"
        :click-handler="getBlogs"
        :page-range="pagerange"
        container-class="pagination"
        :margin-pages="0"
        :first-last-button="true"
        page-class="__page"
        prev-class="__page"
        next-class="__page"
        disabled-class="--disabled"
        active-class="--current" />
    </div>
    <the-footer />
    <modal-template
      v-show="showModal"
      title="Create New Post"
      alignment="left"
      :props="{'categorySlug': categorySlug, 'categoryName': categoryName}"
      continue-text="SAVE"
      @continue="savePost(blogTitle, categoryName, categorySlug, blogDate)"
      @close="showModal = false">
      <div slot="body" class="create-new-post">
        <div class="row">
          <div>
            <h4>Title</h4>
            <textarea v-model="blogTitle"></textarea>
          </div>
        </div>
        <div class="row">
          <div>
            <h4>Category</h4>
            <input type="text" :value="categoryName" disabled>
          </div>
          <div>
            <h4>Date</h4>
            <input v-model="blogDate" type="date">
          </div>
        </div>
        <div class="row">
          <div>
            <h4>Choose Template</h4>
            <div class="template-row">
              <div class="template"></div>
              <div class="template"></div>
              <div class="template"></div>
            </div>
          </div>
        </div>
      </div>
    </modal-template>
  </div>
</template>

<script>
import moment from 'moment'
import TheHeader from '../components/the-header.vue'
import TheFooter from '../components/the-footer.vue'
import BannerImage from '../components/banner-image.vue'
import BarNavigation from '../components/bar-navigation.vue'
import ModalTemplate from '../components/modal-template.vue'
import AddNew from '../components/add-new.vue'
import Paginate from 'vuejs-paginate'

import { CREATE_BLOG_MUTATION } from '../graphql/blogGraphql'
import { GET_CATEGORY_QUERY, GET_CATEGORIES_QUERY } from '../graphql/categoryGraphql'

export default {
  components: {
    TheHeader,
    TheFooter,
    BannerImage,
    BarNavigation,
    ModalTemplate,
    AddNew,
    Paginate
  },
  apollo: {
    getCategory: {
      query: GET_CATEGORY_QUERY,
      variables () {
        return {
          slug: this.categorySlug
        }
      },
      result ({ data }) {
        this.getBlogs(data.getCategory)
      }
    },
    getCategories: {
      query: GET_CATEGORIES_QUERY,
      variables: {
        count: 0
      }
    }
  },
  props: {
    categorySlug: {
      type: String,
      default: 'not found',
      required: false
    }
  },
  data: function () {
    return {
      itemsLayout: 'grid',
      showModal: false,
      blogTitle: '',
      blogDate: '',
      page: 1,
      perpage: 6,
      pagerange: 5,
      blogs: []
    }
  },
  computed: {
    dashboard: function () {
      return this.$root.$data.store.state.dashboard
    },
    routeTo: function () {
      return this.$root.$data.store.state.dashboard ? 'blog-edit' : 'blog'
    },
    categoryName: function () {
      if (this.getCategories) {
        return this.getCategories.filter(o => {
          if (o.slug === this.categorySlug) {
            return true
          }
        })[0].name
      } else {
        return ''
      }
    },
    pages: function () {
      return this.getCategory ? Math.ceil(this.getCategory.length / this.perpage) : 1
    }
  },
  methods: {
    savePost: function (title, categoryName, categorySlug, date) {
      const vm = this
      this.$apollo.mutate({
        mutation: CREATE_BLOG_MUTATION,
        variables: {
          title,
          categories: JSON.stringify([{
            name: categoryName,
            slug: categorySlug
          }])
        },
        update (cache, result) {
          const data = cache.readQuery({
            query: GET_CATEGORY_QUERY,
            variables: {
              slug: categorySlug
            }
          })
          data.getCategory = [result.data.createBlog, ...data.getCategory]
          cache.writeQuery({ query: GET_CATEGORY_QUERY, data })

          vm.$router.push({ name: 'blog-edit', query: { title: result.data.createBlog.slug } })
        }
      })
    },
    getTimestamp: function (date) {
      return moment.unix(date / 1000).format('ll')
    },
    getBlogs: function (category) {
      const start = (this.page - 1) * this.perpage
      const end = start + this.perpage
      const categoryblogs = this.getCategory ? this.getCategory : category
      this.blogs = categoryblogs.slice(start, end)
      document.querySelector('.bar-navigation').scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>
<style lang="stylus" scoped>
.bar-navigation
  +media-screen(false, $screen-sm)
    display none
.articles
  padding 30px 0
  &.--grid
    display grid
    grid-gap 20px 15px
    +media-screen(false, $screen-sm)
      grid-template-columns 1fr
    +media-screen($screen-sm, $screen-md)
      grid-template-columns repeat(2, 1fr)
    +media-screen($screen-md)
      grid-template-columns repeat(3, 1fr)
    .__thumb
      height 225px
  &.--list
    flexbox false false false column
    .add-new
      margin-bottom 1.25rem
    .article-preview
      background-color $color-base-off
      flex-direction row
      margin-bottom 1.25rem
      padding 10px
      position relative
      .__thumb
        width 300px
        margin 0 30px 0 0
        +media-screen(false, $screen-sm)
          position absolute 0 0 0 0
          opacity 0.25
          filter grayscale(0.4)
          min-width 100%
        img
          width-height 100%
          object-fit cover
      .__caption
        flex 1
        z-index 1
// ::: .articles

.create-new-post
  h4
    margin-bottom 0.5rem
  .row
    flexbox center space-between
    margin-bottom 0.875rem
    &>div
      flex 1 1 auto
      &:not(:last-child)
        margin-right 10px
    input, textarea
      width 100%
  .template-row
    flexbox center center
    .template
      width-height 130px 150px
      background-color alpha($color-accent2, 35%)
      &:not(:last-child)
        margin-right 10px
</style>
