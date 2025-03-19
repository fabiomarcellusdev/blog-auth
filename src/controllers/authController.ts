import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import dotenv from "dotenv";
import { loginWithEmail } from "../services/authService";
import { SUCCESS_MESSAGES } from "../utils/constants";

dotenv.config();

const jwtOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

export const googleAuthSuccess = (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).redirect("/login?error=User%20not%20found");
    }

    const user = req.user as User;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });

    res.cookie("jwt", token, jwtOptions);

    res.redirect("/");
};

export const googleAuthFailure = (req: Request, res: Response) => {
    res.redirect("/login?error=Google%20Auth%20Failed");
};

export const loginWithEmailAndPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    try {
        const { token, userDetails } = await loginWithEmail(email, password);
        res.cookie("jwt", token, jwtOptions);
        res.status(200).json({
            message: SUCCESS_MESSAGES.USER_LOGGED_IN,
            userDetails,
        });
    } catch (error: unknown) {
        next(error);
    }
};
