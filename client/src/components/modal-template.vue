<template>
  <transition name="modal">
    <div class="modal-template">
      <div class="modal-underlay">
        <div class="modal-wrapper">
          <div class="modal-container" :style="{ textAlign: alignment }">
            <div v-if="title" class="__header">
              <slot name="header">
                <h3>{{ title }}</h3>
              </slot>
            </div>
            <div class="__body">
              <slot name="body">
                <p>{{ message }}</p>
              </slot>
            </div>
            <div v-if="!noFooter" class="__footer">
              <slot name="footer">
                <button class="btn-accent2" @click="$emit('continue')">{{ loading ? 'Loading...' : continueText }}</button>
                <button class="btn-ghost2" @click="$emit('close')">{{ cancelText }}</button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '',
      required: false
    },
    message: {
      type: String,
      default: 'Do you want to continue?',
      required: false
    },
    continueText: {
      type: String,
      default: 'Continue',
      required: false
    },
    cancelText: {
      type: String,
      default: 'Cancel',
      required: false
    },
    alignment: {
      type: String,
      default: 'center',
      required: false
    },
    noFooter: {
      type: Boolean,
      default: false,
      required: false
    },
    noCallback: {
      type: Boolean,
      default: false,
      required: false
    },
    props: {
      type: Object,
      default: null,
      required: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.modal-template
  z-index: 9900
  position fixed 0 0 0 0
.modal-underlay
  width-height 100%
  background-color alpha($black, 50%)
.modal-wrapper
  flexbox center center
  width-height 100%
.modal-container
  position relative
  background-color $color-base-off
  display inline-block
  margin auto
  padding 30px
  text-align center
  +media-screen(false, $screen-sm)
    margin 0 30px
  .__header
    border-bottom 1px solid $color-border-grey
    margin-bottom 30px
    padding 0 0 20px
    h3
      color $color-accent2
      font-size 2em
  .__body
    padding 0 20px
    p:only-child
      color $color-accent2
      font-size 1.2em
      font-weight 500
    &:not(:last-child)
      margin-bottom 30px
  .__footer
    flexbox stretch center false column
    button
      margin auto
      max-width 250px
      width 100%
      &:not(:last-child)
        margin-bottom 10px

// ::: .modal-container
.modal-enter-active, .modal-leave-active
  transition opacity 0.4s, margin-top 0.2s
.modal-enter, .modal-leave-to
  opacity 0
  margin-top -20px
.modal-enter-to, .modal-leave
  opacity 1
  margin-top 0
</style>
