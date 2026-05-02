// // searchRoutes.js — Defines WHAT URLs exist in your API
// // Think of routes like a menu — they list what the kitchen (controller) can make
// // Route = URL + HTTP method + which controller function to call

// import express from 'express'
// import { createSearch, getSearch, getHistory } from '../controllers/searchController.js'
// import upload from '../middleware/upload.js'

// const router = express.Router()

// // POST /api/search
// // upload.single('image') = multer middleware runs first
// //   → it reads the image file from the request
// //   → puts it in req.file
// //   → then passes to createSearch controller
// router.get('/history', getHistory)
// router.post('/', upload.single('image'), createSearch)
// router.get('/:id', getSearch)        

// export default router

import express from 'express'
import { createSearch, getSearch, getHistory } from '../controllers/searchController.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// IMPORTANT — history route must come BEFORE /:id route
// Otherwise Express thinks "history" is an ID
router.get('/history', getHistory)
router.post('/', upload.single('image'), createSearch)
router.get('/:id', getSearch)

export default router