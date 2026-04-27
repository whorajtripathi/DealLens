import multer from "multer";    

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }       
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});













// // upload.js — Handles incoming image files
// // Multer is a middleware that intercepts file uploads BEFORE they hit your controller
// // Without this, Express can't read image files from requests — only text/JSON

// import multer from 'multer'

// // memoryStorage means the file is kept in RAM temporarily (as a buffer)
// // We don't save it to disk — we pass it directly to Cloudinary
// // This is faster and cleaner than saving to disk first
// const storage = multer.memoryStorage()

// const fileFilter = (req, file, cb) => {
//   // Only allow image files — reject PDFs, videos, etc.
//   // mimetype is like "image/jpeg", "image/png", "image/webp"
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true)   // null = no error, true = accept file
//   } else {
//     cb(new Error('Only image files are allowed'), false)
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024  // 5MB max — prevent huge uploads
//   }
// })

// export default upload