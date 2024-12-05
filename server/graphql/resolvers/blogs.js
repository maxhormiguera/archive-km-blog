const { AuthenticationError } = require('apollo-server')

const Blog = require('../../models/Blog')
const checkAuth = require('../../util/checkAuth')

// Subscriptions
// const NEW_BLOG = 'NEW_BLOG'

const createSlug = name => {
  const slug = name.split(' ').join('-').toLowerCase()

  return slug
}

module.exports = {
  // Subscription: {
  //   newBlog: {
  //     subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_BLOG)
  //   }
  // },

  Query: {
    getBlogs: async (_, { count }, context) => {
      const user = checkAuth(context)

      try {
        const blogs = await Blog.find().limit(count).sort({ createdAt: -1 })
        return blogs
      } catch (err) {
        throw new Error(err)
      }
    },

    getBlog: async (_, { slug }, context) => {
      const user = checkAuth(context)

      try {
        const blog = await Blog.findOne({ slug })

        if (!blog) throw new Error('Blog not found')

        return blog
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    createBlog: async (_, { title, description, categories }, context) => {
      const { id, displayName, email, role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')
      if (title.trim() === '') throw new Error('Title must not be empty')

      const exist = await Blog.findOne({ title })
      if (exist) throw new Error('Blog title already exist')

      const newBlog = new Blog({
        title,
        slug: createSlug(title),
        description,
        content: {
          time: '',
          blocks: '[]',
          version: ''
        },
        categories: JSON.parse(categories),
        displayName,
        email,
        _user: id,
        createdAt: new Date().toISOString()
      })

      const blog = await newBlog.save()

      // context.pubsub.publish(NEW_BLOG, {
      //   newBlog: blog
      // })

      return blog
    },

    editBlog: async (
      _,
      {
        blogId,
        title,
        description,
        content: { time, blocks, version },
        categories,
        thumbnail,
        coverImage
      },
      context
    ) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')
      if (title.trim() === '') throw new Error('Title must not be empty')

      const blog = await Blog.findById(blogId)
      if (!blog) throw new Error('Blog not found')

      blog.title = title ? title : blog.title
      blog.slug = title ? createSlug(title) : blog.slug
      blog.description = description ? description : blog.description
      blog.content.time = time ? time : blog.content.time
      blog.content.blocks = blocks ? blocks : blog.content.blocks
      blog.content.version = version ? version : blog.content.version
      blog.categories = categories ? JSON.parse(categories) : blog.categories
      blog.thumbnail = thumbnail ? JSON.parse(thumbnail) : blog.thumbnail
      blog.coverImage = coverImage ? JSON.parse(coverImage) : blog.coverImage

      const updatedBlog = await blog.save()

      return updatedBlog
    },

    deleteBlog: async (_, { blogId }, context) => {
      const { email, role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')

      try {
        const blog = await Blog.findById(blogId)
        if (!blog) throw new Error('Blog does not exist')

        await blog.delete()
        return 'Blog successfully deleted'
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
