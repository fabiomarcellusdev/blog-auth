import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import dotenv from "dotenv";
import { loginWithEmail } from "../services/authService";
import { ResponseError } from "../types/responseError";

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
    res.status(401).redirect("/login?error=Google%20Auth%20Failed");
};

export const loginWithEmailAndPassword = async (
    req: Request,
    res: Response
) => {
    const { email, password } = req.body;

    try {
        const { token, userDetails } = await loginWithEmail(email, password);
        res.cookie("jwt", token, jwtOptions);
        res.status(200).json({ message: "Login successful", userDetails });
    } catch (error: unknown) {
        if (error instanceof ResponseError) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
