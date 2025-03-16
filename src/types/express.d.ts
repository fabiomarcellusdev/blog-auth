import UserEntity from "../entity/User";

declare global {
    namespace Express {
        interface User extends UserEntity {}
    }
}
