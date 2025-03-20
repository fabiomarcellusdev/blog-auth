import { createLogger, format, transports } from "winston";
import WinstonCloudWatch from "winston-cloudwatch";
import AWS from "aws-sdk";

const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
    level: isProduction ? "info" : "debug",
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
    ],
});

if (isProduction) {
    logger.add(
        new WinstonCloudWatch({
            logGroupName: process.env.CLOUDWATCH_LOG_GROUP,
            logStreamName: process.env.CLOUDWATCH_LOG_STREAM,
            awsRegion: process.env.AWS_REGION,
            awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
            awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            messageFormatter: ({ level, message, timestamp }) => {
                return `${timestamp} [${level}]: ${message}`;
            },
        })
    );
}

export default logger;
