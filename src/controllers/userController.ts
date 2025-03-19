import { NextFunction, Request, Response } from "express";
import { registerUserWithEmail } from "../services/userService";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/constants";
import { ResponseError } from "../types/responseError";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, email, password } = req.body;

    try {
        await registerUserWithEmail(name, email, password);
        // await sendVerificationEmail(email, token);
        res.status(201).json({ message: SUCCESS_MESSAGES.USER_REGISTERED });
    } catch (error: unknown) {
        next(error);
    }
};

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(
            token as string,
            process.env.JWT_SECRET as string
        ) as { id: number };
        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            throw new ResponseError(400, ERROR_MESSAGES.INVALID_TOKEN);
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: SUCCESS_MESSAGES.EMAIL_VERIFIED });
    } catch (error: unknown) {
        next(error);
    }
};
