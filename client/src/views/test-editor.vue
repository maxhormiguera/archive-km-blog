<template>
  <div>
    <h1>EditorJS</h1>
    <button @click="onSaveButton">Save</button>
    <editor
      ref="editor"
      autofocus
      holder-id="codex-editor"
      save-button-id="save-button"
      :init-data="initData"
      :custom-tools="customTools"
      @save="save"
      @ready="onReady"
      @change="onChange" />
  </div>
</template>
<script>
import { Editor } from 'vue-editor-js'
import ImageTool from '@editorjs/image'
import uploadCdn from '../editorjs/uploadCdn'
import { GET_BLOGS_QUERY, CREATE_BLOG_MUTATION } from '../graphql/blogGraphql'

export default {
  components: {
    Editor
  },
  apollo: {
    getBlogs: {
      query: GET_BLOGS_QUERY,
      variables: {
        count: 0
      }
    }
  },
  data () {
    return {
      dataBlocks: null,
      initData: {
        time: 1570779051053,
        blocks: [
          {
            type: 'header',
            data: {
              text: 'Title', level: 1
            }
          },
          {
            type: 'simpleImage',
            data: {
              caption: '',
              file: {
                url: 'https://res.cloudinary.com/km-blog/image/upload/v1570778790/bg-suggest-topic_azo83a.jpg'
              },
              stretched: false,
              withBackground: false,
              withBorder: false
            }
          },
          {
            type: 'paragraph',
            data: {
              text: 'asdasdasd'
            }
          },
          {
            type: 'paragraph',
            data: {
              text: '3544355'
            }
          }
        ],
        version: '2.15.1'
      },
      customTools: {
        simpleImage: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile (file) {
                return uploadCdn(file)
              }
            }
          }
        }
      }
    }
  },
  methods: {
    save (data) {
      console.log(data)
      this.dataBlocks = data
    },
    onReady () {
      console.log('Editor ready...')
    },
    onChange () {
      this.$refs.editor.save()
    },
    onSaveButton () {
      this.$apollo.mutate({
        mutation: CREATE_BLOG_MUTATION,
        variables: {
          title: 'sample',
          description: 'sample description',
          time: this.dataBlocks.time.toString(),
          blocks: JSON.stringify(this.dataBlocks.blocks),
          version: this.dataBlocks.version,
          categories: ['Medinews', 'Cybersecurity']
        },
        update (cache, result) {
          const parsedBlocks = JSON.parse(result.data.createBlog.content.blocks)
          console.log(parsedBlocks)
          // TODO: return templated blocks with custom styles
        }
      })
    }
  }
}
</script>
<style>

</style>
