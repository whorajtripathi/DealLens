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


export default upload










// // upload.js — Handles incoming image files
// // Multer is a middleware that intercepts file uploads BEFORE they hit your controller
// // Without this, Express can't read image files from requests — only text/JSON


// React
// │
// │ User selects image
// │
// ▼
// FormData
// │
// ▼
// POST /api/search
// │
// ▼
// Express
// │
// ▼
// upload.single("image")
// │
// ├── Checks file size (≤ 5 MB)
// ├── Checks MIME type starts with "image/"
// ├── Stores file in RAM
// └── Adds file to req.file
// │
// ▼
// searchController
// │
// ▼
// Cloudinary uploads req.file.buffer
// │
// ▼
// Cloudinary returns image URL
// │
// ▼
// Gemini analyzes the image using the URL
// │
// ▼
// Search results returned to React