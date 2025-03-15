import { Schema, model, Document, Model } from "mongoose";
import type { IUser } from "../types/User";

const userSchema = new Schema<IUser>({
    providerId: { type: String },
    provider: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String}
});

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;