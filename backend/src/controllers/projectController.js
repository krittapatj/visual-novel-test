import {
  createProject as insertProject,
  getProjectsByUserId,
} from "../models/projectModel.js";

export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body ?? {};
    const user_id = req.user.user_id;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required"
      });
    }
    if (description != null && typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid description"
      });
    }
    if (title.trim().length > 255) {
      return res.status(400).json({
        success: false,
        message: "Title must not exceed 255 characters"
      });
    }

    const project = await insertProject(
      user_id,
      title.trim(),
      description ?? null
    );
    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const projects = await getProjectsByUserId(user_id);

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};