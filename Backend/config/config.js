import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URL){
    console.log("MONGO_URI not found in .env file")
}

if(!process.env.GEMINI_API_KEY){
    console.log("API KEY not found")
}

const config = {
    MONOG_URI : process.env.MONGO_URL,
    GEMINI_API_KEY:process.env.GEMINI_API_KEY
}

export default config;