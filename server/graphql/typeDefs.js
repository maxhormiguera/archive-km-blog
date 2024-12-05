const gql = require('graphql-tag')

module.exports = gql`
  # Objects
  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    createdAt: String!
  }

  type Blog {
    id: ID!
    title: String!
    slug: String!
    description: String
    content: BlogContent!
    categories: [Category]
    thumbnail: Media
    coverImage: Media
    displayName: String!
    email: String!
    _user: ID!
    createdAt: String!
  }

  type BlogContent {
    time: String!
    blocks: String!
    version: String!
  }

  type User {
    id: ID!
    givenName: String!
    familyName: String!
    displayName: String!
    email: String!
    role: String!
    token: String!
    createdAt: String!
  }

  type Media {
    id: ID
    publicId: String
    format: String
    url: String
    secureUrl: String
    originalFilename: String
  }

  # Inputs
  input BlogContentInput {
    time: String
    blocks: String
    version: String
  }

  input UploadInput {
    publicId: String!
    format: String!
    url: String!
    secureUrl: String!
    originalFilename: String!
  }

  # Subscription
  type Subscription {
    newBlog: Blog!
  }

  # Query
  type Query {
    getUsers(count: Int!): [User]
    getUser(email: String!): User

    getCategories(count: Int!): [Category]
    getCategory(slug: String!): [Blog]

    getBlogs(count: Int!): [Blog]
    getBlog(slug: String!): Blog

    getAllMedia(count: Int!): [Media]
  }

  # Mutation
  type Mutation {
    googleSignin(token: String!): User!
    signin(email: String!, password: String!): User!

    createCategory(name: String!, description: String): Category!
    editCategory(categoryId: ID!, name: String!, description: String): Category!
    deleteCategory(name: String!): String!

    createBlog(title: String!, description: String, categories: [String]): Blog!
    editBlog(
      blogId: ID!
      title: String!
      description: String
      content: BlogContentInput
      categories: [String]
      thumbnail: String
      coverImage: String
    ): Blog!
    deleteBlog(blogId: ID!): String!

    singleUpload(uploadInput: UploadInput): Media!
  }
`
