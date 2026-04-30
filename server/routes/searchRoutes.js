// searchRoutes.js — Defines WHAT URLs exist in your API
// Think of routes like a menu — they list what the kitchen (controller) can make
// Route = URL + HTTP method + which controller function to call

import express from 'express'
import { createSearch } from '../controllers/searchController.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// POST /api/search
// upload.single('image') = multer middleware runs first
//   → it reads the image file from the request
//   → puts it in req.file
//   → then passes to createSearch controller
router.post('/', upload.single('image'), createSearch)

export default router