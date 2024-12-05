<template>
  <div class="burger-navigation wrapper">
    <div class="burger-toggle" @click="openBurgerNavigation = true">
      <div class="__wrapper">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <transition name="modal">
      <div v-show="openBurgerNavigation == true" class="link-wrapper">
        <div class="btn-close-burger" @click="openBurgerNavigation = false">
          <div class="__wrapper">
            <span></span>
            <span></span>
          </div>
        </div>
        <p class="link-header link-text">MEDITAB HIGHLIGHTS</p>
        <hr>
        <router-link
          :to="{ name: 'home' }"
          class="link-text"
          @click.native="openBurgerNavigation = false">
          All</router-link>
        <router-link
          v-for="category in getCategories"
          :key="category.id"
          :to="{ name: 'category', params: {'categorySlug': category.slug, 'categoryName': category.name} }"
          class="link-text"
          @click.native="openBurgerNavigation = false">
          {{ category.name }}</router-link>
        <router-link
          v-if="dashboard && userRole === 'Admin'"
          :to="{ name: 'category-edit' }"
          class="link-btn"
          @click.native="openBurgerNavigation = false">
          <button class="btn"><span>+</span> Create new category</button>
        </router-link>
        <hr>
        <a class="link-logout link-text" @click="logoutModal = true; openBurgerNavigation = false">LOG OUT</a>
      </div>
    </transition>
    <modal-template
      v-show="logoutModal"
      message="This will log you out of Meditab Highlights"
      continue-text="Log out"
      @continue="logOut"
      @close="logoutModal = false" />
  </div>
</template>
<script>
import { GET_CATEGORIES_QUERY } from '../graphql/categoryGraphql'
import ModalTemplate from '../components/modal-template.vue'

export default {
  components: {
    ModalTemplate
  },
  apollo: {
    getCategories: {
      query: GET_CATEGORIES_QUERY,
      variables: {
        count: 5
      }
    }
  },
  data: function () {
    return {
      openBurgerNavigation: false,
      logoutModal: false
    }
  },
  computed: {
    userRole: function () {
      return this.$root.$data.store.state.user.role
    },
    dashboard: function () {
      return this.$root.$data.store.state.dashboard
    }
  },
  methods: {
    logOut () {
      localStorage.removeItem('internal.meditab.com::token')
      this.$root.$data.store.removeUser(null)
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style lang="stylus" scoped>
.burger-navigation
  flex 0
  z-index 3
  +media-screen($screen-sm)
    display none
.burger-toggle
  .__wrapper
    border-radius 4px
    position relative
    width-height 2em
  span
    position absolute 50% false false 50%
    transform translate(-50%, -50%)
    width-height 100% 2px
    background-color $color-accent2
    border-radius 2px
    display block
    &:first-child
      margin-top -8px
    &:last-child
      margin-top 8px

.link-wrapper
  flexbox stretch false wrap
  flex 1 1 auto
  +media-screen(false, $screen-sm)
    flexbox center center false column
    background-color alpha($color-accent2, 85%)
    padding 0 40px
    position fixed 0 0 0 0
    z-index 3
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
    +media-screen(false, $screen-sm)
      color $color-base
      display block
      font-size 1.75em
      font-weight 500
      line-height 1.875em
      margin 0 auto
      padding 0
      text-align left
      width 100%
      min-width 240px
      &.--active
        border none
  // ::: .link-text
  .link-header, .link-logout, hr
    display none
    +media-screen(false, $screen-sm)
      display block
  .link-header
    font-weight bold
  hr
    border 1px solid $color-base-off
    margin 10px 0 20px
    width 100%
    min-width 240px
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
  .btn-close-burger
    display none
    +media-screen(false, $screen-sm)
      display block
      position absolute 20px 40px
    &:focus, &:active, &:hover
      .__wrapper
        background-color alpha($white, 15%)
    .__wrapper
      border-radius 4px
      position relative
      width-height 2em
    span
      position absolute 50% false false 50%
      width-height 100% 2px
      background-color $color-base-off
      border-radius 2px
      display block
      &:first-child
        transform translate(-50%, -50%) rotate(45deg)
      &:nth-child(2)
        transform translate(-50%, -50%) rotate(-45deg)
</style>
