import request from "supertest";
import app from "../src/app";
import argon2 from "argon2";
import { AppDataSource } from "../src/config/database";
import { User } from "../src/entity/User";

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

beforeEach(async () => {
    await AppDataSource.getRepository(User).clear(); // Clear the users table before each test
});

describe("Auth Routes", () => {
    describe("POST /api/auth/register", () => {
        it("should create a new user and return 201", async () => {
            const newUser = {
                name: "New User",
                email: "newuser@example.com",
                password: "password",
            };

            const response = await request(app)
                .post("/api/auth/register")
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty(
                "message",
                "User registered successfully"
            );

            // Verify the user was created in the database
            const user = await AppDataSource.getRepository(User).findOneBy({
                email: newUser.email,
            });
            expect(user).not.toBeNull();
            expect(user?.name).toBe(newUser.name);
            expect(user?.email).toBe(newUser.email);
            const isPasswordValid = await argon2.verify(
                user?.password as string,
                newUser.password
            );
            expect(isPasswordValid).toBe(true);
        });

        it("should return 400 if email is already in use", async () => {
            const existingUser = new User();
            existingUser.name = "Existing User";
            existingUser.email = "existinguser@example.com";
            existingUser.password = await argon2.hash("password");
            await existingUser.save();

            const newUser = {
                name: "New User",
                email: "existinguser@example.com",
                password: "password",
            };

            const response = await request(app)
                .post("/api/auth/register")
                .send(newUser);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                "message",
                "Email already in use"
            );
        });
    });

    describe("POST /api/auth/login", () => {
        it("should return 200 and a token for valid credentials", async () => {
            // Create a test user
            const user = new User();
            user.name = "Test User";
            user.email = "test@example.com";
            user.password = await argon2.hash("password");
            await user.save();

            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: "test@example.com", password: "password" });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("userDetails");
            expect(response.body.userDetails).toHaveProperty(
                "name",
                "Test User"
            );
            expect(response.body.userDetails).toHaveProperty(
                "email",
                "test@example.com"
            );
        });

        it("should return 401 for invalid credentials", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({ email: "invalid@example.com", password: "invalid" });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "message",
                "Invalid email or password."
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
