import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// ทดสอบ Server
app.get("/", (req, res) => {
  res.json({
    message: "Visual Novel API is running",
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server OK",
  });
});

// ทดสอบ TiDB
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        DATABASE() AS database_name,
        NOW() AS current_time
    `);

    res.status(200).json({
      success: true,
      message: "TiDB connected successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("TiDB Error:", error);

    res.status(500).json({
      success: false,
      message: "TiDB connection failed",
      error: error.message,
    });
  }
});

// ทดสอบอ่าน users
app.get("/api/users", async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT user_id, username, email, created_at
      FROM users
    `);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      success: false,
      message: "Cannot get users",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});