import request from "supertest";
import app from "../app.js";
import * as chai from "chai";
import connectDB from "../config/db.js";
import mongoose from "mongoose";

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
