import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import {
  createProject,
  getProjects,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", verifyToken, createProject);
router.get("/", verifyToken, getProjects);

export default router;