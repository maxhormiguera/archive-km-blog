<template>
  <div class="login wrapper">
    <div class="login-box">
      <div class="banner-logo">
        <img src="img/logo.png">
      </div>
      <h1 class="title --accent1"><span class="--accent2">Meditab</span> Highlights</h1>
      <p class="blurb">Meditab Highlights is our internal news platform where you can get up-to-date news about what's happening in all Meditab places.</p>
      <h2 v-if="loginError">{{ loginError }}</h2>
      <p class="cta">Please sign in with your Corporate Gmail Account</p>
      <g-signin-button :params="googleSignInParams" @success="onSignInSuccess" @error="onSignInError">
        <button class="btn-google-signin">
          <i class="ico-google"></i>
          <span>Sign in with Google</span>
        </button>
      </g-signin-button>
      <p class="copy">&copy; 2019 Meditab. All rights reserved.</p>
    </div>
  </div>
</template>
<script>
import { GOOGLE_SIGN_IN_MUTATION } from '../graphql/userGraphql'

export default {
  data () {
    return {
      loginError: '',
      googleSignInParams: {
        client_id: '141182779843-1es72366l7dsravkeesmiol9b7sskt3p.apps.googleusercontent.com',
        // client_id: '986976098131-oeo70iq90clt4fm0on8r0puk42shq77d.apps.googleusercontent.com', // ::: live
        scope: 'openid email profile',
        response_type: 'id_token'
      }
    }
  },
  methods: {
    onSignInSuccess (googleUser) {
      const token = googleUser.getAuthResponse().id_token

      this.$apollo.mutate({
        mutation: GOOGLE_SIGN_IN_MUTATION,
        variables: {
          token
        }
      }).then(res => {
        const token = res.data.googleSignin.token
        const redirectPath = (Object.keys(this.$route.query).length === 0) ? '/' : this.$route.query.from

        localStorage.setItem('internal.meditab.com::token', token)
        this.$router.push({ path: redirectPath })
      }).catch(err => this.loginError = err.graphQLErrors[0].message)
    },
    onSignInError (error) {
      this.loginError = error
    }
  }
}
</script>
<style lang="stylus" scoped>
.login
  flexbox center center
  height 100%
  +media-screen(false, $screen-sm)
    display block
.login-box
  box-shadow 0 0 5px alpha($black, 30%)
  margin 0 auto
  padding 0 40px 40px
  text-align center
  width 500px
  +media-screen(false, $screen-sm)
    width-height 100% 100vh
    box-shadow none
.banner-logo
  width-height auto 230px
  background $bg-banner $grey center no-repeat
  background-size cover
  position relative
  margin 0 -40px
  +media-screen(false, $screen-sm)
    width-height auto 300px
  img
    width-height auto 50px
    position absolute 50% false false 50%
    transform translate(-50%, -50%)
.title
  border-bottom 1px solid $color-border-grey
  margin-bottom 20px
  padding 20px 0
.blurb
  color $color-text-grey
  font-size 1.125em
  margin-bottom 30px
.cta
  color $color-accent2
  font-weight 500
  margin-bottom 10px
.btn-google-signin
  background-color $color-base-off
  border none
  border-radius 4px
  cursor pointer
  flexbox stretch
  margin 0 auto 40px
  overflow hidden
  padding 0
  width auto
  &:hover
    box-shadow 0 0 6px alpha($color-accent2, 50%)
  .ico-google
    background $ico-google center no-repeat
    background-size 35px
    flex 0 0 65px
    width 65px
  span
    background-color $color-accent2
    color $color-text-white
    font-size 1.25em
    font-weight 500
    flex 1 1 auto
    padding 20px 40px
    white-space nowrap
// ::: .btn-google-signin
.copy
  font-size smaller
  font-weight bold
</style>
