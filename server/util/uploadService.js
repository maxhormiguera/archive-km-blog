const multer = require('multer')
const mime = require('mime-types')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads')
  },
  filename: function(req, file, cb) {
    let ext
    if (
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/svg'
    ) {
      ext = mime.extension(file.mimetype)
    }
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage
})

module.exports = upload
