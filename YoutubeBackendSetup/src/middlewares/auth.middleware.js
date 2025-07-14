import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"
import jwt from "jsonwebtoken"

// while writing the middleware always pass 'next'
export const verifyJWT=asyncHandler(async (req,_,next) => {//same as res -> _
try {
        const token=req.cookies?.accessToken() || 
        req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id)
        .select("-password -refreshToken")
        if(!user){
            // HAVE to disscuss something about the frontend
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user=user;
        // assigns the current user to 
        next()
        // for running the next method after the completion of the middleware
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token")
}
})