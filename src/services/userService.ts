import argon2 from "argon2";
import { User } from "../entity/User";
import { ResponseError } from "../types/responseError";

export const registerUserWithEmail = async (
    name: string,
    email: string,
    password: string
): Promise<void> => {
    if (!name || !email || !password) {
        throw new ResponseError(
            400,
            "Name, Email, and Password are all required."
        );
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new ResponseError(400, "Email already in use.");
    }

    const hashedPassword = await argon2.hash(password);

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();
};
