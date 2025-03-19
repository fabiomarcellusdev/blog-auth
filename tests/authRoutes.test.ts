import request from "supertest";
import app from "../src/app";
import argon2 from "argon2";
import { AppDataSource } from "../src/config/database";
import { User } from "../src/entity/User";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../src/utils/constants";

beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.synchronize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

beforeEach(async () => {
    await AppDataSource.getRepository(User).clear(); // Clear the users table before each test
});

describe("User Routes", () => {
    describe("POST /api/user/register", () => {
        it("should create a new user and return 201", async () => {
            const newUser = {
                name: "New User",
                email: "newuser@example.com",
                password: "password",
            };

            const response = await request(app)
                .post("/api/user/register")
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty(
                "message",
                SUCCESS_MESSAGES.USER_REGISTERED
            );

            // Verify the user was created in the database
            const user = await AppDataSource.getRepository(User).findOneBy({
                email: newUser.email,
            });
            expect(user).not.toBeNull();
            expect(user?.name).toBe(newUser.name);
            expect(user?.email).toBe(newUser.email);
            expect(user?.password).not.toBe(newUser.password); // Password should be hashed
            expect(user?.role).toBe("user");
            expect(user?.isVerified).toBe(false);

            const isPasswordValid = await argon2.verify(
                user?.password as string,
                newUser.password
            );
            expect(isPasswordValid).toBe(true);
        });

        it("should return 400 if email is already in use", async () => {
            const newUser = {
                name: "New User",
                email: "existinguser@example.com",
                password: "password",
            };

            const newUserResponse = await request(app)
                .post("/api/user/register")
                .send(newUser);

            expect(newUserResponse.status).toBe(201);
            expect(newUserResponse.body).toHaveProperty(
                "message",
                SUCCESS_MESSAGES.USER_REGISTERED
            );

            const existingUserResponse = await request(app)
                .post("/api/user/register")
                .send(newUser);

            expect(existingUserResponse.status).toBe(400);
            expect(existingUserResponse.body).toHaveProperty(
                "message",
                ERROR_MESSAGES.EMAIL_ALREADY_IN_USE
            );
        });
    });
});

describe("Auth Routes", () => {
    describe("POST /api/auth/login", () => {
        it("should return 200 and a token for valid credentials", async () => {
            const newUser = {
                name: "Test User",
                email: "test@example.com",
                password: "password",
            };

            const createdUserResponse = await request(app)
                .post("/api/user/register")
                .send(newUser);

            expect(createdUserResponse.status).toBe(201);

            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: newUser.email, password: newUser.password });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty(
                "message",
                SUCCESS_MESSAGES.USER_LOGGED_IN
            );
            expect(response.body).toHaveProperty("userDetails");
            expect(response.body.userDetails).toHaveProperty(
                "name",
                newUser.name
            );
            expect(response.body.userDetails).toHaveProperty(
                "email",
                newUser.email
            );
        });

        it("should return 401 for invalid credentials", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: "invalid@example.com", password: "invalid" });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "message",
                ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD
            );
        });
    });

    describe("GET /api/auth/google/failure", () => {
        it("should redirect to login with error message", async () => {
            const response = await request(app).get("/api/auth/google/failure");

            expect(response.status).toBe(302);
            expect(response.headers.location).toBe(
                "/login?error=Google%20Auth%20Failed"
            );
        });
    });
});
