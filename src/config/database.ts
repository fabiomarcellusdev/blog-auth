import { DataSource } from "typeorm";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    ssl: {
        rejectUnauthorized: true,
        requestCert: true,
        ca: fs.readFileSync(process.env.PATH_TO_CA_CERT as string).toString(),
    },
});

const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("PostgreSQL connected");
    } catch (error) {
        console.error("PostgreSQL connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
export { AppDataSource };
