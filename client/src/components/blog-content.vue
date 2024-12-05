<script>
export default {
  props: {
    blocks: {
      type: Array,
      default: null,
      required: true
    }
  },
  mounted () {
    const links = document.querySelectorAll('#blog-content a')
    links.forEach(link => {
      link.setAttribute('target', '_blank')
    })
  },
  render (h) {
    const blocks = []
    this.blocks.forEach(o => {
      const classes = [o.type]
      const domProps = {}
      const blockChildren = []
      let node = 'div'

      switch (o.type) {
        case 'header':
          node = 'h' + o.data.level
          domProps.innerHTML = o.data.text
          break
        case 'paragraph':
          node = 'p'
          domProps.innerHTML = o.data.text
          break
        case 'image':
          blockChildren.push(
            h('img', {
              domProps: {
                src: o.data.file.url
              }
            })
          )
          break
        case 'quote':
          blockChildren.push(
            h('p', {
              class: 'quote-text',
              style: {
                textAlign: o.data.alignment
              },
              domProps: {
                innerHTML: o.data.text
              }
            })
          )
          break
        case 'list':
          node = o.data.style === 'ordered' ? 'ol' : 'ul'
          o.data.items.forEach(item => {
            blockChildren.push(
              h('li', {
                domProps: {
                  innerHTML: item
                }
              })
            )
          })
          break
        case 'raw':
          domProps.innerHTML = o.data.html
          break
        case 'embed':
          blockChildren.push(
            h('iframe', {
              style: {
                width: '100%'
              },
              domProps: {
                src: o.data.embed,
                allowFullscreen: true,
                frameBorder: 0,
                height: o.data.height
              }
            })
          )
      }

      if (o.data.caption) {
        const alignment = o.data.alignment ? o.data.alignment : 'center'
        blockChildren.push(
          h('p', {
            class: 'caption',
            style: {
              textAlign: alignment
            },
            domProps: {
              innerHTML: o.data.caption
            }
          })
        )
      }

      Object.keys(o.data).forEach(key => {
        if (typeof o.data[key] === 'number') {
          classes.push(key + '-' + o.data[key])
        }
        if (typeof o.data[key] === 'boolean' && o.data[key] === true) {
          classes.push(key)
        }
        if (key === 'style') {
          classes.push(o.type + '-' + o.data[key])
        }
      })

      blocks.push(h(node, {
        class: classes,
        domProps
      }, blockChildren))
    })

    return h('div', {
      class: 'blog-content',
      attrs: {
        id: 'blog-content'
      }
    }, blocks)
  }
}
</script>
<style lang="stylus" scoped>
$template-color-imageborder = $color-accent2
$template-color-imagebackground = alpha($color-accent2, 15%)
$template-color-quotebackground = $color-base
$template-color-quoteborder = $color-accent2

.blog-content
  font-size 16px
  >>> a
    text-decoration underline

.header
  font-weight bold
  line-height 2
  margin-bottom 0.125rem
  &.header-1
    font-size 2em
  &.header-2
    font-size 1.75em
  &.header-3
    font-size 1.45em
  &.header-5
    font-size 0.875em
  &.header-6
    font-size 0.67em
.paragraph
  font-size 1.05em
  font-weight 400
  line-height 1.5
  margin-bottom 1em
.caption
  font-size 0.875em
  text-align center
  margin-top 10px
.image, .quote
  margin 2em 0
.image
  img
    margin 0 auto
    max-width 100%
  &.withBorder img
    border 1px solid $template-color-imageborder
  &.stretched img
    width 100%
  &.withBackground
    background-color $template-color-imagebackground
    padding 15px
    img
      max-width 70%
.quote
  background-color $template-color-quotebackground
  border-left 5px solid $template-color-quoteborder
  padding 30px
  .quote-text
    font-size 1.125em
    font-style italic
    line-height 1.5

.list
  font-size 1.05em
  margin-bottom 1em
  padding-left 4em
  &.list-unordered
    list-style-type disc
  li
    line-height 1.5
</style>

<!-- making a readonly document from editorjs contentBLocks -->
