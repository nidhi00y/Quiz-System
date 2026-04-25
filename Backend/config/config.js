import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URI){
    console.log("MONGO_URI not found in .env file")
}

const config = {
    MONOG_URI : process.env.MONGO_URI
}

export default config;