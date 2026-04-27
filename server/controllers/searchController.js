import cloudinaryService from "../services/cloudinaryService";  
import Search from "../models/Search.js"; // Assuming you have a Search model for database operations

export const createSearch = async (req, res) => {   
    try {
        const { productText } = req.body;
        const imageFile = req.file; // multer puts the file in req.file

        if(!imageFile || !productText) {
            return res.status(400).json({
                success: false,
                message: "Please provide an image or product description" 
            });
        }

        let imageUrl = null;
        let productDescription = productText||''
        let inputType = imageFile ? 'image' : 'text';

        if (imageFile) {
            // Upload the image to Cloudinary and get the URL
            console.log("Uploading image to Cloudinary...");
            imageUrl = await cloudinaryService.uploadImage(imageFile.buffer);
            console.log("Image uploaded successfully:", imageUrl);

            productDescription = productText || 'Analyzing image...' // Use productText if provided, otherwise empty string 
        } 

        const newSearch =await new Search({
            inputType,
            imageUrl,
            productDescription,
            result:[],
            status: 'pending'
        })

        console.log('Search saved to MongoDB:', newSearch._id)

        res.status(201).json({
      success: true,
      message: 'Search received successfully',
      searchId: newSearch._id,
      imageUrl,
      inputType
    })

} catch (error) {
    console.error('Error in createSearch:', error);
    res.status(500).json({
        success: false,
        message: 'An error occurred while processing your search',
        error: error.message
    });
}
}



























// // searchController.js — The BRAIN of each request
// // When a request hits a route, the route calls this controller
// // Controller decides: what to do, what to call, what to send back

// import cloudinaryService from '../services/cloudinaryService.js'
// import Search from '../models/Search.js'

// // This function handles POST /api/search
// // req = the incoming request (has the image or text)
// // res = the response we send back to React
// export const createSearch = async (req, res) => {
//   try {
//     const { productText } = req.body  // text description from user
//     const imageFile = req.file        // image file from user (if any)

//     // Validation — user must provide EITHER image OR text
//     if (!imageFile && !productText) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an image or product description'
//       })
//     }

//     let imageUrl = null
//     let productDescription = productText || ''
//     let inputType = imageFile ? 'image' : 'text'

//     // If user uploaded an image → send it to Cloudinary
//     if (imageFile) {
//       console.log('📸 Uploading image to Cloudinary...')
//       imageUrl = await cloudinaryService.uploadImage(imageFile.buffer)
//       console.log('✅ Image uploaded:', imageUrl)

//       // For now, use a placeholder description
//       // In Phase 3, Gemini will analyze the image and fill this in
//       productDescription = productText || 'Analyzing image...'
//     }

//     // Save the search to MongoDB with status "pending"
//     // Results will be added in Phase 3 when Gemini analyzes it
//     const newSearch = await Search.create({
//       inputType,
//       imageUrl,
//       productDescription,
//       results: [],
//       status: 'pending'
//     })

//     console.log('💾 Search saved to MongoDB:', newSearch._id)

//     // Send back success response to React
//     res.status(201).json({
//       success: true,
//       message: 'Search received successfully',
//       searchId: newSearch._id,
//       imageUrl,
//       inputType
//     })

//   } catch (error) {
//     console.error('❌ Error in createSearch:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Something went wrong',
//       error: error.message
//     })
//   }
// }