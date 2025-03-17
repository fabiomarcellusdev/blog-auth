import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import dotenv from "dotenv";

dotenv.config();

export const googleAuthSuccess = (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).redirect("/login?error=User%20not%20found");
    }

    const user = req.user as User;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    res.redirect("/");
};

export const googleAuthFailure = (req: Request, res: Response) => {
    res.status(401).redirect("/login?error=Google%20Auth%20Failed");
};
