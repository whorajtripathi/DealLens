// // geminiService.js — Talks to Google Gemini AI
// // Two jobs:
// // 1. analyzeProduct — reads image URL or text, extracts product details
// // 2. rankResults   — takes search results, ranks top 5 intelligently

// import { GoogleGenerativeAI } from '@google/generative-ai'
// import dotenv from 'dotenv'
// import axios from 'axios'

// dotenv.config()

// // Initialize Gemini with your API key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// // ─── HELPER — Convert image URL to base64 ──────────────────────────────────
// // Gemini needs images as base64 data, not URLs
// // So we download the image from Cloudinary and convert it
// const urlToBase64 = async (imageUrl) => {
//   const response = await axios.get(imageUrl, {
//     responseType: 'arraybuffer'  // get raw bytes
//   })
//   const base64 = Buffer.from(response.data).toString('base64')
//   const mimeType = response.headers['content-type'] // e.g. "image/png"
//   return { base64, mimeType }
// }

// // ─── JOB 1 — Analyze product from image or text ────────────────────────────
// export const analyzeProduct = async (imageUrl, productText) => {
//   try {
//     console.log('🧠 Gemini analyzing product...')

//     // Use gemini-1.5-flash — fast and free tier friendly
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

//     let prompt = ''
//     let contents = []

//     if (imageUrl) {
//       // IMAGE MODE — download image and send to Gemini
//       console.log('🖼️ Analyzing image:', imageUrl)
//       const { base64, mimeType } = await urlToBase64(imageUrl)

//       prompt = `
//         Analyze this product image carefully.
//         ${productText ? `Additional context from user: "${productText}"` : ''}
        
//         Extract the following details and respond ONLY with a valid JSON object.
//         No extra text, no markdown, no code blocks. Just raw JSON.
        
//         {
//           "productName": "specific product name",
//           "category": "product category",
//           "brand": "brand name or Unknown",
//           "color": "color(s)",
//           "material": "material if visible or Unknown",
//           "keyFeatures": ["feature1", "feature2", "feature3"],
//           "searchQuery": "optimized search query for finding this on Amazon/Flipkart (5-8 words)",
//           "estimatedPriceRange": "estimated price range in INR"
//         }
//       `

//       contents = [
//         {
//           inlineData: {
//             data: base64,
//             mimeType: mimeType
//           }
//         },
//         { text: prompt }
//       ]

//     } else {
//       // TEXT MODE — user typed a description
//       console.log('📝 Analyzing text:', productText)

//       prompt = `
//         A user wants to buy this product: "${productText}"
        
//         Extract the following details and respond ONLY with a valid JSON object.
//         No extra text, no markdown, no code blocks. Just raw JSON.
        
//         {
//           "productName": "specific product name",
//           "category": "product category",
//           "brand": "brand name or Unknown",
//           "color": "color(s) or Unknown",
//           "material": "material or Unknown",
//           "keyFeatures": ["feature1", "feature2", "feature3"],
//           "searchQuery": "optimized search query for finding this on Amazon/Flipkart (5-8 words)",
//           "estimatedPriceRange": "estimated price range in INR"
//         }
//       `

//       contents = [{ text: prompt }]
//     }

//     // Send to Gemini
//     const result = await model.generateContent(contents)
//     const responseText = result.response.text()

//     console.log('🤖 Gemini raw response:', responseText)

//     // Clean the response — remove any markdown if Gemini adds it
//     const cleaned = responseText
//       .replace(/```json/g, '')
//       .replace(/```/g, '')
//       .trim()

//     // Parse JSON
//     const productData = JSON.parse(cleaned)
//     console.log('✅ Product analyzed:', productData.productName)

//     return productData

//   } catch (error) {
//     console.error('❌ Gemini analysis error:', error.message)
//     throw error
//   }
// }

// // ─── JOB 2 — Rank search results ───────────────────────────────────────────
// export const rankResults = async (searchResults, productData) => {
//   try {
//     console.log('🏆 Gemini ranking results...')

//     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

//     const prompt = `
//       A user is looking for: "${productData.productName}" 
//       Budget range: ${productData.estimatedPriceRange}
      
//       Here are the search results found:
//       ${JSON.stringify(searchResults, null, 2)}
      
//       Rank the TOP 5 best deals considering:
//       1. Price value for money
//       2. Relevance to what user wants
//       3. Website reliability (Amazon/Flipkart preferred)
//       4. Product ratings if available
//       5. Delivery speed if mentioned
      
//       Respond ONLY with a valid JSON array. No extra text, no markdown.
      
//       [
//         {
//           "rank": 1,
//           "title": "product title",
//           "price": "price in ₹",
//           "website": "Amazon/Flipkart/etc",
//           "url": "product url",
//           "rating": "rating or N/A",
//           "deliveryInfo": "delivery info or N/A",
//           "whyRanked": "2 sentence explanation of why this ranks here"
//         }
//       ]
//     `

//     const result = await model.generateContent(prompt)
//     const responseText = result.response.text()

//     console.log('🤖 Gemini ranking response:', responseText)

//     // Clean and parse
//     const cleaned = responseText
//       .replace(/```json/g, '')
//       .replace(/```/g, '')
//       .trim()

//     const rankedResults = JSON.parse(cleaned)
//     console.log('✅ Results ranked successfully')

//     return rankedResults

//   } catch (error) {
//     console.error('❌ Gemini ranking error:', error.message)
//     throw error
//   }
// }




import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Helper — download image and convert to base64
const urlToBase64 = async (imageUrl) => {
  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer'
  })
  const base64 = Buffer.from(response.data).toString('base64')
  const mimeType = response.headers['content-type']
  return { base64, mimeType }
}

// JOB 1 — Analyze product from image or text
export const analyzeProduct = async (imageUrl, productText) => {
  try {
    console.log('🧠 Gemini analyzing product...')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    let parts = []

    if (imageUrl) {
      console.log('🖼️ Downloading image for Gemini...')
      const { base64, mimeType } = await urlToBase64(imageUrl)
      console.log('✅ Image converted to base64, mimeType:', mimeType)

      parts.push({
        inlineData: {
          data: base64,
          mimeType: mimeType
        }
      })
    }

    const textPrompt = `
      ${imageUrl ? 'Analyze this product image carefully.' : ''}
      ${productText ? `User description: "${productText}"` : ''}
      
      Extract product details and respond ONLY with raw JSON — no markdown, no code blocks, no extra text.
      
      {
        "productName": "specific product name",
        "category": "product category",
        "brand": "brand name or Unknown",
        "color": "color or Unknown",
        "material": "material or Unknown",
        "keyFeatures": ["feature1", "feature2", "feature3"],
        "searchQuery": "best search query for Amazon or Flipkart 5-8 words",
        "estimatedPriceRange": "estimated INR price range"
      }
    `

    parts.push({ text: textPrompt })

    const result = await model.generateContent(parts)
    const responseText = result.response.text()

    console.log('🤖 Gemini raw response:', responseText)

    // Clean response — remove markdown if present
    const cleaned = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const productData = JSON.parse(cleaned)
    console.log('✅ Product analyzed:', productData.productName)

    return productData

  } catch (error) {
    console.error('❌ Gemini analysis error:', error.message)
    throw error
  }
}

// JOB 2 — Rank search results
export const rankResults = async (searchResults, productData) => {
  try {
    console.log('🏆 Gemini ranking results...')

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `
      User is looking for: "${productData.productName}"
      Budget: ${productData.estimatedPriceRange}
      
      Search results:
      ${JSON.stringify(searchResults, null, 2)}
      
      Rank the TOP 5 best deals by price, relevance, website reliability, ratings and delivery.
      
      Respond ONLY with raw JSON array — no markdown, no extra text.
      
      [
        {
          "rank": 1,
          "title": "product title",
          "price": "price in ₹",
          "website": "website name",
          "url": "product url",
          "rating": "rating or N/A",
          "deliveryInfo": "delivery info or N/A",
          "whyRanked": "2 sentence explanation"
        }
      ]
    `

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    console.log('🤖 Gemini ranking response:', responseText)

    const cleaned = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const rankedResults = JSON.parse(cleaned)
    console.log('✅ Results ranked successfully')

    return rankedResults

  } catch (error) {
    console.error('❌ Gemini ranking error:', error.message)
    throw error
  }
}