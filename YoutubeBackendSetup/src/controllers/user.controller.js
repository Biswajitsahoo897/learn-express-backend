import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async (req,res)=>{
    // get user details from frontend
    // validation-not empty
    // check if the user already exists : username,email
    // check for images,check for avatar
    // upload them to cloudinary , check the multer upload avatar correctly or not
    // create user update- create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName,email,username,password}=req.body
    // object destructuring fullName=req.body.fullName.....
    console.log(`Email:${email}`);

    // if(fullName===""){
    //     throw new ApiError(400,"Full name is required")
    // }

    if (
        [fullName,email,username,password].some((field)=>field?.trim()==="")
        // .some() to check if any of the required fields are empty strings
    ) {
        throw new ApiError(400,"All Fields Are Required")
    }

    const existedUser=await User.findOne({//search for a single doc that finds the match 
        // operators using $ sign in MongoDB ,returns a user if it already exists
        $or:[{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists!")
    }

    // Optional Chaining ,with '?.' it safely returns undefined
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar File is Required..")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar File is Required..")
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    // Exclude sensitive fields from the output
    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user..!");
    }
    
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Register Successfully")
        // this type we are building
    )

})

export {
    registerUser
}

// In general we import it in app.js inside the 'src' Folder