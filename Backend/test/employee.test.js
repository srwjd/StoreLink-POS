import request from "supertest";
import * as chai from "chai";
import jwt from "jsonwebtoken";
import app from "../app.js";
import connectDB from "../config/db.js";
import mongoose from "mongoose";
import closeDB from "../config/db.js";

const { expect } = chai;

describe("Employees API Tests", function () {
  this.timeout(10000);

  before(async () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "testsecret";
    await connectDB();
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await closeDB();
  });

  const storeId = "64a1f5c0b1f2a9b0c0d12345";

  // Helpers
  const makeTokenNoPerm = () =>
    jwt.sign(
      { id: "user-no-perm", role: "user", permissions: [] },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  const makeTokenWithPerm = () =>
    jwt.sign(
      { id: "user-admin", role: "admin", permissions: ["manage_employees"] },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  // -----------------------------
  //  Test 1: ไม่มี token → ต้อง 401
  // -----------------------------
  it("GET /employees/:storeId → 401 when no token", async function () {
    const res = await request(app).get(`/employees/${storeId}`);
    expect(res.status).to.equal(401);
  });

  it("POST /employees/create/:storeId → 401 when no token", async function () {
    const res = await request(app).post(`/employees/create/${storeId}`).send({});
    expect(res.status).to.equal(401);
  });

  it("PUT /employees/update/:id → 401 when no token", async function () {
    const res = await request(app).put(`/employees/update/000000000000000000000000`);
    expect(res.status).to.equal(401);
  });

  it("DELETE /employees/delete/:id → 401 when no token", async function () {
    const res = await request(app).delete(`/employees/delete/000000000000000000000000`);
    expect(res.status).to.equal(401);
  });

  it("GET /employees/staff/:storeId → 401 when no token", async function () {
    const res = await request(app).get(`/employees/staff/${storeId}`);
    expect(res.status).to.equal(401);
  });

  // -----------------------------
  //  Test 2: มี token แต่ไม่มี permission → ต้อง 403
  // -----------------------------
  it("GET /employees/:storeId → 403 when no permission", async function () {
    const token = makeTokenNoPerm();
    const res = await request(app)
      .get(`/employees/${storeId}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).to.equal(403);
  });

  it("POST /employees/create/:storeId → 403 when no permission", async function () {
    const token = makeTokenNoPerm();
    const res = await request(app)
      .post(`/employees/create/${storeId}`)
      .set("Cookie", [`token=${token}`])
      .send({});

    expect(res.status).to.equal(403);
  });

  it("PUT /employees/update/:id → 403 when no permission", async function () {
    const token = makeTokenNoPerm();
    const res = await request(app)
      .put(`/employees/update/000000000000000000000000`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).to.equal(403);
  });

  it("DELETE /employees/delete/:id → 403 when no permission", async function () {
    const token = makeTokenNoPerm();
    const res = await request(app)
      .delete(`/employees/delete/000000000000000000000000`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).to.equal(403);
  });

  // -----------------------------
  //  Test 3: token มี permission → ต้องผ่าน (ไม่ใช่ 401/403)
  // -----------------------------
  it("GET /employees/:storeId → allow when has permission", async function () {
    const token = makeTokenWithPerm();
    const res = await request(app)
      .get(`/employees/${storeId}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).to.not.be.oneOf([401, 403]);
  });

  it("POST /employees/create/:storeId → allow when has permission", async function () {
    const token = makeTokenWithPerm();
    const res = await request(app)
      .post(`/employees/create/${storeId}`)
      .set("Cookie", [`token=${token}`])
      .send({
        firstName: "Test",
        lastName: "User",
        username: "user" + Date.now(),
        password: "123456",
      });

    expect(res.status).to.not.be.oneOf([401, 403]);
  });

  it("PUT /employees/update/:id → allow when has permission", async function () {
    const token = makeTokenWithPerm();
    const res = await request(app)
      .put(`/employees/update/000000000000000000000000`)
      .set("Cookie", [`token=${token}`])
      .send({ firstName: "Updated" });

    expect(res.status).to.not.be.oneOf([401, 403]);
  });

  it("DELETE /employees/delete/:id → allow when has permission", async function () {
    const token = makeTokenWithPerm();
    const res = await request(app)
      .delete(`/employees/delete/000000000000000000000000`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).to.not.be.oneOf([401, 403]);
  });

  // -----------------------------
  //  Test 4: staff route → token อย่างเดียวก็เข้าได้
  // -----------------------------
  it("GET /employees/staff/:storeId → allow when has token", async function () {
    const token = makeTokenNoPerm();
    const res = await request(app)
      .get(`/employees/staff/${storeId}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).to.not.be.oneOf([401, 403]);
  });
});
