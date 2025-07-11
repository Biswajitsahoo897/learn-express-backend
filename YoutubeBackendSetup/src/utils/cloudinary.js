import {v2 as cloudinary} from "cloudinary"
import { log } from "console"
import { diffieHellman } from "crypto"
import fs from "fs"
// unlink for removing file from web or local server

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        console.log('Sorry! , We could not found the file...');
        //Upload the file on the cloudinary 
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        }) 
        // file has been uploaded successfully 
        console.log("File is Uploaded On Cloudinary...Here is the URL: ",response.url);
        return response
        
    } catch (error) {
    // if the upload operation got failed 
    fs.unlinkSync(localFilePath) //so it will just remove the locally saved temporary file
    }
}

export default uploadOnCloudinary