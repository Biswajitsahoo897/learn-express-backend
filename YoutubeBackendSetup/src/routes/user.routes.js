import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router=Router()

router.route('/register').post(registerUser)


export default router

// In general we import it in app.js inside the 'src' Folder