<template>
  <header id="the-header" class="the-header wrapper --transparent">
    <div class="container">
      <router-link :to="{ name: 'home', params: {} }"><img src="img/logo.png"></router-link>
      <account-dropdown v-if="this.$root.$data.store.state.user.role" />
      <burger-navigation />
    </div>
    <div class="container">
      <div class="search-wrapper">
        <i class="ico-search"></i>
        <input type="text" placeholder="Search events or keywords">
      </div>
    </div>
  </header>
</template>
<script>
import AccountDropdown from '../components/account-dropdown.vue'
import BurgerNavigation from '../components/burger-navigation.vue'
export default {
  components: {
    AccountDropdown,
    BurgerNavigation
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll (e) {
      const header = document.getElementById('the-header')
      if (window.scrollY < 250) {
        header.classList.add('--transparent')
      } else if (header.classList.contains('--transparent')) {
        header.classList.remove('--transparent')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
header
  position relative
  background-color $color-base
  padding 20px 0
  .container
    flexbox center space-between
  +media-screen(false, $screen-sm)
    background-color $color-base
    position fixed 0 0
    z-index 99
    &.--transparent
      background-color transparent
.search-wrapper, .burger-navigation
  display none
  +media-screen(false, $screen-sm)
    display block
.search-wrapper
  margin 15px auto -10px
  min-width 280px
  width 70%
  input
    background-color transparent
    &::placeholder
      color $color-text-lightgrey
    +media-screen(false, $screen-sm)
      font-size 0.875em
img
  margin -5px 0
  width-height auto 50px
  +media-screen(false, $screen-sm)
    width-height auto 36px
</style>
