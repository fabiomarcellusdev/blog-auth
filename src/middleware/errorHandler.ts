import { Request, Response } from "express";
import { ResponseError } from "../types/responseError";

const errorHandler = (err: Error, req: Request, res: Response) => {
    if (err instanceof ResponseError) {
        res.status(err.status).json({
            message: err.message,
            details: err.details,
        });
    } else {
        console.error(err.stack);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default errorHandler;
