import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './ApiError.js';
import fs from 'fs';


const uploadOnCloudinary = async(uploadFilePath) =>{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    try {
       
        const response = await cloudinary.uploader.upload(
            uploadFilePath,
            {
                resource_type:'auto',
            }
        ); if(!uploadFilePath) return null;
        return response;
        
    } catch (error) {
        console.log('Some error occurred while uploading the file.',error);
        fs.unlinkSync(uploadFilePath,(err)=>{
            if(err) throw err;
            console.log('File Unlinked Successfully.');
        })
        return null;
    }
};


async function deleteOnCloudinary(public_id){
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    await cloudinary.uploader.destroy(public_id,{
        resource_type:'image'
    })
}

export { uploadOnCloudinary , deleteOnCloudinary };

