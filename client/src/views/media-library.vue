<template>
  <div class="wrapper">
    <the-header />
    <banner-image />
    <bar-navigation bar-categories="false" bar-search-text="Search media items..." />
    <div class="container">
      <div class="content-header">
        <h2>MEDIA LIBRARY</h2>
        <a title="Select media items">Select</a>
        <a title="Select all media items">Select All</a>
      </div>
      <div class="media-items">
        <add-new text="Add new media" @click.native="showModal = true" />
        <div v-for="media in getAllMedia" :key="media.id" class="media-item img-wrapper">
          <img :src="media.secureUrl">
        </div>
        <div class="media-item img-wrapper">
          <img src="https://placebear.com/200/200">
        </div>
      </div>
    </div>
    <the-footer />
    <modal-template v-show="showModal" title="Attachment Details" :no-footer="true" alignment="left">
      <div slot="body" class="media-details">
        <div class="__file-details">
          <p>File name: Bearrrrs!</p>
          <p>File type: image/jpg</p>
          <p>File size: 123mb</p>
          <p>Dimensions: 432 by 809 pixels</p>
          <p>Uploaded on: Nov 32, 2039</p>
        </div>
        <div class="__copy-link">
          <h3>Copy Link</h3>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. </p>
        </div>
        <div class="__preview">
          <input ref="fileInput" accept="image/*" style="display: none" type="file"
            @change="onUpload">
          <button class="btn btn-accent2" @click="$refs.fileInput.click()">
            Upload file
          </button>
        </div>
        <div class="__info">
          <p>Title</p>
          <input type="text" value="Lorem ipsum dolor">
          <p>Caption</p>
          <textarea rows="2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque maiores, tempora consectetur repudiandae amet neque?</textarea>
          <p>Description</p>
          <textarea rows="2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque maiores, tempora consectetur repudiandae amet neque?</textarea>
          <div class="btn-row">
            <button class="btn-accent2" @click="onSave">SAVE</button>
            <button class="btn-ghost2">Delete</button>
            <button class="btn-accent2" @click="showModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </modal-template>
  </div>
</template>

<script>
import TheHeader from '../components/the-header.vue'
import TheFooter from '../components/the-footer.vue'
import BannerImage from '../components/banner-image.vue'
import BarNavigation from '../components/bar-navigation.vue'
import ModalTemplate from '../components/modal-template.vue'
import AddNew from '../components/add-new.vue'
import { GET_ALL_MEDIA_QUERY, SINGLE_UPLOAD_MUTATION } from '../graphql/mediaGraphql'
import axios from 'axios'

export default {
  components: {
    TheHeader,
    TheFooter,
    BannerImage,
    BarNavigation,
    ModalTemplate,
    AddNew
  },
  data () {
    return {
      fileSelected: null,
      showModal: false
    }
  },
  apollo: {
    getAllMedia: {
      query: GET_ALL_MEDIA_QUERY,
      variables: {
        count: 0
      }
    }
  },
  methods: {
    onUpload (event) {
      this.fileSelected = event.target.files[0]
      console.log(this.fileSelected)
    },
    onSave () {
      const formData = new FormData()
      formData.append('file', this.fileSelected)

      axios.post(`${this.$appUrl}/server/api/upload`, formData).then(res => {
        this.$apollo.mutate({
          mutation: SINGLE_UPLOAD_MUTATION,
          variables: {
            publicId: res.data.public_id,
            format: res.data.format,
            url: res.data.url,
            secureUrl: res.data.secure_url,
            originalFilename: res.data.original_filename
          },
          update (cache, result) {
            const data = cache.readQuery({
              query: GET_ALL_MEDIA_QUERY,
              variables: {
                count: 0
              }
            })
            data.getAllMedia = [result.data.singleUpload, ...data.getAllMedia]
            cache.writeQuery({ query: GET_ALL_MEDIA_QUERY, data })

            console.log('Updated cache media')
          }
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.bar-wrapper
  background-color $color-base-off
  border-bottom 1px solid $color-border-grey
.bar-container
  flexbox center flex-end
  height 70px
.media-items
  display grid
  +media-screen(false, $screen-xs)
    grid-template-columns repeat(1, 1fr)
  +media-screen($screen-xs, $screen-sm)
    grid-template-columns repeat(3, 1fr)
  +media-screen($screen-sm, $screen-lg)
    grid-template-columns repeat(4, 1fr)
  +media-screen($screen-lg)
    grid-template-columns repeat(6, 1fr)
  grid-auto-rows auto
  grid-gap 10px
  padding 30px 0
.media-item
  border 1px solid $color-border-grey
  color $color-text-grey
  position relative
  min-height 180px
  transition box-shadow 0.2s, border 0.2s
  &:hover
    border-color alpha($color-accent1, 30%)
    box-shadow 0 0 4px alpha($color-accent1, 70%)
// ::: .media-item
.media-details
  display grid
  grid-template-columns repeat(2, 1fr)
  grid-gap 1em 2em
  font-weight 500
  margin 0 -20px 0 -20px
  max-width: 800px;
  max-height calc(100vh - 150px)
  overflow hidden auto
  padding-right 10px
  scrollbar-width thin
  scrollbar-color alpha($color-accent2, 70%)
  &::-webkit-scrollbar
    width 4px
  &::-webkit-scrollbar-thumb
    background-color alpha($color-accent2, 70%)
    border-radius 4px
  &::-webkit-scrollbar-track
    background-color $color-border-grey
  &> div:not(:nth-child(-n+2))
    padding 30px 0
  p
    line-height 1.5
  .__copy-link
    h3
      margin-bottom 1em
    p
      background-color $color-base-grey
      border 1px solid $color-border-grey
      border-radius 4px
      margin-bottom 2em
      padding 8px 12px
  // ::: .__copy-link
  .__preview
    border  1px solid $color-border-grey
    flexbox center center
  .__info
    border-top 1px solid $color-border-grey
    p
      padding 0 12px
    input[type="text"], textarea
      width 100%
      background-color $color-base
      border 1px solid $color-border-grey
      border-radius 4px
      padding 8px 12px
      font-weight inherit
      margin-bottom 1.2em
    .btn-row
      flexbox center center
      button
        flex 1
      button:not(:last-child)
        margin-right 0.5em
  // ::: .__info
</style>
