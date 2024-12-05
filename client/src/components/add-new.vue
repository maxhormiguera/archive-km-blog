<template>
  <div class="add-new">
    <div class="center">
      <span class="circle">
        <i class="ico ico-add"></i>
      </span>
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Add new',
      required: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.add-new
  background-color $color-base-off
  color $color-text-grey
  font-size 1.2em
  font-weight 500
  min-height 200px
  position relative
  text-align center
  white-space nowrap
  &:hover
    border-color alpha($color-accent1, 30%)
    box-shadow 0 0 4px alpha($color-accent1, 70%)
  &:before
    background-image none
  .center
    flexbox center center false column
    position absolute 50% 50%
    transform translate(50%, -50%)
    transition color 0.2s
    cursor pointer
    .circle
      flexbox center center
      width-height 4em
      border 1px solid $grey
      border-radius 50%
      margin-bottom 20px
      .ico
        width-height 2.25em
        background-color $color-border-grey
// ::: .--add
</style>
