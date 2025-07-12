import { asyncHandler } from "../utils/asyncHandler.js";
const registerUser=asyncHandler(async (req,res)=>{
    console.log("Register route hit");
    return res.status(200).json({
        message:"ok"
    })
})

export {registerUser}

// In general we import it in app.js inside the 'src' Folder