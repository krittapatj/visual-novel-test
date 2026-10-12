import db from "../config/db.js";

export const findOwnedProject = async (projectId, userId) => {
  const [rows] = await db.execute(
    "SELECT project_id FROM projects WHERE project_id = ? AND user_id = ?",
    [projectId, userId]
  );
  return rows[0] || null;
};

export const listScenes = async (projectId) => {
  const [rows] = await db.execute(
    "SELECT * FROM scenes WHERE project_id = ? ORDER BY scene_order, scene_id",
    [projectId]
  );
  return rows;
};

export const findScene = async (projectId, sceneId) => {
  const [rows] = await db.execute(
    "SELECT * FROM scenes WHERE project_id = ? AND scene_id = ?",
    [projectId, sceneId]
  );
  return rows[0] || null;
};

export const insertScene = async (projectId, name, backgroundUrl) => {
  const [orderRows] = await db.execute(
    "SELECT COALESCE(MAX(scene_order), 0) + 1 AS next_order FROM scenes WHERE project_id = ?",
    [projectId]
  );
  const [result] = await db.execute(
    "INSERT INTO scenes (project_id, scene_name, background_url, scene_order) VALUES (?, ?, ?, ?)",
    [projectId, name, backgroundUrl, orderRows[0].next_order]
  );
  return findScene(projectId, result.insertId);
};

export const saveScene = async (projectId, sceneId, name, backgroundUrl) => {
  const [result] = await db.execute(
    "UPDATE scenes SET scene_name = ?, background_url = ? WHERE project_id = ? AND scene_id = ?",
    [name, backgroundUrl, projectId, sceneId]
  );
  return result.affectedRows;
};

export const removeScene = async (projectId, sceneId) => {
  const [result] = await db.execute(
    "DELETE FROM scenes WHERE project_id = ? AND scene_id = ?",
    [projectId, sceneId]
  );
  return result.affectedRows;
};