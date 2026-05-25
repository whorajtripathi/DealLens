import mongoose from 'mongoose'

const searchSchema = new mongoose.Schema(
  {
    inputType: {
      type: String,
      enum: ['image', 'text'],
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    },
    productDescription: {
      type: String,
      required: true
    },

    // stores full Gemini analysis
    productData: {
      productName: String,
      category: String,
      brand: String,
      color: String,
      material: String,
      keyFeatures: [String],
      searchQuery: String,
      estimatedPriceRange: String
    },

    results: [
      {
        rank: Number,
        title: String,
        price: String,
        website: String,
        url: String,
        rating: String,
        deliveryInfo: String,
        whyRanked: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'processing', 'analyzed', 'completed', 'failed'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

export default mongoose.model('Search', searchSchema)