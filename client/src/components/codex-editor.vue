<template>
  <div id="codex-editor" />
</template>
<script>
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import Image from '@editorjs/image'
import Raw from '@editorjs/raw'
import Embed from '@editorjs/embed'

import uploadCdn from '../editorjs/uploadCdn'

export default {
  props: {
    content: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      config: null,
      editor: null
    }
  },
  mounted () {
    this.codexEditor()
  },
  methods: {
    codexEditor () {
      const updateBlocks = this.updateBlocks
      const content = this.content
      this.editor = new EditorJS({
        holder: 'codex-editor',
        autofocus: true,
        initialBlock: 'paragraph',
        data: content,
        tools: {
          header: {
            class: Header
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByFile (file) {
                  return uploadCdn(file)
                }
              }
            },
            inlineToolbar: true
          },
          list: {
            class: List,
            inlineToolbar: true
          },
          quote: {
            class: Quote,
            inlineToolbar: true
          },
          raw: {
            class: Raw
          },
          embed: Embed
        }, // tools
        onChange () {
          updateBlocks(content)
        }
      }) // config
    },
    updateBlocks (content) {
      this.editor.save().then((newContent) => {
        this.$emit('update', newContent)
      }).catch((error) => {
        console.log(':::: error ', error)
      })
    }
  }
}
</script>
