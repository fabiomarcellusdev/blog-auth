import argon2 from "argon2";
import { User } from "../entity/User";
import { ResponseError } from "../types/responseError";
import { ERROR_MESSAGES } from "../utils/constants";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUserWithEmail = async (
    name: string,
    email: string,
    password: string
): Promise<string> => {
    if (!name || !email || !password) {
        throw new ResponseError(400, ERROR_MESSAGES.REGISTER_DETAILS_REQUIRED);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new ResponseError(400, ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);
    }

    const hashedPassword = await argon2.hash(password);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });

    return token;
};
