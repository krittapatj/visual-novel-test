const BASE = "http://localhost:5000/api/projects";
const request = async (path, options = {}) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Scene request failed");
  return result.data;
};

export const getScenes = (projectId) =>
  request(`/${projectId}/scenes`);
export const createScene = (projectId, data) =>
  request(`/${projectId}/scenes`, { method: "POST", body: JSON.stringify(data) });
export const updateScene = (projectId, sceneId, data) =>
  request(`/${projectId}/scenes/${sceneId}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteScene = (projectId, sceneId) =>
  request(`/${projectId}/scenes/${sceneId}`, { method: "DELETE" });