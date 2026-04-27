import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';    
import dotenv from 'dotenv';

dotenv.config();

const app=express();
const port=process.env.PORT || 5000;

app.use(cors({                                  // Only allow requests from our React app
    origin:'http://localhost:3000',
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


app.get("/",(req,res)=>{
    res.json({
        status:"ok",
        message:"DealLens Server is running"
    });
});


app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
});