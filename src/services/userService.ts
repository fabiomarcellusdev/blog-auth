import argon2 from "argon2";
import User from "../models/User";
import { ResponseError } from "../types/responseError";

export const registerUserWithEmail = async (name: string, email: string, password: string): Promise<void> => {
    if(!name || !email || !password) {
        throw new ResponseError(400, "Name, Email, and Password are all required.");
    }

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        throw new ResponseError(400, "Email already in use.");
    }

    const hashedPassword = await argon2.hash(password);

    await new User({ name, email, password: hashedPassword }).save();
}