import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app.js";
import * as chai from "chai";
import connectDB from "../config/db.js";
import mongoose from "mongoose";

import userModel from "../models/userModel.js";

const expect = chai.expect;

// ก่อนเริ่ม test → เปิด in-memory DB
before(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

// หลังจบ test → ปิด connection
after(async () => {
  await mongoose.connection.close();
});

describe("Auth API Tests", function () {
  this.timeout(10000);

  it("should register a new user", async function () {
    const response = await request(app)
      .post("/auth/register")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "test" + Date.now() + "@example.com",
        password: "password123",
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("token");
    expect(response.body).to.have.property("user");
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    // ล้าง database ก่อนสร้าง user ใหม่ทุก test
    await userModel.deleteMany();

    const user = new userModel({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      username: "johnd",
      password: await bcrypt.hash("mypass", 8),
      role: "Admin",
    });

    await user.save();
  });

  it("should return 400 when missing email/username or password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
      // missing password
    });
    expect(res.status).to.equal(400);
  });

  it("should login with email and return token + user info", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "mypass",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("email", "john@example.com");
  });

  it("should login with username and return token", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "johnd",
      password: "mypass",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

  it("should return 401 for wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "wrongpass",
    });

    expect(res.status).to.equal(401);
  });

  it("should set cookie 'token' (if controller sets cookie)", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "mypass",
    });

    const setCookie = res.headers["set-cookie"];
    if (setCookie) {
      expect(setCookie.some((c) => c.includes("token"))).to.be.true;
    } else {
      expect(res.body).to.have.property("token");
    }
  });
});



describe("POST /auth/logout", () => {
  it("should return 401 when no token", async () => {
    const res = await request(app).post("/auth/logout");
    expect(res.status).to.equal(401);
  });
});

describe("GET /auth/check", () => {
  it("should return 401 when no token", async () => {
    const res = await request(app).get("/auth/check");
    expect(res.status).to.equal(401);
  });
});

describe("GET /auth/profile", () => {
  it("should return 401 when no token", async () => {
    const res = await request(app).get("/auth/profile");
    expect(res.status).to.equal(401);
  });
});


