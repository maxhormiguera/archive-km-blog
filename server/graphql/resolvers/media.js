const { AuthenticationError } = require('apollo-server')

const Media = require('../../models/Media')
const checkAuth = require('../../util/checkAuth')

module.exports = {
  Query: {
    getAllMedia: async (_, { count }, context) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')

      try {
        const allMedia = await Media.find()
          .limit(count)
          .sort({ createdAt: -1 })
        return allMedia
      } catch (err) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    singleUpload: async (
      _,
      { uploadInput: { publicId, format, url, secureUrl, originalFilename } },
      context
    ) => {
      const { role } = checkAuth(context)

      if (role !== 'Admin') throw new AuthenticationError('Action not allowed')

      const newMedia = new Media({
        publicId,
        format,
        url,
        secureUrl,
        originalFilename
      })

      const media = await newMedia.save()

      return media
    }
  }
}
