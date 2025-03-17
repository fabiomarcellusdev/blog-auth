import { NextFunction, Request, Response } from "express";
import { registerUserWithEmail } from "../services/userService";

export const registerWithEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, email, password } = req.body;

    try {
        await registerUserWithEmail(name, email, password);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error: unknown) {
        next(error);
    }
};
