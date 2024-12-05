const { model, Schema } = require('mongoose')

const blogSchema = new Schema(
  {
    title: String,
    description: String,
    slug: String,
    content: {
      time: String,
      blocks: String,
      version: String
    },
    categories: [
      {
        name: String,
        slug: String,
        description: String
      }
    ],
    thumbnail: {
      publicId: String,
      format: String,
      url: String,
      secureUrl: String,
      originalFilename: String
    },
    coverImage: {
      publicId: String,
      format: String,
      url: String,
      secureUrl: String,
      originalFilename: String
    },
    displayName: String,
    email: String
  },
  { timestamps: true }
)

module.exports = model('Blog', blogSchema)
