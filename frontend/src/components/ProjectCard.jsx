function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-thumbnail">
        <span>♡</span>
      </div>

      <div className="project-info">
        <h3>{project.title}</h3>
        <p>{project.description || "ไม่มีคำอธิบาย"}</p>
      </div>
    </div>
  );
}

export default ProjectCard;