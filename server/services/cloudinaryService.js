// // cloudinaryService.js — Handles uploading images to Cloudinary
// // This is a SERVICE — it has one job: take an image buffer, upload it, return URL


import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadImage = (imageBuffer) => {
  console.log('📤 uploadImage called, buffer size:', imageBuffer.length)

  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader                                                  // we can directly use upload_stream without streamifier for buffers
      .upload_stream(                                                     // to upload a buffer, we use upload_stream which gives us a writable stream
        { folder: 'deallens', resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error)
            reject(error)
          } else {
            console.log('✅ Cloudinary upload success:', result.secure_url)
            resolve(result.secure_url)
          }
        }
      )
      .end(imageBuffer)
  })
}

export default { uploadImage }
