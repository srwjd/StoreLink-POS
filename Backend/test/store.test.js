// test/store.test.js
import request from "supertest";
import * as chai from "chai";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import app from "../app.js";
import connectDB from "../config/db.js";

import User from "../models/userModel.js";
import Store from "../models/storeModel.js";
import Position from "../models/positionModel.js";

const expect = chai.expect;

let token;
let user;
let createdStoreId;

// ------------------------------
// BEFORE / AFTER
// ------------------------------
before(async () => {
  process.env.NODE_ENV = "test";

  await connectDB(); // in-memory MongoDB

  // สร้าง user mock (role = Owner)
  user = await User.create({
    firstName: "Test",
    lastName: "User",
    email: "storetest@example.com",
    password: "123456",
    role: "Owner",
    storeIds: [],
  });

  token = jwt.sign({ id: user._id.toString() }, "testsecret", {
    expiresIn: "1h",
  });
});

after(async () => {
  await mongoose.connection.dropDatabase().catch(() => {});
  await mongoose.connection.close();
});

// ------------------------------
describe("Store API Tests", function () {
  this.timeout(20000);

  // --------------------------
  it("POST /stores/create-store → should create store", async () => {
    const res = await request(app)
      .post("/stores/create-store")
      .set("Cookie", [`token=${token}`])
      .send({
        name: "ร้านทดสอบ",
        type: "general",
        phone: "0811112222",
        address: "Bangkok",
      });

    expect(res.status).to.equal(201);
    expect(res.body.store).to.have.property("id");

    createdStoreId = res.body.store.id;

    // เพิ่ม storeId ให้ user (เพื่อ test my-stores)
    await User.findByIdAndUpdate(user._id, {
      $push: { storeIds: createdStoreId },
    });
  });

  // --------------------------
  it("GET /stores/my-stores → should return user's stores", async () => {
    const res = await request(app)
      .get("/stores/my-stores")
      .set("Cookie", [`token=${token}`]);

    expect(res.status).to.equal(200);
    expect(res.body.stores.length).to.be.greaterThan(0);
  });

  // --------------------------
  it("GET /stores/:id → should return store by id", async () => {
    const res = await request(app)
      .get(`/stores/${createdStoreId}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id");
  });

  // --------------------------
  it("PUT /stores/update/:id → should update store", async () => {
    const res = await request(app)
      .put(`/stores/update/${createdStoreId}`)
      .set("Cookie", [`token=${token}`])
      .send({
        storeName: "ร้านทดสอบอัปเดต",
        phone: "0999999999",
      });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("_id");
  });
});
