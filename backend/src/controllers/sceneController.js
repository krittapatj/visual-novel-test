import * as Scene from "../models/sceneModel.js";

const validId = (value) => /^[1-9]\d*$/.test(String(value));
const error500 = (res, err) => {
  console.error("Scene API error:", err);
  return res.status(500).json({ success: false, message: "Internal server error" });
};

const owned = async (req, res) => {
  const { projectId } = req.params;
  if (!validId(projectId)) {
    res.status(400).json({ success: false, message: "Invalid project ID" });
    return false;
  }
  const project = await Scene.findOwnedProject(projectId, req.user.user_id);
  if (!project) {
    res.status(404).json({ success: false, message: "Project not found" });
    return false;
  }
  return true;
};

const parseScene = (body) => {
  const name = body.scene_name;
  const url = body.background_url ?? null;
  if (typeof name !== "string" || !name.trim() || name.trim().length > 255)
    return { error: "Scene name must be 1–255 characters" };
  if (url !== null && (typeof url !== "string" || url.length > 2048))
    return { error: "Invalid background URL" };
  if (url && !/^https?:\/\//i.test(url))
    return { error: "Background URL must start with http:// or https://" };
  return { name: name.trim(), url: url || null };
};

export const getScenes = async (req, res) => {
  try {
    if (!(await owned(req, res))) return;
    return res.json({ success: true, data: await Scene.listScenes(req.params.projectId) });
  } catch (err) { return error500(res, err); }
};

export const getScene = async (req, res) => {
  try {
    if (!(await owned(req, res))) return;
    if (!validId(req.params.sceneId)) return res.status(400).json({ success: false, message: "Invalid scene ID" });
    const scene = await Scene.findScene(req.params.projectId, req.params.sceneId);
    if (!scene) return res.status(404).json({ success: false, message: "Scene not found" });
    return res.json({ success: true, data: scene });
  } catch (err) { return error500(res, err); }
};

export const createScene = async (req, res) => {
  try {
    if (!(await owned(req, res))) return;
    const input = parseScene(req.body || {});
    if (input.error) return res.status(400).json({ success: false, message: input.error });
    const scene = await Scene.insertScene(req.params.projectId, input.name, input.url);
    return res.status(201).json({ success: true, data: scene });
  } catch (err) { return error500(res, err); }
};

export const updateScene = async (req, res) => {
  try {
    if (!(await owned(req, res))) return;
    if (!validId(req.params.sceneId)) return res.status(400).json({ success: false, message: "Invalid scene ID" });
    const input = parseScene(req.body || {});
    if (input.error) return res.status(400).json({ success: false, message: input.error });
    const changed = await Scene.saveScene(req.params.projectId, req.params.sceneId, input.name, input.url);
    if (!changed) return res.status(404).json({ success: false, message: "Scene not found" });
    return res.json({ success: true, data: await Scene.findScene(req.params.projectId, req.params.sceneId) });
  } catch (err) { return error500(res, err); }
};

export const deleteScene = async (req, res) => {
  try {
    if (!(await owned(req, res))) return;
    if (!validId(req.params.sceneId)) return res.status(400).json({ success: false, message: "Invalid scene ID" });
    const deleted = await Scene.removeScene(req.params.projectId, req.params.sceneId);
    if (!deleted) return res.status(404).json({ success: false, message: "Scene not found" });
    return res.json({ success: true, message: "Scene deleted" });
  } catch (err) { return error500(res, err); }
};