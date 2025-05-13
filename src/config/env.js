import dotenv from 'dotenv';

dotenv.config();
 
export const config = {
    mongoUri: process.env.MONGODB_URI,
    fileUploadPath: process.env.FILE_UPLOAD,
    apiKey: process.env.APPKEY,
    secretKey: process.env.SECRET_KEY
}