import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'


const options={
    httpOnly:true,
    secure:true
}
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken; //store in DB
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something Went Wrong while generating refresh Token & Access Token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation-not empty
    // check if the user already exists : username,email
    // check for images,check for avatar
    // upload them to cloudinary , check the multer upload avatar correctly or not
    // create user update- create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body
    // object destructuring fullName=req.body.fullName.....
    console.log(`Email:${email}`);

    // if(fullName===""){
    //     throw new ApiError(400,"Full name is required")
    // }

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
        // .some() to check if any of the required fields are empty strings
    ) {
        throw new ApiError(400, "All Fields Are Required")
    }

    const existedUser = await User.findOne({//search for a single doc that finds the match 
        // operators using $ sign in MongoDB ,returns a user if it already exists
        $or: [{ username }, { email }]
    })
    // console.log(req.files);

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists!")
    }

    // Optional Chaining ,with '?.' it safely returns undefined
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    // Condition 1 :Makes sure files exist in the request
    // Condition 2:Ensures coverImage is an array as Multer returns an array per field
    // Condition 3:Makes sure at least one file was uploaded

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is Required..")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar File is Required..")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // Exclude sensitive fields from the output
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user..!");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Register Successfully")
        // this type we are building
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // imprt data from the req body
    // check weather the username , email, account exists or not
    // find the user in db
    // check the password
    // access token and refresh token generate and send it to the user
    // send cookie 

    const { email, username, password } = req.body;
    console.log(`Username:${username}`);
    console.log(`Email:${email}`);
    
    if (!username && !email) {
        throw new ApiError(400, "Both username & email is required !!")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }] //find user exists or not
    })
    if (!user) {
        throw new ApiError(404, "username or email is required ")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in Successfully"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    // for log out have to remove the cookie 
    await User.findByIdAndUpdate(req.user._id, {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )


    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully!"))
})

const refreshAccessToken=asyncHandler(async (req,res) => {
    const incomingrRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!refreshAccessToken){
        throw new ApiError(401,"Unauthorized Request")
    }

    try {
        const decodedToken=jwt.verify(
            incomingrRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user=User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if (incomingrRefreshToken!==user?.refreshToken) {
            throw new ApiError(401,"Refresh Token is Expired or Used!")
        }
    
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id)
        
        // syntax -> res.cookie(name, value, [options])
    
        return res
        .status(200)
        .cookie("accessToken: ",accessToken,options)
        .cookie("refreshToken: ",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "Access Token Has Been Refreshed!"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Refresh Token")
        
    }
})

const changeCurrentPassword=asyncHandler(async (req,res) => {
    const {oldPassword,newPassword}=req.body

    // if(!(newPassword===confPassword)){
    //     throw new ApiError(400,"Please write the Password properly")
    // }

    const user=await User.findById(req.user?._id)
    const isPasswordCorrect=user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid Old Password,Please Try Again...")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password Changed Successfully."))
})

const getCurrentUser=asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(200,req.user,"Current user fetched Successfully")
})

const updateAccountDetails=asyncHandler(async (req,res) => {
    const {fullName,email}=req.body
    if(!fullName||!email){
        throw new ApiError(400,"All fields are required")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,//as both field is same i can write it once ,ES6 property
                email:email
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiError(200,user,"Account Details Updated Successfully"))
})

const updateUserAvatar=asyncHandler(async(req,res)=>{

    const avatarLocalPath=req?.files?.avatar?.[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar File is Missing!!")
    }

    const avatarUpload =await uploadOnCloudinary(avatarLocalPath)
    if(!avatarUpload.url){
        throw new ApiError(400,"Error while Uploading The Avatar File")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatarUpload:avatarUpload.url
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiError(200,user,"Avatar Updated Successfully"))
})


const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.files?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image File is Missing!!")

    }
    const coverImageUpload =await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImageUpload.url){
        throw new ApiError(400,"Error While Uploading The Cover Image File!!")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImageUpload:coverImageUpload.url
            }
            // update the old url with new one,then return 
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiError(200,user,"CoverImage Updated Successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}

// In general we import it in app.js inside the 'src' Folder
/*
Useful Tips:
if u want to edit the avatar or something , file related things ,
make sure to do that in different controller , 
make a button , save that, hit the EndPoint 

*/