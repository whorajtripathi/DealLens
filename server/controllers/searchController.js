import cloudinaryService from '../services/cloudinaryService.js'
import { analyzeProduct, rankResults } from '../services/geminiService.js'
import { searchProducts } from '../services/searchService.js'
import Search from '../models/Search.js'

export const createSearch = async (req, res) => {
  try {
    console.log('📦 req.body:', req.body)
    console.log('📁 req.file:', req.file ? 'File received ✅' : 'No file')

    const productText = req.body.productText || ''
    const imageFile = req.file

    // Validation
    if (!imageFile && !productText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image or product description'
      })
    }

    let imageUrl = null
    let inputType = imageFile ? 'image' : 'text'
    let productDescription = productText.trim() || 'Analyzing image...'

    // ── STEP 1: Upload image to Cloudinary ──────────────────────────
    if (imageFile) {
      console.log('📸 Uploading to Cloudinary...')
      imageUrl = await cloudinaryService.uploadImage(imageFile.buffer)
      console.log('✅ Cloudinary upload done:', imageUrl)
    }

    // ── STEP 2: Save initial record to MongoDB ───────────────────────
    const newSearch = await Search.create({
      inputType,
      imageUrl,
      productDescription,
      results: [],
      status: 'processing'
    })

    console.log('💾 Initial search saved:', newSearch._id)

    // ── STEP 3: Respond immediately to React ─────────────────────────
    // User lands on results page right away
    // Everything below runs in background
    res.status(201).json({
      success: true,
      message: 'Search started',
      searchId: newSearch._id,
      imageUrl,
      inputType
    })

    // ── STEP 4: Gemini analyzes the product ──────────────────────────
    console.log('🧠 Starting Gemini analysis...')
    const productData = await analyzeProduct(imageUrl, productText)

    // Update MongoDB with Gemini analysis
    await Search.findByIdAndUpdate(newSearch._id, {
      productDescription: productData.productName,
      productData: productData,
      status: 'analyzed'
    })

    console.log('✅ Product analyzed:', productData.productName)
    console.log('🔍 Search query:', productData.searchQuery)

    // ── STEP 5: Search Google for products ───────────────────────────
    console.log('🌐 Searching internet for deals...')
    const searchResults = await searchProducts(productData.searchQuery)

    if (searchResults.length === 0) {
      await Search.findByIdAndUpdate(newSearch._id, {
        status: 'failed',
        error: 'No products found'
      })
      return
    }

    console.log(`✅ Found ${searchResults.length} products`)

    // ── STEP 6: Gemini ranks the results ─────────────────────────────
    console.log('🏆 Gemini ranking the deals...')
    const rankedResults = await rankResults(searchResults, productData)

    // ── STEP 7: Save final results to MongoDB ────────────────────────
    await Search.findByIdAndUpdate(newSearch._id, {
      results: rankedResults,
      status: 'completed'
    })

    console.log('🎉 Phase 4 complete! Top deals saved to MongoDB')

  } catch (error) {
    console.error('❌ Error in createSearch:', error.message)

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.message
      })
    }
  }
}

// Get search by ID — used by React to poll for results
export const getSearch = async (req, res) => {
  try {
    const search = await Search.findById(req.params.id)

    if (!search) {
      return res.status(404).json({
        success: false,
        message: 'Search not found'
      })
    }

    res.json({
      success: true,
      search
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    })
  }
}

// Add at the bottom
export const getHistory = async (req, res) => {
  try {
    // Get last 20 searches, newest first
    const searches = await Search.find()
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({
      success: true,
      searches
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    })
  }
}