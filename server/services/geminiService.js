// // geminiService.js — Talks to Google Gemini AI
// // Two jobs:
// // 1. analyzeProduct — reads image URL or text, extracts product details
// // 2. rankResults   — takes search results, ranks top 5 intelligently




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
