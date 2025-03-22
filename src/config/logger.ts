import { format, transports, Container } from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import DailyRotateFile from "winston-daily-rotate-file";
import dotenv from "dotenv";
// not used directly in code but winston-cloudwatch relies on it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AWS from "aws-sdk";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const loggerOptions = {
    level: isProduction ? "info" : "debug",
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
};

const container = new Container();

container.add("console", {
    ...loggerOptions,
    transports: [
        new transports.Console(), // Console logging for real-time monitoring
    ],
});

container.add("file", {
    ...loggerOptions,
    transports: [
        new DailyRotateFile({
            filename: "logs/error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "15m",
            level: "error",
        }),
        new DailyRotateFile({
            filename: "logs/combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "15m",
        }),
    ],
});

if (isProduction) {
    container.add("cloudwatch", {
        ...loggerOptions,
        transports: [
            new WinstonCloudWatch({
                logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
                logStreamName: process.env.CLOUDWATCH_LOG_STREAM,
                awsRegion: process.env.AWS_REGION,
                awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
                awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
                messageFormatter: ({ level, message, timestamp }) => {
                    return `${timestamp} [${level}]: ${message}`;
                },
            }),
        ],
    });
}

async function sendToTransporters(log: string, level: "error" | "info") {
    const consoleLogger = container.get("console");

    const fileLogger = container.get("file");

    consoleLogger[level](log);

    if (isProduction) {
        try {
            const cloudWatchLogger = container.get("cloudwatch");
            cloudWatchLogger[level](log);
        } catch (err) {
            if (err instanceof Error) {
                fileLogger.error(err.message);
            }
            fileLogger[level](log);
        }
    } else {
        fileLogger[level](log);
    }
}

const logWithFallback = {
    info: (message: string) => {
        sendToTransporters(message, "info");
    },
    error: (message: string) => {
        sendToTransporters(message, "error");
    },
};

export default logWithFallback;
