import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // File has been uploaded successfully
        console.log("File has been uploaded on Cloudinary", response.url);

        // Delete the local file after successful upload
        fs.unlinkSync(localFilePath);

        return response;

    } catch (err) {
        // Remove the locally saved temporary file if the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Error uploading file to Cloudinary:", err);
        return null;
    }
};

export { uploadOnCloudinary };
