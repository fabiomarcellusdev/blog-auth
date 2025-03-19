export class DatabaseError extends Error {
    status: number;
    details?: string;

    constructor(status: number = 500, message: string, details?: string) {
        super(message);
        this.status = status;
        this.details = details;
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}
