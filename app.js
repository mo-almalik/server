import dotenv from 'dotenv'
import multer from 'multer'
import express from 'express'
import dbcon from './config/db.js'
import bootstrap from './src/bootstrap.js'
import {v2 as cloudinary} from 'cloudinary';
dotenv.config()
const app = express()
// const upload = multer({ dest: 'uploads/' })
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
  

dbcon()
bootstrap(app)
const port = 3001

app.listen(process.env.PORT || port,()=>console.log(`app listen on port ${port}`) )