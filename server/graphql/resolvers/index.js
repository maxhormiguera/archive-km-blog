const categoriesResolvers = require('./categories')
const blogsResolvers = require('./blogs')
const usersResolvers = require('./users')
const mediaResolvers = require('./media')

module.exports = {
  // Subscription: {
  //   ...blogsResolvers.Subscription
  // },
  Query: {
    ...usersResolvers.Query,
    ...categoriesResolvers.Query,
    ...blogsResolvers.Query,
    ...mediaResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...categoriesResolvers.Mutation,
    ...blogsResolvers.Mutation,
    ...mediaResolvers.Mutation
  }
}
