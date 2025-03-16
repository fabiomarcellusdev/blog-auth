import { NextFunction, Request, Response } from "express";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "./config/passport";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.secure) {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

export default app;
