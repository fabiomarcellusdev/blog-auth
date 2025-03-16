import express from "express";
import passport from "../config/passport";
import {
    googleAuthSuccess,
    googleAuthFailure,
} from "../controllers/authController";

const router = express.Router();

// Route to initiate Google OAuth
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/google/failure",
    }),
    googleAuthSuccess
);

router.get("/google/failure", googleAuthFailure);

export default router;
