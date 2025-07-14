import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    if (!username || !email) {
        throw new ApiError(400, "Username or Email is required !!")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }] //find user exists or not
    })
    if (!user) {
        throw new ApiError(404, "username or email is required ")
    }

    const isPasswordValid = await user.isPaswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }
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
    const options={
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully!"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}

// In general we import it in app.js inside the 'src' Folder