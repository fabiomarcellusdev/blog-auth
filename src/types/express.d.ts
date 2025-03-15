import IUser from "./User.js";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}