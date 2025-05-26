import { v2 as cloudinary } from 'cloudinary';

export const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    let uploadRes;

    try {
        uploadRes = await cloudinary.uploader
            .upload(filePath)
    } catch (error) {
        console.log(error)
    }

    return uploadRes;
}