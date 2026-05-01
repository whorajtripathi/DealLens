// // import cloudinaryService from "../services/cloudinaryService.js";  
// // import Search from "../models/Search.js"; // Assuming you have a Search model for database operations

// // export const createSearch = async (req, res) => {   
// //     try {

// //         console.log('📦 req.body:', req.body)
// //         console.log('📁 req.file:', req.file ? 'File received' : 'No file')

// //         const productText = req.body.productText || ''
// //         const imageFile = req.file; // multer puts the file in req.file

// //          // ✅ Fix — if image exists, that's enough. Text is optional.
// //         if (!imageFile && !productText.trim()) {
// //             return res.status(400).json({
// //             success: false,
// //             message: 'Please provide an image or product description'
// //          })
// //         }

// //         let imageUrl = null;
// //         let productDescription = productText.trim() || 'Analyzing image...'
// //         let inputType = imageFile ? 'image' : 'text';

// //         if (imageFile) {
// //             // Upload the image to Cloudinary and get the URL
// //             console.log("Uploading image to Cloudinary...");
// //             imageUrl = await cloudinaryService.uploadImage(imageFile.buffer);
// //             console.log("Image uploaded successfully:", imageUrl);

// //             } 

// //         const newSearch =await new Search({
// //             inputType,
// //             imageUrl,
// //             productDescription,
// //             result:[],
// //             status: 'pending'
// //         })

// //         console.log('Search saved to MongoDB:', newSearch._id)

// //         res.status(201).json({
// //       success: true,
// //       message: 'Search received successfully',
// //       searchId: newSearch._id,
// //       imageUrl,
// //       inputType
// //     })

// // } catch (error) {
// //     console.error('Error in createSearch:', error);
// //     res.status(500).json({
// //         success: false,
// //         message: 'An error occurred while processing your search',
// //         error: error.message
// //     });
// // }
// // }



























// // // // searchController.js — The BRAIN of each request
// // // // When a request hits a route, the route calls this controller
// // // // Controller decides: what to do, what to call, what to send back

// // // import cloudinaryService from '../services/cloudinaryService.js'
// // // import Search from '../models/Search.js'

// // // // This function handles POST /api/search
// // // // req = the incoming request (has the image or text)
// // // // res = the response we send back to React
// // // export const createSearch = async (req, res) => {
// // //   try {
// // //     const { productText } = req.body  // text description from user
// // //     const imageFile = req.file        // image file from user (if any)

// // //     // Validation — user must provide EITHER image OR text
// // //     if (!imageFile && !productText) {
// // //       return res.status(400).json({
// // //         success: false,
// // //         message: 'Please provide an image or product description'
// // //       })
// // //     }

// // //     let imageUrl = null
// // //     let productDescription = productText || ''
// // //     let inputType = imageFile ? 'image' : 'text'

// // //     // If user uploaded an image → send it to Cloudinary
// // //     if (imageFile) {
// // //       console.log('📸 Uploading image to Cloudinary...')
// // //       imageUrl = await cloudinaryService.uploadImage(imageFile.buffer)
// // //       console.log('✅ Image uploaded:', imageUrl)

// // //       // For now, use a placeholder description
// // //       // In Phase 3, Gemini will analyze the image and fill this in
// // //       productDescription = productText || 'Analyzing image...'
// // //     }

// // //     // Save the search to MongoDB with status "pending"
// // //     // Results will be added in Phase 3 when Gemini analyzes it
// // //     const newSearch = await Search.create({
// // //       inputType,
// // //       imageUrl,
// // //       productDescription,
// // //       results: [],
// // //       status: 'pending'
// // //     })

// // //     console.log('💾 Search saved to MongoDB:', newSearch._id)

// // //     // Send back success response to React
// // //     res.status(201).json({
// // //       success: true,
// // //       message: 'Search received successfully',
// // //       searchId: newSearch._id,
// // //       imageUrl,
// // //       inputType
// // //     })

// // //   } catch (error) {
// // //     console.error('❌ Error in createSearch:', error)
// // //     res.status(500).json({
// // //       success: false,
// // //       message: 'Something went wrong',
// // //       error: error.message
// // //     })
// // //   }
// // // }



// import cloudinaryService from '../services/cloudinaryService.js'
// import Search from '../models/Search.js'

// export const createSearch = async (req, res) => {
//   try {
//     console.log('📦 req.body:', req.body)
//     console.log('📁 req.file:', req.file ? 'File received ✅' : 'No file')

//     const productText = req.body.productText || ''
//     const imageFile = req.file

//     // Must have at least image or text
//     if (!imageFile && !productText.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an image or product description'
//       })
//     }

//     let imageUrl = null
//     let inputType = imageFile ? 'image' : 'text'
//     let productDescription = productText.trim() || 'Analyzing image...'

//     // Upload image to Cloudinary
//     if (imageFile) {
//       console.log('📸 Starting Cloudinary upload...')
//       console.log('📊 Buffer exists:', !!imageFile.buffer)
//       console.log('📊 Buffer length:', imageFile.buffer?.length)

//       imageUrl = await cloudinaryService.uploadImage(imageFile.buffer)
//       console.log('✅ Image uploaded successfully:', imageUrl)
//     }

//     // Save to MongoDB
//     console.log('💾 Saving to MongoDB...')
//     const newSearch = await Search.create({
//       inputType,
//       imageUrl,
//       productDescription,
//       results: [],
//       status: 'pending'
//     })

//     console.log('✅ Saved to MongoDB:', newSearch._id)

//     // Send response to React
//     res.status(201).json({
//       success: true,
//       message: 'Search received successfully',
//       searchId: newSearch._id,
//       imageUrl,
//       inputType
//     })

//   } catch (error) {
//     console.error('❌ Full error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Something went wrong',
//       error: error.message
//     })
//   }
// }


// Part-3

import cloudinaryService from '../services/cloudinaryService.js'
import { analyzeProduct } from '../services/geminiService.js'
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

    // Step 1 — Upload image to Cloudinary
    if (imageFile) {
      console.log('📸 Uploading to Cloudinary...')
      imageUrl = await cloudinaryService.uploadImage(imageFile.buffer)
      console.log('✅ Cloudinary upload done:', imageUrl)
    }

    // Step 2 — Save initial search to MongoDB as "processing"
    const newSearch = await Search.create({
      inputType,
      imageUrl,
      productDescription,
      results: [],
      status: 'processing'  // changed from pending to processing
    })

    console.log('💾 Initial search saved:', newSearch._id)

    // Step 3 — Send immediate response to React
    // We respond RIGHT AWAY so user sees the results page
    // Gemini analysis continues in the background
    res.status(201).json({
      success: true,
      message: 'Search started',
      searchId: newSearch._id,
      imageUrl,
      inputType
    })

    // Step 4 — Analyze with Gemini AFTER responding
    // This runs in background — user is already on results page
    console.log('🧠 Starting Gemini analysis in background...')
    const productData = await analyzeProduct(imageUrl, productText)

    // Step 5 — Update MongoDB with product details from Gemini
    await Search.findByIdAndUpdate(newSearch._id, {
      productDescription: productData.productName,
      productData: productData,        // store full analysis
      status: 'analyzed'               // ready for search phase
    })

    console.log('✅ Phase 3 complete — product analyzed:', productData.productName)

  } catch (error) {
    console.error('❌ Error in createSearch:', error.message)

    // Only send error response if we haven't responded yet
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.message
      })
    }
  }
}

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
