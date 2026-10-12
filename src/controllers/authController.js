import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// ==========================
// REGISTER
// ==========================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ตรวจว่ากรอกครบไหม
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบ",
      });
    }

    // ตรวจความยาว password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      });
    }

    // เช็ก username / email ซ้ำ
    const [existingUsers] = await db.query(
      `
      SELECT user_id
      FROM users
      WHERE username = ? OR email = ?
      LIMIT 1
      `,
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username หรือ Email นี้ถูกใช้งานแล้ว",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกลง TiDB
    const [result] = await db.query(
      `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
      `,
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "สมัครสมาชิกสำเร็จ",
      data: {
        user_id: result.insertId,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในระบบ",
    });
  }
};

// ==========================
// LOGIN
// ==========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอก Email และ Password",
      });
    }

    // หา user จาก email
    const [users] = await db.query(
      `
      SELECT user_id, username, email, password
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email หรือ Password ไม่ถูกต้อง",
      });
    }

    const user = users[0];

    // เปรียบเทียบ password กับ hash
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email หรือ Password ไม่ถูกต้อง",
      });
    }

    // สร้าง JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในระบบ",
    });
  }
};