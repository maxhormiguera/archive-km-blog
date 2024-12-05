const { model, Schema } = require('mongoose')

const userSchema = new Schema(
  {
    givenName: String,
    familyName: String,
    displayName: String,
    email: String,
    password: String,
    role: String
  },
  { timestamps: true }
)

module.exports = model('User', userSchema)
