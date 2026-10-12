import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import sceneRoutes from "./routes/sceneRoutes.js";
import choiceRoutes from "./routes/choiceRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api/projects/:projectId/scenes", sceneRoutes);
app.use("/api/projects/:projectId/choices", choiceRoutes);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});