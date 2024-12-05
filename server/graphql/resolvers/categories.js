const { AuthenticationError } = require('apollo-server')

const Category = require('../../models/Category')
const Blog = require('../../models/Blog')
const checkAuth = require('../../util/checkAuth')

const createSlug = name => {
  const slug = name
    .split(' ')
    .join('-')
    .toLowerCase()

  return slug
}

module.exports = {
  Query: {
    getCategories: async (_, { count }, context) => {
      const user = checkAuth(context)

      try {
        const categories = await Category.find()
          .limit(count)
          .sort({ createdAt: -1 })
        return categories
      } catch (err) {
        throw new Error(err)
      }
    },

    getCategory: async (_, { slug }, context) => {
      const user = checkAuth(context)

      try {
        const blogs = await Blog.find({ 'categories.slug': slug }).sort({ createdAt: -1 })
        return blogs
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    createCategory: async (_, { name, description }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')
      if (name.trim() === '') throw new Error('Name must not be empty')

      const exist = await Category.findOne({ name })

      if (exist) throw new Error('Category name already exist')

      const newCategory = new Category({
        name,
        slug: createSlug(name),
        description
      })

      const category = await newCategory.save()
      return category
    },

    editCategory: async (_, { categoryId, name, description }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')
      if (name.trim() === '') throw new Error('Name must not be empty')

      const exist = await Category.findOne({ name })

      if (exist) throw new Error('Category name already exist')

      const category = await Category.findById(categoryId)

      const oldName = category.name

      category.name = name
      category.slug = createSlug(name)
      category.description = description

      const res = category.save()

      await Blog.updateMany(
        { 'categories.name': oldName },
        { $set: { 'categories.$[element]': category } },
        { arrayFilters: [{ 'element.name': oldName }] }
      )

      return res
    },

    deleteCategory: async (_, { name }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')

      try {
        const category = await Category.findOne({ name })

        if (!category) throw new Error('Category does not exist')

        await Blog.updateMany({ 'categories.name': name }, { $pull: { categories: { name } } })
        await category.delete()

        return 'Category successfully deleted'
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
