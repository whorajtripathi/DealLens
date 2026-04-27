// cloudinaryService.js — Handles uploading images to Cloudinary
// This is a SERVICE — it has one job: take an image buffer, upload it, return URL


import cloudinary from 'cloudinary';
import dotenv from 'dotenv';    
import streamifier from 'streamifier';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}); 

// uploadImage takes a file buffer (raw image data in memory)
// and returns a promise that resolves to the Cloudinary image URL
const uploadImage = (file) => {
    return new Promise((resolve, reject) => {   
        
        // Create an upload stream to Cloudinary
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
                folder: 'deallens',     // organizes uploads in a folder on Cloudinary
                resource_type: 'image' // Optional: specify a folder in Cloudinary
            },
            (error, result) => {
                if (error) {
                    reject(error);  
                } else {
                    resolve(result.secure_url); // Return the URL of the uploaded image
                }   
            }
        )

        // streamifier converts the buffer into a readable stream
        // Cloudinary needs a stream, not a raw buffer
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    })
}
export default { uploadImage };
