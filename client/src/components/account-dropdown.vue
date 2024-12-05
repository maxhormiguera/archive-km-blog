<template>
  <div class="account-dropdown" @mouseleave="dropDownAutoDismiss">
    <div class="account-details">
      <div class="__details">
        <span class="__name"><span>{{ user.displayName }}</span></span>
        <span class="__email"><span>{{ user.email }}</span></span>
      </div>
      <span class="circle">
        <i class="ico ico-user"></i>
      </span>
    </div>
    <div v-if="user.role === 'Admin'" class="dropdown" :class="{'--slideopen': dropDownSlideOpen}">
      <hr>
      <a @click="openDashboardModal">
        <i class="ico ico-dashboard"></i>
        <span>Dashboard</span>
      </a>
      <router-link :to="{ name: 'medialibrary' }">
        <i class="ico ico-media"></i>
        <span>Media</span>
      </router-link>
      <a @click="logoutModal = true">
        <i class="ico ico-logout"></i>
        <span>Log out</span>
      </a>
    </div>

    <div class="btn-wrapper">
      <div v-if="user.role === 'Member'" class="btn logout" @click="logoutModal = true">
        <i class="ico ico-logout"></i>
      </div>
      <div v-if="user.role === 'Admin'" class="btn dropdown-toggle" @click="dropDownSlideOpen = !dropDownSlideOpen">
      </div>
    </div>

    <modal-template
      v-show="logoutModal"
      message="This will log you out of Meditab Highlights"
      continue-text="Log out"
      @continue="logOut"
      @close="logoutModal = false" />
    <modal-template
      v-show="dashboardModal"
      :message="dashboardModalMessage"
      @continue="toggleDashboard"
      @close="dashboardModal = false" />
  </div>
</template>
<script>
import ModalTemplate from '../components/modal-template.vue'

export default {
  components: {
    ModalTemplate
  },
  data: function () {
    return {
      dropDownSlideOpen: false,
      logoutModal: false,
      dashboardModal: false,
      dashboardModalMessage: ''
    }
  },
  computed: {
    user: function () {
      return this.$root.$data.store.state.user
    },
    dashboard: function () {
      return this.$root.$data.store.state.dashboard
    }
  },
  methods: {
    openDashboardModal () {
      this.dashboardModalMessage = this.dashboard ? 'Exit dashboard' : 'Open dashboard'
      this.dashboardModal = true
    },
    dropDownAutoDismiss () {
      setTimeout(() => this.dropDownSlideOpen = false, 200)
    },
    toggleDashboard () {
      this.$root.$data.store.setDashboard(!this.$root.$data.store.state.dashboard)
      this.dashboardModal = false
      if (this.$route.name === 'blog' || this.$route.name === 'blog-edit') {
        this.$router.push({
          name: this.$root.$data.store.state.dashboard ? 'blog-edit' : 'blog',
          query: this.$route.query
        })
      }
    },
    logOut () {
      localStorage.removeItem('internal.meditab.com::token')
      this.$root.$data.store.removeUser(null)
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
<style lang="stylus" scoped>
$size-big-icon = 40px
.account-dropdown
  position relative
  display flex
  +media-screen(false, $screen-sm)
    display none

.account-details
  position relative
  flexbox center
  border-radius 4px
  cursor pointer
  padding 0.5em 1em 0.5em 2em
  z-index 2
  &:hover
    color $color-accent1
  .__details
    flexbox flex-end false false column
    margin-right 1em
    .__name, .__email
      max-width 12em
      overflow hidden
      text-align right
      text-overflow ellipsis
      white-space nowrap
    .__name
      color $color-accent2
      font-size 1.2em
      font-weight 500
      transition color 0.2s
    .__email
      color $color-text-lightgrey
  .circle
    width-height $size-big-icon
    flexbox center center
    background-color $color-accent2
    border-radius 50%
    flex 0 0 $size-big-icon
    .ico
      background-color $color-base
// ::: .dropdown-toggle
.dropdown
  position absolute calc(100% + 15px) 0
  flexbox stretch false nowrap column
  background-color $color-base-off
  box-shadow 0 -1px 2px alpha($black, 20%)
  height auto
  max-height 0
  max-width 16em
  min-width 12em
  overflow hidden
  width 15em
  padding 0 20px
  z-index 80
  transition max-height 0.4s ease-out, padding 0.4s ease-out
  &.--slideopen
    padding 20px
    max-height 500px
    overflow visible
    a, &:after
      opacity 1
  &:before
    content ''
    display block
    width-height 100% 15px
    position absolute -15px 0
    background red
    opacity 0
    z-index 1
  &:after
    text-shadow 0 -1px 2px alpha($black, 30%)
    color $color-base-off
    content '\25B2'
    display block
    opacity 0
    position absolute -1em 2em
    transition opacity 0.2s linear 0.2s
  hr
    border none
    border-bottom 1px solid $color-border-grey
    margin 0 0 1em
  a
    flexbox center
    color $color-text-primary
    cursor pointer
    font-size 1em
    font-weight 500
    opacity 0
    padding 8px 1.5em
    transition opacity 0.2s linear 0.2s
    &:hover
      color inherit
      background-color $color-dropdown-highlight
    .ico
      margin-right 1em
      background-color $color-text-primary

.btn-wrapper
  position relative
  flexbox center center
  padding 0.5em
  &:before
    content ''
    display block
    width-height 1px 100%
    border-left 1px solid $color-border-grey
    margin 0 10px
  .btn
    width-height $size-big-icon
    .ico
      background-color $color-accent2
      width-height 20px
      display block
    &.dropdown-toggle
      flexbox center center
      &:after
        color $color-accent2
        content '\25BC'
        display block
        font-size 0.9em
        text-align center
        transition color 0.2s
    &:hover
      .ico
        background-color alpha($color-accent2, 20%)
      &.dropdown-toggle:after
        color alpha($color-accent2, 20%)
</style>
