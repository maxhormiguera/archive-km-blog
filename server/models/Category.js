const { model, Schema } = require('mongoose')

const categorySchema = new Schema(
  {
    name: String,
    slug: String,
    description: String
  },
  { timestamps: true }
)

module.exports = model('Category', categorySchema)
