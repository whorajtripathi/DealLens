// import { urlencoded } from "express";
// import mongoose from "mongoose";

// const searchSchema=new mongoose.Schema(
//     {
//         // What the user gave us — either an image URL or text description
//         inputType:{
//             type:String,
//             enum:["text","image"],
//             required:true
//         },

//         imageUrl:{
//             type:String,
//             default:null
//         },

//         productDescription:{
//             type:String,
//             required:true
//         },

//         results:[{
//             rank:Number,
//             title:String,
//             price:String,
//             website:String,
//             url:String,
//             rating:String,
//             deliveryInfo:String,
//             whyRanked:String
//         }
//     ],

//     status:{
//         type:String,
//         enum:["pending","processing","completed","failed"],
//         default:"pending"
//     }
// },
//     {
//         timestamps:true
//     }

// )

// export default mongoose.model("Search",searchSchema)

// Phase-3

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

    // NEW — stores full Gemini analysis
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