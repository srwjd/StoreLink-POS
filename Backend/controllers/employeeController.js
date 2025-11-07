import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Position from "../models/positionModel.js";

// 🔹 ดึงพนักงานทั้งหมดของร้าน
export const getEmployees = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { storeId } = req.params;

    const employees = await User.find({
      storeIds: storeId,
      role: "Employee",
    }).populate("storeIds", "storeName").populate({
      path: "positionId",
      model: "Position",
    });

    res.status(200).json({ employees });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

// 🔹 สร้างพนักงานใหม่
export const createEmployee = async (req, res) => {
  try {
    const { storeId } = req.params;
    const {
      firstName,
      lastName,
      gender,
      birthDate,
      idCard,
      idCardImage,
      phone,
      email,
      address,
      emergencyContact,
      note,
      username,
      password,
      positionId,
      role,
      status,
      salary,
      profileImage
    } = req.body;

    // ตรวจสอบว่าต้องมี email หรือ username อย่างน้อยหนึ่งอย่าง
    if (!email && !username) {
      return res.status(400).json({ message: "กรุณากรอกอีเมลหรือชื่อผู้ใช้" });
    }

    // ตรวจสอบ email ซ้ำ (ถ้ามี)
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail)
        return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
    }

    // ตรวจสอบ username ซ้ำ (ถ้ามี)
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername)
        return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const employeeData = {
      firstName,
      lastName,
      password: hashed,
      role: role || "Employee",
      storeIds: [storeId],
      positionId,
      status: status || "active",
      hireDate: new Date(), // บันทึกอัตโนมัติเป็นวันที่ปัจจุบัน
    };

    // เพิ่มฟิลด์ที่ส่งมา (ถ้ามี)
    if (gender) employeeData.gender = gender;
    if (birthDate) employeeData.birthDate = new Date(birthDate);
    if (idCard) employeeData.idCard = idCard;
    if (idCardImage) employeeData.idCardImage = idCardImage;
    if (phone) employeeData.phone = phone;
    if (email) employeeData.email = email;
    if (address) employeeData.address = address;
    if (emergencyContact) employeeData.emergencyContact = emergencyContact;
    if (note) employeeData.note = note;
    if (username) employeeData.username = username;
    if (salary !== undefined && salary !== null) employeeData.salary = salary;
    if (profileImage) employeeData.profileImage = profileImage;

    const newEmployee = await User.create(employeeData);

    res.status(201).json({
      message: "เพิ่มพนักงานสำเร็จ",
      employee: newEmployee,
    });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

// 🧩 อัปเดตข้อมูลพนักงาน
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      gender,
      birthDate,
      idCard,
      idCardImage,
      phone,
      email,
      address,
      emergencyContact,
      note,
      username,
      password,
      positionId,
      role,
      status,
      salary,
      profileImage
    } = req.body;

    // ดึงข้อมูลพนักงานปัจจุบันเพื่อตรวจสอบสถานะเดิม
    const currentEmployee = await User.findById(id);
    if (!currentEmployee)
      return res.status(404).json({ message: "ไม่พบพนักงานที่ต้องการแก้ไข" });

    const updateData = {};

    // ตรวจสอบ email ซ้ำ (ถ้ามีการเปลี่ยน)
    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingEmail)
        return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
      updateData.email = email;
    }

    // ตรวจสอบ username ซ้ำ (ถ้ามีการเปลี่ยน)
    if (username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: id } });
      if (existingUsername)
        return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
      updateData.username = username;
    }

    // อัปเดตฟิลด์อื่นๆ
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (gender !== undefined) updateData.gender = gender;
    if (birthDate) updateData.birthDate = new Date(birthDate);
    if (idCard !== undefined) updateData.idCard = idCard;
    if (idCardImage !== undefined) updateData.idCardImage = idCardImage;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (note !== undefined) updateData.note = note;
    if (positionId) updateData.positionId = positionId;
    if (role) updateData.role = role;
    if (status) {
      updateData.status = status;
      // ถ้าเปลี่ยนสถานะเป็น inactive และยังไม่มี resignDate → บันทึกวันที่ลาออกอัตโนมัติ
      if (status === "inactive" && currentEmployee.status === "active" && !currentEmployee.resignDate) {
        updateData.resignDate = new Date();
      }
      // ถ้าเปลี่ยนสถานะกลับเป็น active → ลบ resignDate
      if (status === "active" && currentEmployee.status === "inactive") {
        updateData.resignDate = null;
      }
    }
    if (salary !== undefined && salary !== null) updateData.salary = salary;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // อัปเดตรหัสผ่าน (ถ้ามี)
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "ไม่พบพนักงานที่ต้องการแก้ไข" });

    res.status(200).json({ message: "อัปเดตพนักงานสำเร็จ", employee: updated });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

// 🗑️ ลบพนักงาน
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // บันทึกวันที่ลาออกก่อนลบ (ถ้ายังไม่มี)
    const employee = await User.findById(id);
    if (employee && !employee.resignDate) {
      await User.findByIdAndUpdate(id, { resignDate: new Date() });
    }
    
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ message: "ไม่พบพนักงานที่ต้องการลบ" });

    res.status(200).json({ message: "ลบพนักงานสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
};

