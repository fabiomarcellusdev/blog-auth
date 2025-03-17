import { User } from "../entity/User";
import { ResponseError } from "../types/responseError";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
        throw new ResponseError(400, "Email and Password are required.");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ResponseError(401, "Invalid email or password.");
    }

    if (!user.password) {
        throw new ResponseError(
            401,
            `This email is associated with a ${user.provider} account. Please log in using ${user.provider}."`
        );
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Invalid email or password.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });

    return { token, userDetails: { name: user.name, email: user.email } };
};
