import express from "express";
import connectDB from "./config/database";
import fs from "fs";
import https from "https";
import "reflect-metadata";

require("dotenv").config();

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH as string),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH as string),
};

const PORT = process.env.PORT || 5000;
const app = express();

const startServer = async () => {
  await connectDB();
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Secure server running on port ${PORT} with HTTPS`);
  });
};

startServer();
