import { Document } from "mongoose";

export interface IUser extends Document {
    providerId?: string;
    provider?: string;
    name: string;
    email: string;
    password?: string;
}