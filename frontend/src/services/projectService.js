const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/projects`;

export const getProjects = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "ไม่สามารถโหลดโปรเจกต์ได้");
  }

  return data.data;
};

export const createProject = async (title, description) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "สร้างโปรเจกต์ไม่สำเร็จ");
  }

  return data.data;
};