import db from "../config/db.js";

// ตรวจสอบว่า Project เป็นของ User ที่ Login หรือไม่
export const findOwnedProject = async (projectId, userId) => {
  const [rows] = await db.execute(
    `SELECT project_id
     FROM projects
     WHERE project_id = ? AND user_id = ?`,
    [projectId, userId]
  );

  return rows[0] || null;
};

// ดึง Scene ทั้งหมดของ Project
export const getScenesByProjectId = async (projectId) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM scenes
     WHERE project_id = ?
     ORDER BY scene_order ASC, scene_id ASC`,
    [projectId]
  );

  return rows;
};

// ดึง Scene ตาม ID
export const getSceneById = async (projectId, sceneId) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM scenes
     WHERE project_id = ? AND scene_id = ?`,
    [projectId, sceneId]
  );

  return rows[0] || null;
};

// สร้าง Scene ใหม่
export const createScene = async (
  projectId,
  sceneName,
  backgroundUrl = null
) => {
  const [orderRows] = await db.execute(
    `SELECT COALESCE(MAX(scene_order), 0) + 1 AS next_order
     FROM scenes
     WHERE project_id = ?`,
    [projectId]
  );

  const [result] = await db.execute(
    `INSERT INTO scenes
     (project_id, scene_name, background_url, scene_order)
     VALUES (?, ?, ?, ?)`,
    [
      projectId,
      sceneName,
      backgroundUrl,
      orderRows[0].next_order,
    ]
  );

  return getSceneById(projectId, result.insertId);
};

// แก้ไข Scene
export const updateScene = async (
  projectId,
  sceneId,
  sceneName,
  backgroundUrl,
  text = null
) => {
  const [result] = await db.execute(
    `UPDATE scenes
     SET scene_name = ?, background_url = ?, text = ?
     WHERE project_id = ? AND scene_id = ?`,
    [
      sceneName,
      backgroundUrl,
      text,
      projectId,
      sceneId,
    ]
  );

  return result.affectedRows;
};

// ลบ Scene
export const deleteScene = async (projectId, sceneId) => {
  const [result] = await db.execute(
    `DELETE FROM scenes
     WHERE project_id = ? AND scene_id = ?`,
    [projectId, sceneId]
  );

  return result.affectedRows;
};