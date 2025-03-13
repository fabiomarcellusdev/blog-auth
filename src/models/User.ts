import { Schema, model, Document, Model } from "mongoose";

export interface IUser extends Document {
    providerId?: string;
    provider?: string;
    name: string;
    email: string;
    password?: string;
}

const userSchema = new Schema<IUser>({
    providerId: { type: String },
    provider: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String}
});

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;