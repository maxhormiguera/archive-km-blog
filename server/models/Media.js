const { model, Schema } = require('mongoose')

const mediaSchema = new Schema(
  {
    publicId: String,
    format: String,
    url: String,
    secureUrl: String,
    originalFilename: String
  },
  { timestamps: true }
)

module.exports = model('Media', mediaSchema)
