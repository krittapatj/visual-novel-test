
import {
  findOwnedProject,
  getScenesByProjectId,
  getSceneById,
  createScene as insertScene,
  updateScene as editScene,
  deleteScene as removeScene,
} from "../models/sceneModel.js";

// ตรวจสอบว่า ID เป็นจำนวนเต็มบวก
const isValidId = (id) => /^[1-9]\d*$/.test(String(id));

// ตรวจสอบว่า Project เป็นของ User ที่ Login หรือไม่
const checkProjectOwner = async (req, res) => {
  const { projectId } = req.params;

  if (!isValidId(projectId)) {
    res.status(400).json({
      success: false,
      message: "Invalid project ID",
    });
    return false;
  }

  const project = await findOwnedProject(
    projectId,
    req.user.user_id
  );

  if (!project) {
    res.status(404).json({
      success: false,
      message: "Project not found",
    });
    return false;
  }

  return true;
};

// ตรวจสอบข้อมูล Scene ก่อนบันทึก
const validateScene = (body) => {
  const { scene_name, background_url = null, text = null } = body;
  if (text !== null && typeof text !== "string") return { error: "Invalid story text" };

  if (
    typeof scene_name !== "string" ||
    !scene_name.trim() ||
    scene_name.trim().length > 255
  ) {
    return {
      error: "Scene name must be 1-255 characters",
    };
  }

  if (
    background_url !== null &&
    (typeof background_url !== "string" ||
      background_url.length > 2048)
  ) {
    return { error: "Invalid background URL" };
  }

  if (
    background_url &&
    !/^https?:\/\//i.test(background_url)
  ) {
    return {
      error: "Background URL must start with http:// or https://",
    };
  }

  return {
    sceneName: scene_name.trim(),
    backgroundUrl: background_url || null,
    text,
  };
};

// GET: ดึง Scene ทั้งหมด
export const getScenes = async (req, res) => {
  try {
    if (!(await checkProjectOwner(req, res))) return;

    const scenes = await getScenesByProjectId(
      req.params.projectId
    );

    return res.status(200).json({
      success: true,
      data: scenes,
    });
  } catch (error) {
    console.error("Get scenes error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET: ดึง Scene เดียว
export const getScene = async (req, res) => {
  try {
    if (!(await checkProjectOwner(req, res))) return;

    const { projectId, sceneId } = req.params;

    if (!isValidId(sceneId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scene ID",
      });
    }

    const scene = await getSceneById(projectId, sceneId);

    if (!scene) {
      return res.status(404).json({
        success: false,
        message: "Scene not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: scene,
    });
  } catch (error) {
    console.error("Get scene error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST: สร้าง Scene ใหม่
export const createScene = async (req, res) => {
  try {
    if (!(await checkProjectOwner(req, res))) return;

    const input = validateScene(req.body || {});

    if (input.error) {
      return res.status(400).json({
        success: false,
        message: input.error,
      });
    }

    const scene = await insertScene(
      req.params.projectId,
      input.sceneName,
      input.backgroundUrl
    );

    return res.status(201).json({
      success: true,
      message: "Scene created successfully",
      data: scene,
    });
  } catch (error) {
    console.error("Create scene error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PUT: แก้ไข Scene
export const updateScene = async (req, res) => {
  try {
    if (!(await checkProjectOwner(req, res))) return;

    const { projectId, sceneId } = req.params;

    if (!isValidId(sceneId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scene ID",
      });
    }

    const input = validateScene(req.body || {});

    if (input.error) {
      return res.status(400).json({
        success: false,
        message: input.error,
      });
    }

    const affectedRows = await editScene(
      projectId,
      sceneId,
      input.sceneName,
      input.backgroundUrl,
      input.text
    );

    if (!affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Scene not found",
      });
    }

    const updatedScene = await getSceneById(
      projectId,
      sceneId
    );

    return res.status(200).json({
      success: true,
      message: "Scene updated successfully",
      data: updatedScene,
    });
  } catch (error) {
    console.error("Update scene error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE: ลบ Scene
export const deleteScene = async (req, res) => {
  try {
    if (!(await checkProjectOwner(req, res))) return;

    const { projectId, sceneId } = req.params;

    if (!isValidId(sceneId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scene ID",
      });
    }

    const affectedRows = await removeScene(
      projectId,
      sceneId
    );

    if (!affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Scene not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scene deleted successfully",
    });
  } catch (error) {
    console.error("Delete scene error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
