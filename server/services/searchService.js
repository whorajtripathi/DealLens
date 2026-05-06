// // searchService.js — Searches Google Custom Search API
// // Takes a search query and returns product results from
// // Amazon, Flipkart, Meesho and other shopping sites



import { getJson } from 'serpapi'
import dotenv from 'dotenv'

dotenv.config()

export const searchProducts = async (searchQuery) => {
  try {
    console.log('🔍 Searching via SerpAPI for:', searchQuery)

    const response = await getJson({
      api_key: process.env.SERPAPI_KEY,
      engine: 'google_shopping',
      q: searchQuery,
      location: 'India',
      hl: 'en',
      gl: 'in',
      num: 10
    })

    const items = response.shopping_results || []
    console.log(`✅ Found ${items.length} shopping results`)

    if (items.length === 0) {
      console.log('⚠️ No shopping results, trying regular search...')

      const fallback = await getJson({
        api_key: process.env.SERPAPI_KEY,
        engine: 'google',
        q: searchQuery + ' buy online India',
        hl: 'en',
        gl: 'in',
        num: 10
      })

      const organicResults = fallback.organic_results || []
      console.log(`✅ Found ${organicResults.length} organic results`)

      return organicResults.map((item, index) => ({
        position: index + 1,
        title: item.title,
        url: item.link,
        displayUrl: item.displayed_link,
        description: item.snippet,
        price: 'Check website',
        website: extractWebsiteName(item.displayed_link || '')
      }))
    }

    return items.map((item, index) => ({
      position: index + 1,
      title: item.title,
      url: item.link || item.product_link,
      displayUrl: item.source,
      description: item.snippet || '',
      price: item.price || 'Check website',
      rating: item.rating ? `${item.rating}/5` : 'N/A',
      website: extractWebsiteName(item.source || '')
    }))

  } catch (error) {
    console.error('❌ SerpAPI error:', error.message)
    throw error
  }
}

const extractWebsiteName = (source) => {
  if (!source) return 'Unknown'
  const s = source.toLowerCase()
  if (s.includes('amazon')) return 'Amazon'
  if (s.includes('flipkart')) return 'Flipkart'
  if (s.includes('meesho')) return 'Meesho'
  if (s.includes('myntra')) return 'Myntra'
  if (s.includes('ajio')) return 'Ajio'
  if (s.includes('snapdeal')) return 'Snapdeal'
  if (s.includes('nykaa')) return 'Nykaa'
  if (s.includes('croma')) return 'Croma'
  if (s.includes('tatacliq')) return 'Tata Cliq'
  return source.charAt(0).toUpperCase() + source.slice(1)
}
