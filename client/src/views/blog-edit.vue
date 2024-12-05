<template>
  <div class="wrapper">
    <the-header />
    <div class="wrapper blog-wrapper">
      <div class="container">
        <side-navigation />
        <div class="body">
          <div v-if="getBlog" class="article">
            <div class="__tools">
              <button class="__btn btn-accent1" @click="confirmationModal('Saving will overwrite previously saved content', savePost)">Save</button>
              <router-link :to="{ name: 'blog', query: {'title': getBlog.slug} }" target="_blank" class="__btn btn-accent2">Preview</router-link>
              <span class="__separator"></span>
              <button class="__btn btn-ghost2" @click="confirmationModal('Are you sure you want to delete this post?', deletePost)">Delete</button>
            </div>
            <div class="__thumbnail-edit">
              <img :src="blogImage" class="blog-image">
              <label class="file-upload-wrapper">
                <input type="file" class="hidden" accept="image/jpeg" @change="uploadImage">
                <span class="btn-ghost2">Select Blog Thumbnail</span>
                <span class="__filename">{{ blogImageName }}</span>
              </label>
            </div>
            <div class="__thumbnail-edit">
              <img :src="coverImage" class="blog-image">
              <label class="file-upload-wrapper">
                <input type="file" class="hidden" accept="image/jpeg" @change="uploadCoverImage">
                <span class="btn-ghost2">Select Cover Image</span>
                <span class="__filename">{{ coverImageName }}</span>
              </label>
            </div>
            <div class="__header-edit">
              <input
                v-model="blogTitle"
                class="__edit-title"
                type="text"
                @change="$refs.editor.save()">
              <div class="__edit-category">
                <multiselect
                  v-model="blogCategories"
                  label="name"
                  placeholder="Select categories"
                  track-by="slug"
                  :max-height="400"
                  :options="options"
                  :allow-empty="false"
                  :close-on-select="false"
                  :multiple="true"
                  :searchable="true"
                  @input="$refs.editor.save()" />
              </div>
              <textarea v-model="blogDescription" class="__edit-description" placeholder="Post description here..."></textarea>
            </div>
            <div class="__content">
              <codex-editor :content="getBlog.content" @update="updateContent" />
            </div>
          </div> <!-- ::: <article> -->
        </div>
      </div>
    </div>
    <the-footer />
    <modal-template
      v-show="showModal"
      :message="modalMessage"
      :loading="loading"
      @continue="callback"
      @close="showModal = false" />
  </div>
</template>
<script>
import TheHeader from '../components/the-header.vue'
import TheFooter from '../components/the-footer.vue'
import SideNavigation from '../components/side-navigation.vue'
import codexEditor from '../components/codex-editor.vue'
import ModalTemplate from '../components/modal-template.vue'

import axios from 'axios'
import Multiselect from 'vue-multiselect'

import { GET_CATEGORIES_QUERY } from '../graphql/categoryGraphql'
import { GET_BLOG_QUERY, EDIT_BLOG_MUTATION, DELETE_BLOG_MUTATION } from '../graphql/blogGraphql'

export default {
  components: {
    TheHeader,
    TheFooter,
    SideNavigation,
    codexEditor,
    ModalTemplate,
    Multiselect
  },
  apollo: {
    getBlog: {
      query: GET_BLOG_QUERY,
      variables () {
        return {
          slug: this.$route.query.title
        }
      },
      update ({ getBlog }) {
        if (typeof getBlog.content.blocks === 'string') {
          getBlog.content.blocks = JSON.parse(getBlog.content.blocks)
        }
        this.blogId = getBlog.id
        this.blogTitle = getBlog.title
        this.blogImage = getBlog.thumbnail.secureUrl
        this.blogDescription = getBlog.description
        this.coverImage = getBlog.coverImage.secureUrl
        getBlog.categoryNames = []
        getBlog.categories.forEach(c => {
          getBlog.categoryNames.push(c.name)
        })
        this.blogCategories = getBlog.categories
        return getBlog
      }
    },
    getCategories: {
      query: GET_CATEGORIES_QUERY,
      variables: {
        count: 0
      },
      update ({ getCategories }) {
        this.options = getCategories
      }
    }
  },
  data () {
    return {
      loading: false,
      blogId: null,
      blogTitle: null,
      blogCategories: [],
      blogDescription: null,
      blogImageFile: null,
      blogImage: null,
      blogImageName: 'No image selected',
      coverImageFile: null,
      coverImage: null,
      coverImageName: 'No image selected',
      options: [],
      showModal: false,
      modalMessage: '',
      callback: () => { return false },
      user: this.$root.$data.store.state.user
    }
  },
  methods: {
    updateContent ({ blocks, time, version }) {
      this.articleNew = {
        blogId: this.getBlog.id,
        title: this.blogTitle,
        description: this.blogDescription,
        time: time.toString(),
        blocks: JSON.stringify(blocks),
        categories: this.blogCategories.length > 0 ? JSON.stringify(this.blogCategories) : JSON.stringify(this.getBlog.categories),
        version
      }
    },
    confirmationModal (message, callback) {
      this.modalMessage = message
      this.callback = callback
      this.showModal = true
    },
    save ({ blocks, time, version }) {
      this.articleNew = {
        blogId: this.getBlog.id,
        title: this.blogTitle,
        description: this.blogDescription,
        time: time.toString(),
        blocks: JSON.stringify(blocks),
        categories: this.blogCategories.length > 0 ? JSON.stringify(this.blogCategories) : JSON.stringify(this.getBlog.categories),
        version
      }
    },
    uploadImage (e) {
      const image = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = e => {
        this.blogImageFile = image
        this.blogImage = e.target.result
        this.blogImageName = image.name
      }
    },
    uploadCoverImage (e) {
      const image = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = e => {
        this.coverImageFile = image
        this.coverImage = e.target.result
        this.coverImageName = image.name
      }
    },
    async savePost () {
      this.loading = true
      if (!this.articleNew && !this.blogImageFile && !this.coverImageFile && !this.blogTitle && !this.blogDescription) {
        console.log('Nothing to update')
      } else {
        let thumbnail = null
        let coverImg = null
        const targetObj = this.articleNew ? this.articleNew : { blogId: this.blogId, title: this.blogTitle, description: this.blogDescription }

        if (this.blogImageFile) {
          const result = await this.uploadImageToApi(`${this.$appUrl}/server/api/uploadThumbnail`, this.blogImageFile)
          thumbnail = result
        }

        if (this.coverImageFile) {
          const result = await this.uploadImageToApi(`${this.$appUrl}/server/api/uploadCoverImage`, this.coverImageFile)
          coverImg = result
        }

        const concatenatedData = Object.assign(targetObj, {
          thumbnail: thumbnail ? JSON.stringify(thumbnail) : null,
          coverImage: coverImg ? JSON.stringify(coverImg) : null
        })

        this.editMutationCallback(concatenatedData)
      }
      this.loading = false
      this.showModal = false
    },
    editMutationCallback (data) {
      this.$apollo.mutate({
        mutation: EDIT_BLOG_MUTATION,
        variables: data,
        update (cache, { data: { editBlog } }) {
          const parsedBlocks = JSON.parse(editBlog.content.blocks)
          console.log('Data saved to DB.. Return this Object', editBlog)
          console.log('Parsed to JSON content blocks..', parsedBlocks)
          // TODO: return templated blocks with custom styles
        }
      })
    },
    async uploadImageToApi (url, file) {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await axios.post(url, formData)
      const meta = {
        publicId: data.public_id,
        format: data.format,
        url: data.url,
        secureUrl: data.secure_url,
        originalFilename: data.original_filename
      }
      return meta
    },
    publishPost () {
      if (!this.articleNew) {
        console.log('Nothing to update')
      } else {
        this.savePost()
        // and if savePost success
        // ... something something to publish blog article
        console.log('::: published ')
      }
    },
    deletePost () {
      const vm = this
      this.$apollo.mutate({
        mutation: DELETE_BLOG_MUTATION,
        variables: {
          blogId: this.getBlog.id
        },
        update (cache, result) {
          // TODO: update cache
          // redirect somewhere after blog deleted?
          console.log('Blog Deleted...', result)
          vm.$router.push({ name: 'home' })
        }
      })
      this.showModal = false
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="stylus" scoped>
.blog-wrapper
  background-color $color-base-off
  padding 60px 0
.container
  flexbox false center
  .side-navigation
    flex 1 1 20%
    margin-right 40px
    max-width 20em
  .body
    flex 1 1 80%
    max-width $blog-article-max-width

.contactus-wrapper
  text-align center
  margin 60px auto 0
.contactus
  background-color $color-base
  border 1px solid $color-border-grey
  border-radius 4px
  flexbox center space-around false false true
  max-width 900px
  padding 40px 60px
  p
    font-weight 500
    font-size 1.4em
    margin-right 2em
  button
    padding 12px 48px

.file-upload-wrapper
  flexbox center
  margin 0.5rem 0 2rem
  .__filename
    flex 1
.blog-image
  width-height 100% auto
.btn-upload-image
  width 100%
</style>
