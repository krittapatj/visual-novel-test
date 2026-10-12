import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getScenes, getScene, createScene, updateScene, deleteScene } from "../controllers/sceneController.js";

const router = Router({ mergeParams: true });
router.use(verifyToken);
router.get("/", getScenes);
router.post("/", createScene);
router.get("/:sceneId", getScene);
router.put("/:sceneId", updateScene);
router.delete("/:sceneId", deleteScene);
export default router;