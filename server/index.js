import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';    
import dotenv from 'dotenv';

import searchRoutes from './routes/searchRoutes.js'

dotenv.config();

const app=express();
const port=process.env.PORT || 5000;

app.use(cors({                                  // Only allow requests from our React app
    origin:'http://localhost:5173',
    credentials:true
}));

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI )
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


app.use('/api/search', searchRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DealLens server is running 🔍' })
})

app.get("/",(req,res)=>{
    res.json({
        status:"ok",
        message:"DealLens Server is running"
    });
});

// Temporary test route — add this before app.listen
app.get('/api/test-cloudinary', async (req, res) => {
  try {
    const cloudinary = await import('cloudinary')
    
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    // Ping Cloudinary to check credentials
    const result = await cloudinary.v2.api.ping()
    res.json({ 
      success: true, 
      message: 'Cloudinary connected!',
      result 
    })
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message 
    })
  }
})

app.get('/api/test-gemini', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    // Test with this model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const result = await model.generateContent('Say hello in one word')
    const text = result.response.text()

    res.json({ success: true, response: text })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
});