import axios from 'axios'
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL } from '../config'

const uploadCdn = file => {
  const promise = new Promise((resolve, reject) => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    axios({
      url: CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => console.log('err', err))
  })

  return promise.then(value => {
    return {
      success: 1,
      file: {
        url: value.data.secure_url
      }
    }
  })
}

export default uploadCdn
