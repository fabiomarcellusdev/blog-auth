import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../types/responseError";
import { DatabaseError } from "../types/databaseError";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    res.setHeader("Content-Type", "application/json");

    if (err instanceof ResponseError || err instanceof DatabaseError) {
        res.status(err.status).json({
            message: err.message,
            details: err.details,
        });
    } else {
        // console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default errorHandler;
