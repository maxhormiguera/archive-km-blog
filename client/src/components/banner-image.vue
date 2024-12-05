<template>
  <div class="banner-image">
    <h1 class="accent1"><span class="--accent2">Meditab</span> Highlights</h1>
  </div>
</template>
<style lang="stylus" scoped>
.banner-image
  background $bg-banner $grey center no-repeat
  background-size cover
  cursor default
  position relative
  width-height 100% 510px
  +media-screen(false, $screen-sm)
    width-height 100% 250px
  +media-screen($screen-sm)
    max-height 40vh
  h1
    noselect()
    color $color-accent1
    font-size 3em
    margin 0
    position absolute 50% false false 50%
    text-align center
    transform translate(-50%, -50%)
    .--accent
      color $color-accent2
    +media-screen(false, $screen-sm)
      font-size 2em
      position absolute calc(50% + 50px) false false 50%
    +media-screen($screen-md)
      white-space nowrap
      font-size 5em
</style>
