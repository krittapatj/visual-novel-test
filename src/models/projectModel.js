import db from "../config/db.js";

export const createProject = async (user_id, title, description) => {
  const [result] = await db.execute(
    "INSERT INTO projects (user_id, title, description) VALUES (?, ?, ?)",
    [user_id, title, description]
  );
  return {
    project_id: result.insertId,
    user_id,
    title,
    description
  };
};

export const getProjectsByUserId = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT project_id, user_id, title, description
     FROM projects
     WHERE user_id = ?
     ORDER BY project_id DESC`,
    [user_id]
  );

  return rows;
};