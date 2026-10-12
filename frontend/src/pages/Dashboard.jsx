import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProjects } from "../services/projectService";
import ProjectCard from "../components/ProjectCard";
import CreateProject from "../components/CreateProject";

import "../styles/dashboard.css";
function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const loadProjects = async () => {
    try {
      setError("");
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>▣ Visual Novel Studio</h2>

        <div className="account">
          <span>{user?.username || "My Account"}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <h1>My Projects</h1>
        <p>จัดการโปรเจกต์นิยายภาพของคุณ</p>

        {error && <p className="error">{error}</p>}

        <div className="projects-grid">
          <button
            className="project-card create-card"
            onClick={() => setShowCreate(true)}
          >
            <div className="project-thumbnail">
              <span>+</span>
            </div>

            <div className="project-info">
              <h3>Create New Project</h3>
              <p>เริ่มสร้างนิยายเรื่องใหม่</p>
            </div>
          </button>

          {!loading &&
            projects.map((project) => (
              <ProjectCard
                key={project.project_id}
                project={project}
              />
            ))}
        </div>

        {loading && <p>กำลังโหลดโปรเจกต์...</p>}

        {!loading && !error && projects.length === 0 && (
          <p>ยังไม่มีโปรเจกต์ เริ่มสร้างเรื่องแรกของคุณได้เลย!</p>
        )}
      </main>

      {showCreate && (
        <CreateProject
          onClose={() => setShowCreate(false)}
          onCreated={loadProjects}
        />
      )}
    </div>
  );
}

export default Dashboard;