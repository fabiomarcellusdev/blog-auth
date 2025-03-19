import { User } from "../entity/User";
import { ResponseError } from "../types/responseError";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ERROR_MESSAGES } from "../utils/constants";

dotenv.config();

interface LoginResponse {
    token: string;
    userDetails: {
        name: string;
        email: string;
    };
}

export const loginWithEmail = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    if (!email || !password) {
        throw new ResponseError(400, ERROR_MESSAGES.LOGIN_DETAILS_REQUIRED);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ResponseError(401, ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    if (!user.password && user.provider) {
        throw new ResponseError(
            401,
            ERROR_MESSAGES.PROVIDER_ACCOUNT(user.provider)
        );
    }

    if (user.password) {
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            throw new ResponseError(
                401,
                ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD
            );
        }
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });

    return { token, userDetails: { name: user.name, email: user.email } };
};
