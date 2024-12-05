<template>
  <div class="wrapper">
    <the-header />
    <banner-image />
    <bar-navigation bar-search="false" />
    <div class="container">
      <div class="content-header">
        <h3>Categories</h3>
        <div class="search-wrapper">
          <i class="ico-search"></i>
          <input type="text" placeholder="Search categories">
        </div>
      </div>
      <div class="category-manage-wrapper">
        <div class="category-add">
          <h4>Add New Category</h4>
          <p>Name</p>
          <input v-model="name" type="text">
          <p>Description</p>
          <textarea v-model="description"></textarea>
          <button class="btn-accent2" @click="addNewCategory">Add New Category</button>
        </div>
        <div class="category-manage">
          <div class="__head">Name</div>
          <div class="__head">Description</div>
          <div class="__head">Edit</div>
          <div class="__head">Delete</div>

          <template v-for="category in categories">
            <div :key="category[0]" class="__name">{{ category.name }}</div>
            <div :key="category[1]" class="__description">{{ category.description === '' ? '-' : category.description }}</div>
            <div :key="category[2]" class="__btn"><i class="ico-edit"></i></div>
            <div :key="category[3]" class="__btn" @click="onDelete(category.name)"><i class="ico-delete"></i></div>
          </template>
        </div>
      </div>
    </div>
    <the-footer />
  </div>
</template>
<script>
import TheHeader from '../components/the-header.vue'
import TheFooter from '../components/the-footer.vue'
import BannerImage from '../components/banner-image.vue'
import BarNavigation from '../components/bar-navigation.vue'
import { GET_CATEGORIES_QUERY, CREATE_CATEGORY_MUTATION, DELETE_CATEGORY_MUTATION } from '../graphql/categoryGraphql'

export default {
  components: {
    TheHeader,
    TheFooter,
    BannerImage,
    BarNavigation
  },
  apollo: {
    getCategories: {
      query: GET_CATEGORIES_QUERY,
      variables: {
        count: 0
      },
      update (result) {
        this.categories = result.getCategories
      }
    }
  },
  data: function () {
    return {
      name: '',
      description: '',
      categories: null
    }
  },
  methods: {
    addNewCategory () {
      this.$apollo.mutate({
        mutation: CREATE_CATEGORY_MUTATION,
        variables: {
          name: this.name,
          description: this.description
        },
        update (cache, result) {
          const data = cache.readQuery({
            query: GET_CATEGORIES_QUERY,
            variables: {
              count: 0
            }
          })
          data.getCategories = [result.data.createCategory, ...data.getCategories]
          cache.writeQuery({ query: GET_CATEGORIES_QUERY, data })
        }
      }).then(res => {
        this.categories.unshift(res.data.createCategory)
      })
    },
    onDelete (name) {
      this.$apollo.mutate({
        mutation: DELETE_CATEGORY_MUTATION,
        variables: {
          name
        },
        update (cache, result) {
          const data = cache.readQuery({
            query: GET_CATEGORIES_QUERY,
            variables: {
              count: 0
            }
          })
          data.getCategories = data.getCategories.filter(category => category.name !== name)
          cache.writeQuery({ query: GET_CATEGORIES_QUERY, data })
        }
      }).then(res => {
        this.categories = this.categories.filter(category => category.name !== name)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.content-header
  color $color-accent2
  padding 30px 0 20px
.category-manage-wrapper
  flexbox flex-start space-between
  padding 30px 0 60px
.category-add
  flex 1 1 25%
  flexbox false false false column
  h4
    font-size 1.2em
    margin 8px 0 30px
  p, input[type="text"]
    margin-bottom 10px
  input[type=text], textarea
    background-color $color-base-off
    border-radius 2px
    width 100%
    &:focus
      background-color $color-base
  textarea
    margin-bottom 30px
.category-manage
  border 1px solid $color-border-grey
  flex 1 1 75%
  margin-left 3em
  display grid
  grid-template-columns 12em auto repeat(2, 8em)
  grid-template-rows auto
  grid-auto-rows calc(4em + 16px)
  &>div
    flexbox center flex-start
    overflow hidden
    padding 8px 12px
    width 100%
  &>div:nth-last-child(n+5)
    border-bottom 1px solid $color-border-grey
  .__head
    background-color $color-base-off
    font-weight 500
  .__name
    color $color-accent2
    font-weight bold
  .ico-edit, .ico-delete
    background-color $color-text-primary
    cursor pointer
    transition background-color 0.2s
    width-height 25px
    &:hover
      background-color $color-accent1
</style>
