import { Request, Response } from "express";
import { isResponseError, ResponseError } from "../types/responseError";
import { registerUserWithEmail } from "../services/userService";

export const registerWithEmail = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    
    try {
        await registerUserWithEmail(name, email, password);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error: unknown) {
        if(isResponseError(error)) {
            const responseError = error as ResponseError;
            res.status(responseError.status).json({ message: responseError.message, details: responseError.details });
        } else {
            res.status(500).json({ message: "Internal server error", details: error });
        }
    }
}
