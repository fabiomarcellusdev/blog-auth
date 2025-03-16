import express from "express";
import { registerWithEmail } from "../controllers/userController";

const router = express.Router();

router.post("/registerWithEmail", registerWithEmail);

export default router;
