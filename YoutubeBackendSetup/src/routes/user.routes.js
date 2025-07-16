import { Router } from "express";
import { loginUser, registerUser ,logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route('/register').post(
    // it accepts two fields avatar and coverImage , then it calls the registerUser for registration
    upload.fields([
        {
            name:"avatar",
            maxCount:1,

        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route('/login').post(loginUser)

// secure routes
router.route('/logout').post(verifyJWT ,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
// first verifyJWT runs then loggedUser


export default router

// In general we import it in app.js inside the 'src' Folder